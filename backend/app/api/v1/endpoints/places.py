# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.schemas.place import PlaceCreate, PlaceResponse

# from app.db.session import get_db
# from app.models.place import Place
# from app.models.place_fact import PlaceFact
# from app.schemas.place import PlaceResponse

# router = APIRouter(tags=["Places"])

# # 장소 생성
# @router.post("/places", response_model=PlaceResponse, status_code=201)
# def create_place(
#     place_data: PlaceCreate,
#     db: Session = Depends(get_db),
# ):
#     place = Place(**place_data.model_dump())

#     db.add(place)
#     db.commit()
#     db.refresh(place)

#     return place

# # 장소 목록 조회
# @router.get("/places", response_model=list[PlaceResponse])
# def get_places(db: Session = Depends(get_db)):
#     return db.query(Place).order_by(Place.id.desc()).all()


# # 장소 상세 조회
# @router.get("/places/{place_id}", response_model=PlaceResponse)
# def get_place(
#     place_id: int,
#     db: Session = Depends(get_db),
# ):
#     place = db.query(Place).filter(Place.id == place_id).first()

#     if place is None:
#         raise HTTPException(
#             status_code=404,
#             detail="장소를 찾을 수 없습니다.",
#         )

#     return place

# # 장소별 접근성 정보 조회
# @router.get("/places/{place_id}/facts")
# def get_place_facts(
#     place_id: int,
#     db: Session = Depends(get_db),
# ):
#     place = db.query(Place).filter(Place.id == place_id).first()

#     if place is None:
#         raise HTTPException(
#             status_code=404,
#             detail="해당 장소를 찾을 수 없습니다.",
#         )

#     facts = (
#         db.query(PlaceFact)
#         .filter(PlaceFact.place_id == place_id)
#         .all()
#     )

#     return {
#         "place_id": place.id,
#         "place_name": place.name,
#         "facts": [
#             {
#                 "id": fact.id,
#                 "fact_type": fact.fact_type,
#                 "value": fact.value,
#                 "confidence": fact.confidence,
#                 "evidence": fact.evidence,
#             }
#             for fact in facts
#         ],
#     }








from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.place import Place
from app.models.place_fact import PlaceFact
from app.models.submission import Submission
from app.schemas.place import PlaceCreate, PlaceResponse

router = APIRouter(tags=["Places"])


# 장소 생성
@router.post("/places", response_model=PlaceResponse, status_code=201)
def create_place(
    place_data: PlaceCreate,
    db: Session = Depends(get_db),
):
    place = Place(**place_data.model_dump())

    db.add(place)
    db.commit()
    db.refresh(place)

    return place


# 장소 목록 조회
# 승인된 리뷰 개수 + 접근성 + 편의시설 포함
@router.get("/places", response_model=list[PlaceResponse])
def get_places(db: Session = Depends(get_db)):

    # 모든 장소 조회
    places = (
        db.query(Place)
        .order_by(Place.id.desc())
        .all()
    )

    # 승인된 제보만 조회
    approved_submissions = (
        db.query(Submission)
        .filter(Submission.status == "approved")
        .all()
    )

    # 장소별 데이터 저장
    accessibility_map = defaultdict(set)
    facilities_map = defaultdict(set)
    review_count_map = defaultdict(int)

    for submission in approved_submissions:
        place_id = submission.place_id

        # 승인 리뷰 개수
        review_count_map[place_id] += 1

        # 접근성 정보 분류
        for item in submission.accessibility or []:
            if item:
                accessibility_map[place_id].add(item)

        # 편의시설 정보 분류
        for item in submission.facilities or []:
            if item:
                facilities_map[place_id].add(item)

    # 장소별 응답 생성
    result = []

    for place in places:
        place_data = PlaceResponse.model_validate(place).model_dump()

        place_data["review_count"] = review_count_map[place.id]

        # 중복 제거 및 정렬
        place_data["accessibility"] = sorted(
            accessibility_map[place.id]
        )
        place_data["facilities"] = sorted(
            facilities_map[place.id]
        )

        result.append(place_data)

    return result


# 장소 상세 조회
@router.get("/places/{place_id}", response_model=PlaceResponse)
def get_place(
    place_id: int,
    db: Session = Depends(get_db),
):
    place = db.query(Place).filter(Place.id == place_id).first()

    if place is None:
        raise HTTPException(
            status_code=404,
            detail="장소를 찾을 수 없습니다.",
        )

    return place


# 장소별 접근성 정보 조회 (기존 유지)
@router.get("/places/{place_id}/facts")
def get_place_facts(
    place_id: int,
    db: Session = Depends(get_db),
):
    place = db.query(Place).filter(Place.id == place_id).first()

    if place is None:
        raise HTTPException(
            status_code=404,
            detail="해당 장소를 찾을 수 없습니다.",
        )

    facts = (
        db.query(PlaceFact)
        .filter(PlaceFact.place_id == place_id)
        .all()
    )

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
