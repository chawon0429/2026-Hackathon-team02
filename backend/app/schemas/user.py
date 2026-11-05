
from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: int
    nickname: str

    model_config = ConfigDict(from_attributes=True)
