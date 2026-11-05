
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.submission import SubmissionCreate, SubmissionResponse
from app.services.submission_service import (
    create_submission,
    get_submission,
    get_user_submissions,
)

router = APIRouter(prefix="/submissions", tags=["Submissions"])


# 사용자 리뷰 및 제보 등록
@router.post("/", response_model=SubmissionResponse)
def submit_information(
    submission_data: SubmissionCreate,
    user_id: int,  # 현재는 사용자 ID를 요청 파라미터로 전달
    db: Session = Depends(get_db),
):
    return create_submission(db, user_id, submission_data)


# 내가 작성한 리뷰 목록 조회
# /{submission_id}보다 먼저 선언해야 경로 충돌을 방지할 수 있음
@router.get("/my", response_model=list[SubmissionResponse])
def read_my_submissions(
    user_id: int,
    db: Session = Depends(get_db),
):
    return get_user_submissions(db, user_id)


# 리뷰 단건 조회
@router.get("/{submission_id}", response_model=SubmissionResponse)
def read_submission(
    submission_id: int,
    db: Session = Depends(get_db),
):
    submission = get_submission(db, submission_id)

    if submission is None:
        raise HTTPException(
            status_code=404,
            detail="리뷰를 찾을 수 없습니다.",
        )

    return submission
