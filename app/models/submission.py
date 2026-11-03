
from sqlalchemy import Column, Integer, String, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.db.base import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    place_id = Column(Integer, ForeignKey("places.id"), nullable=True)

    accessibility = Column(JSON, nullable=True)
    facilities = Column(JSON, nullable=True)
    usage_method = Column(String(50), nullable=True)
    waiting_time = Column(String(50), nullable=True)
    min_order = Column(String(50), nullable=True)
    content = Column(Text, nullable=True)

    source_type = Column(String(20), default="user", nullable=False)
    source_id = Column(Integer, nullable=True)

    status = Column(String(20), default="pending", nullable=False)
    reject_reason = Column(Text, nullable=True)

    user = relationship("User")
    place = relationship("Place", back_populates="submissions") # 변경

