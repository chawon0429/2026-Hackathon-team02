# from pydantic import BaseModel, ConfigDict


# class PlaceCreate(BaseModel):
#     name: str
#     address: str | None = None
#     category: str | None = None
#     source_url: str | None = None
#     description: str | None = None


# class PlaceResponse(BaseModel):
#     id: int
#     name: str
#     address: str | None = None
#     category: str | None = None
#     source_url: str | None = None
#     description: str | None = None

#     model_config = ConfigDict(from_attributes=True)
#     review_count: int = 0




from pydantic import BaseModel, ConfigDict, Field


class PlaceCreate(BaseModel):
    name: str
    address: str | None = None
    category: str | None = None
    source_url: str | None = None
    description: str | None = None


class PlaceResponse(BaseModel):
    id: int
    name: str
    address: str | None = None
    category: str | None = None
    source_url: str | None = None
    description: str | None = None

    # 승인된 리뷰 개수
    review_count: int = 0

    # 승인된 제보에서 집계한 접근성 및 편의시설
    accessibility: list[str] = Field(default_factory=list)
    facilities: list[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)
