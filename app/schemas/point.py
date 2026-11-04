
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PointBalanceResponse(BaseModel):
    user_id: int
    points: int


class PointTransactionResponse(BaseModel):
    id: int
    user_id: int
    submission_id: int
    amount: int
    description: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
