
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func

from app.db.base import Base


class PointTransaction(Base):
    __tablename__ = "point_transactions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    submission_id = Column(
        Integer,
        ForeignKey("submissions.id"),
        nullable=False,
        unique=True,
    )

    amount = Column(Integer, nullable=False)

    description = Column(String(200), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
