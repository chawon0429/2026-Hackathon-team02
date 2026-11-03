from pydantic import BaseModel, Field


class ReviewSummaryRequest(BaseModel):
    reviews: list[str] = Field(
        min_length=1,
        max_length=100,
        description="요약할 장소 리뷰 목록",
    )


class ReviewSummaryResponse(BaseModel):
    summary: str = Field(
        description="장소 리뷰를 요약한 3~4줄의 문장",
    )


class ReportClassificationRequest(BaseModel):
    report_text: str = Field(
        min_length=1,
        max_length=5000,
        description="사용자가 제보 폼에 작성한 내용",
    )


class ReportClassificationResponse(BaseModel):
    accessibility: str = Field(
        description="접근성 관련 제보",
    )
    menu_product: str = Field(
        description="메뉴·상품 관련 제보",
    )
    payment_benefits: str = Field(
        description="결제·혜택 관련 제보",
    )
    ordering_usage: str = Field(
        description="주문·이용 관련 제보",
    )
    facilities: str = Field(
        description="시설 관련 제보",
    )
class PlaceSummaryRequest(BaseModel):
    place_name: str = Field(
        min_length=1,
        max_length=200,
        description="검색할 장소 이름",
    )


class PlaceSummaryResponse(BaseModel):
    summary: str = Field(
        description="웹 검색 결과를 바탕으로 작성한 장소 정보 요약",
    )