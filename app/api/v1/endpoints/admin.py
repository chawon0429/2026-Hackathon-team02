
# 관리자 API 작성
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.admin import SubmissionReviewRequest
from app.schemas.submission import SubmissionResponse
from app.services.submission_service import (
    get_all_submissions,
    review_submission,
)

router = APIRouter(prefix="/admin", tags=["Admin"])


# 관리자 리뷰 목록 조회
@router.get("/submissions", response_model=list[SubmissionResponse])
def read_all_submissions(
    status: str | None = None,
    db: Session = Depends(get_db),
):
    return get_all_submissions(db, status)


# 관리자 리뷰 승인 또는 반려
@router.patch(
    "/submissions/{submission_id}/review",
    response_model=SubmissionResponse,
)
def approve_or_reject_submission(
    submission_id: int,
    review_data: SubmissionReviewRequest,
    db: Session = Depends(get_db),
):
    # 승인 또는 반려 상태만 허용
    if review_data.status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="검수 상태는 approved 또는 rejected만 가능합니다.",
        )

    # 반려할 경우 반려 사유 필수
    if review_data.status == "rejected" and not review_data.reject_reason:
        raise HTTPException(
            status_code=400,
            detail="반려 사유를 입력해주세요.",
        )

    # 서비스 함수를 통해 검수 처리
    try:
        submission = review_submission(
            db=db,
            submission_id=submission_id,
            status=review_data.status,
            reject_reason=review_data.reject_reason,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    # 존재하지 않는 리뷰
    if submission is None:
        raise HTTPException(
            status_code=404,
            detail="해당 리뷰를 찾을 수 없습니다.",
        )

    return submission
