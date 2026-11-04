
from sqlalchemy import Column, Integer, String, Text
from app.db.base import Base
from sqlalchemy.orm import relationship

class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    address = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
    source_url = Column(String(1000), nullable=True)
    description = Column(Text, nullable=True)
    facts = relationship(
    "PlaceFact",
    back_populates="place",
    cascade="all, delete-orphan",
)
