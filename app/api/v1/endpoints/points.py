
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.user import User
from app.services.point_service import (
    get_point_balance,
    get_point_history,
)
from app.schemas.point import (
    PointBalanceResponse,
    PointTransactionResponse,
)

router = APIRouter(prefix="/users/me", tags=["Points"])


@router.get("/points", response_model=PointBalanceResponse)
def read_my_points(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="사용자를 찾을 수 없습니다.",
        )

    points = get_point_balance(db, user_id)

    return {
        "user_id": user_id,
        "points": points,
    }


@router.get(
    "/point-transactions",
    response_model=list[PointTransactionResponse],
)
def read_my_point_transactions(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="사용자를 찾을 수 없습니다.",
        )

    return get_point_history(db, user_id)
