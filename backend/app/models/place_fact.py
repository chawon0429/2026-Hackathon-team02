
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.db.base import Base


class PlaceFact(Base):
    __tablename__ = "place_facts"

    id = Column(Integer, primary_key=True, index=True)

    place_id = Column(
        Integer,
        ForeignKey("places.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    fact_type = Column(String(100), nullable=False)
    value = Column(Text, nullable=False)
    confidence = Column(Float, nullable=True)
    evidence = Column(Text, nullable=True)

    place = relationship("Place", back_populates="facts")
