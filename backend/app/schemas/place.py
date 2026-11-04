from pydantic import BaseModel, ConfigDict


class PlaceCreate(BaseModel):
    name: str
    address: str | None = None
    category: str | None = None
    source_url: str | None = None
    description: str | None = None


class PlaceResponse(PlaceCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)