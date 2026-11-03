from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.models import User, Place, PlaceFact
from app.api.router import api_router
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    if engine is not None:
        Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Inclusive Place API",
    description="장소 접근성 및 이용 정보 제공 서비스",
    version="1.0.0",
    lifespan=lifespan,
)

app.include_router(api_router)


@app.get("/")
def root():
    return {
        "message": "Inclusive Place API",
        "status": "running",
    }