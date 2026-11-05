from pydantic import BaseModel, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)
    review_count: int = 0
