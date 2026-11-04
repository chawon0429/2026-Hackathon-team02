
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.point_transaction import PointTransaction


POINT_PER_APPROVAL = 10


def earn_points(
    db: Session,
    user_id: int,
    submission_id: int,
):
    # 이미 적립된 제보인지 확인
    existing = (
        db.query(PointTransaction)
        .filter(
            PointTransaction.submission_id == submission_id
        )
        .first()
    )

    if existing:
        return existing

    transaction = PointTransaction(
        user_id=user_id,
        submission_id=submission_id,
        amount=POINT_PER_APPROVAL,
        description="제보 승인 적립",
    )

    db.add(transaction)
    return transaction


def get_point_balance(db: Session, user_id: int) -> int:
    balance = (
        db.query(func.coalesce(func.sum(PointTransaction.amount), 0))
        .filter(PointTransaction.user_id == user_id)
        .scalar()
    )

    return int(balance)


def get_point_history(db: Session, user_id: int):
    return (
        db.query(PointTransaction)
        .filter(PointTransaction.user_id == user_id)
        .order_by(PointTransaction.created_at.desc())
        .all()
    )
