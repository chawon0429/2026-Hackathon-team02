
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceResponse

# 제보 및 관리자 API 라우터
from app.api.v1.endpoints import submissions
from app.api.v1.endpoints import submission_fields
from app.api.v1.endpoints import admin

v1_router = APIRouter()


# ==================== 장소 API ====================

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


# ==================== 제보 및 관리자 API ====================

v1_router.include_router(submissions.router)
v1_router.include_router(submission_fields.router)
v1_router.include_router(admin.router)
