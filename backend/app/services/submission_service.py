
from sqlalchemy.orm import Session

from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate

from app.models.place import Place
from app.models.place_fact import PlaceFact

from app.services.point_service import earn_points


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
            fact_groups = {
                "accessibility": submission.accessibility,
                "facility": submission.facilities,
                "usage_method": submission.usage_method,
                "waiting_time": submission.waiting_time,
                "min_order": submission.min_order,
                "additional_info": submission.content,
            }

            for fact_type, values in fact_groups.items():
                if not values:
                    continue

                items = values if isinstance(values, list) else [values]

                for value in items:
                    if value is None or value == "":
                        continue

                    db.add(
                        PlaceFact(
                            place_id=place.id,
                            fact_type=fact_type,
                            value=str(value),
                            evidence=submission.content,
                        )
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
