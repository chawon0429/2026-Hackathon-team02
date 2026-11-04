
from pydantic import BaseModel


# 리뷰 작성 화면에서 선택할 수 있는 항목 하나를 표현하는 스키마
class SubmissionFieldResponse(BaseModel):
    name: str  # 화면에 표시할 항목 이름
    description: str | None = None  # 항목 설명 (필요한 경우 사용)


# 리뷰 작성 화면에서 선택할 항목들을 분야별로 반환하는 스키마
class SubmissionFieldGroup(BaseModel):
    category: str  # 항목 분류 (접근성, 시설 등)
    fields: list[SubmissionFieldResponse]  # 해당 분류의 선택 항목 목록
