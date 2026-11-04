
from sqlalchemy.orm import Session

from app.models.submission import Submission
from app.schemas.submission import SubmissionCreate


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
    # 검수할 리뷰 조회
    submission = get_submission(db, submission_id)

    if submission is None:
        return None

    # 리뷰 검수 상태 변경
    submission.status = status

    # 반려인 경우 사유 저장, 승인인 경우 사유 초기화
    submission.reject_reason = (
        reject_reason if status == "rejected" else None
    )

    db.commit()
    db.refresh(submission)

    return submission
