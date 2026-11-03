from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.place import Place
from app.models.place_fact import PlaceFact
from app.schemas.place import PlaceCreate, PlaceResponse

router = APIRouter(tags=["Places"])

@router.post("/places", response_model=PlaceResponse, status_code=201)
def create_place(place_data: PlaceCreate, db: Session = Depends(get_db)):
    place = Place(**place_data.model_dump())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place

@router.get("/places", response_model=list[PlaceResponse])
def get_places(db: Session = Depends(get_db)):
    return db.query(Place).order_by(Place.id.desc()).all()

@router.get("/places/{place_id}", response_model=PlaceResponse)
def get_place(place_id: int, db: Session = Depends(get_db)):
    place = db.query(Place).filter(Place.id == place_id).first()
    if place is None:
        raise HTTPException(status_code=404, detail="place not found")
    return place

@router.get("/places/{place_id}/facts")
def get_place_facts(place_id: int, db: Session = Depends(get_db)):
    place = db.query(Place).filter(Place.id == place_id).first()
    if place is None:
        raise HTTPException(status_code=404, detail="place not found")
    facts = db.query(PlaceFact).filter(PlaceFact.place_id == place_id).all()
    return {
        "place_id": place.id,
        "place_name": place.name,
        "facts": [
            {
                "id": fact.id,
                "fact_type": fact.fact_type,
                "value": fact.value,
                "confidence": fact.confidence,
                "evidence": fact.evidence,
            }
            for fact in facts
        ],
    }
