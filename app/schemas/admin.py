# 관리자 스키마 작성
from pydantic import BaseModel, ConfigDict
from typing import Optional


# 관리자가 리뷰를 승인하거나 반려할 때 사용하는 요청 데이터
class SubmissionReviewRequest(BaseModel):
    status: str  # approved 또는 rejected
    reject_reason: Optional[str] = None  # 반려 사유


# 관리자에게 반환하는 리뷰 검수 정보
class SubmissionAdminResponse(BaseModel):
    id: int  # 리뷰 ID
    user_id: int  # 작성자 ID
    place_id: Optional[int]  # 장소 ID

    content: Optional[str]  # 리뷰 내용

    status: str  # 검수 상태
    reject_reason: Optional[str]  # 반려 사유

    model_config = ConfigDict(from_attributes=True)
