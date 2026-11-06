
from sqlalchemy.orm import Session

from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate

from app.models.place import Place
from app.models.place_fact import PlaceFact

from app.services.point_service import earn_points
from app.integrations.llm_client import classify_review_keywords

# --------------------------------------------------
# 사용자 리뷰 등록
# --------------------------------------------------
def create_submission(
    db: Session,
    user_id: int,
    submission_data: SubmissionCreate,
) -> Submission:
    # 요청 데이터를 DB 모델로 변환
    submission = Submission(
        user_id=user_id,
        place_id=submission_data.place_id,
        accessibility=submission_data.accessibility,
        facilities=submission_data.facilities,
        usage_method=submission_data.usage_method,
        waiting_time=submission_data.waiting_time,
        min_order=submission_data.min_order,
        content=submission_data.content,
        source_type="user",
        status="pending",
    )

    # DB에 리뷰 저장
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return submission


# --------------------------------------------------
# 리뷰 단건 조회
# --------------------------------------------------
def get_submission(
    db: Session,
    submission_id: int,
) -> Submission | None:
    # 리뷰 ID로 DB 조회
    return (
        db.query(Submission)
        .filter(Submission.id == submission_id)
        .first()
    )


# --------------------------------------------------
# 특정 사용자의 리뷰 목록 조회
# --------------------------------------------------
def get_user_submissions(
    db: Session,
    user_id: int,
) -> list[Submission]:
    # 최신 리뷰가 먼저 나오도록 정렬
    return (
        db.query(Submission)
        .filter(Submission.user_id == user_id)
        .order_by(Submission.id.desc())
        .all()
    )


# --------------------------------------------------
# 관리자용 리뷰 목록 조회
# --------------------------------------------------
def get_all_submissions(
    db: Session,
    status: str | None = None,
) -> list[Submission]:
    # 전체 리뷰 조회 쿼리 생성
    query = db.query(Submission)

    # 상태 필터가 전달되면 해당 상태만 조회
    if status:
        query = query.filter(Submission.status == status)

    return query.order_by(Submission.id.desc()).all()


# --------------------------------------------------
# 관리자 리뷰 승인 또는 반려
# --------------------------------------------------
def review_submission(
    db: Session,
    submission_id: int,
    status: str,
    reject_reason: str | None = None,
) -> Submission | None:
    submission = get_submission(db, submission_id)

    if submission is None:
        return None

    # 이미 승인된 제보는 중복 반영하지 않음
    if submission.status == "approved":
        if status == "approved":
            return submission
        raise ValueError("이미 승인된 제보는 상태를 변경할 수 없습니다.")

    try:
        # 승인 시 장소 확인
        if status == "approved":
            if submission.place_id is None:
                raise ValueError("제보에 장소 ID가 없습니다.")

            place = db.query(Place).filter(
                Place.id == submission.place_id
            ).first()

            if place is None:
                raise ValueError("해당 장소가 DB에 존재하지 않습니다.")

            # 제보 항목을 장소 접근성 정보로 반영
            # 승인 전에 AI 분석을 수행한다.
            # 호출 실패 또는 결과 형식 오류 시 예외가 발생해 전체 트랜잭션이 롤백된다.
            ai_items = classify_review_keywords(submission.content or "")

            # AI 결과를 명시적으로 검증한다.
            if not isinstance(ai_items, list):
                raise ValueError("AI 분석 결과는 리스트여야 합니다.")

            validated_items = []
            seen_keywords = set()

            for item in ai_items:
                if not isinstance(item, dict):
                    raise ValueError("AI 분석 결과 항목의 형식이 올바르지 않습니다.")

                keyword = item.get("keyword")
                summary = item.get("summary")

                if not isinstance(keyword, str) or not keyword.strip():
                    raise ValueError("AI 키워드가 비어 있거나 잘못되었습니다.")

                if not isinstance(summary, str) or not summary.strip():
                    raise ValueError("AI 요약이 비어 있거나 잘못되었습니다.")

                keyword = keyword.strip()
                summary = summary.strip()
                normalized_keyword = keyword.casefold()

                if normalized_keyword in seen_keywords:
                    continue

                seen_keywords.add(normalized_keyword)
                validated_items.append({
                    "keyword": keyword,
                    "summary": summary,
                })

            # 기존 구조화 정보는 그대로 저장한다.
            fact_groups = {
                "accessibility": submission.accessibility,
                "facility": submission.facilities,
                "usage_method": submission.usage_method,
                "waiting_time": submission.waiting_time,
                "min_order": submission.min_order,
            }

            existing_facts = (
                db.query(PlaceFact)
                .filter(PlaceFact.place_id == place.id)
                .all()
            )

            # 기존 장소 정보와 이번 승인에서 추가할 정보를 함께 비교한다.
            seen_facts = {
                (fact.fact_type, fact.value.strip().casefold())
                for fact in existing_facts
            }

            def add_fact_once(fact_type: str, value: str, evidence: str | None):
                normalized_value = value.strip().casefold()
                key = (fact_type, normalized_value)

                if key in seen_facts:
                    return

                db.add(
                    PlaceFact(
                        place_id=place.id,
                        fact_type=fact_type,
                        value=value.strip(),
                        evidence=evidence,
                    )
                )
                seen_facts.add(key)

            for fact_type, values in fact_groups.items():
                if not values:
                    continue

                items = values if isinstance(values, list) else [values]

                for value in items:
                    if value is None or not str(value).strip():
                        continue

                    add_fact_once(
                        fact_type=fact_type,
                        value=str(value),
                        evidence=submission.content,
                    )

            # AI 분석 결과는 별도 유형으로 저장한다.
            # 화면에서는 keyword와 summary를 분리해 보여줄 수 있다.
            for item in validated_items:
                add_fact_once(
                    fact_type="ai_keyword",
                    value=item["keyword"],
                    evidence=item["summary"],
                )


            # 승인된 제보에 10P 적립
            # earn_points(
            #     db=db,
            #     user_id=submission.user_id,
            #     submission_id=submission.id,
            # )
            print("===== 포인트 적립 시작 =====")

            result = earn_points(
                db=db,
                user_id=submission.user_id,
                submission_id=submission.id,
            )

            print("===== 포인트 적립 결과:", result, "=====")
        # 제보 상태 변경
        submission.status = status
        submission.reject_reason = (
            reject_reason if status == "rejected" else None
        )

        # 제보 승인 + 장소 정보 반영 + 포인트 적립을 함께 저장
        db.commit()
        db.refresh(submission)

        return submission

    except Exception:
        db.rollback()
        raise
