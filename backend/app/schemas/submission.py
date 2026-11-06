from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List


class SubmissionCreate(BaseModel):
    place_id: int

    # 선택 항목 목록은 각각 독립된 리스트로 생성
    accessibility: List[str] = Field(default_factory=list)
    facilities: List[str] = Field(default_factory=list)

    usage_method: Optional[str] = None
    waiting_time: Optional[str] = None
    min_order: Optional[str] = None
    content: Optional[str] = None


class SubmissionResponse(BaseModel):
    id: int
    user_id: int
    place_id: Optional[int]

    accessibility: List[str] = Field(default_factory=list)
    facilities: List[str] = Field(default_factory=list)

    usage_method: Optional[str]
    waiting_time: Optional[str]
    min_order: Optional[str]
    content: Optional[str]

    source_type: str
    source_id: Optional[int]
    status: str
    reject_reason: Optional[str]

    model_config = ConfigDict(from_attributes=True)