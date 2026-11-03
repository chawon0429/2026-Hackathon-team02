
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceResponse

v1_router = APIRouter()


@v1_router.post(
    "/places",
    response_model=PlaceResponse,
    status_code=201,
)
def create_place(
    place_data: PlaceCreate,
    db: Session = Depends(get_db),
):
    place = Place(**place_data.model_dump())
    db.add(place)
    db.commit()
    db.refresh(place)
    return place


@v1_router.get("/places", response_model=list[PlaceResponse])
def get_places(db: Session = Depends(get_db)):
    return db.query(Place).order_by(Place.id.desc()).all()


@v1_router.get("/places/{place_id}", response_model=PlaceResponse)
def get_place(place_id: int, db: Session = Depends(get_db)):
    place = db.query(Place).filter(Place.id == place_id).first()

    if place is None:
        raise HTTPException(
            status_code=404,
            detail="장소를 찾을 수 없습니다.",
        )

    return place
