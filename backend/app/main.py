from contextlib import asynccontextmanager
from fastapi import FastAPI

from app import models  # noqa: F401 - register SQLAlchemy models
from app.api.v1.router import v1_router
from app.db.base import Base
from app.db.session import engine

@asynccontextmanager
async def lifespan(app: FastAPI):
    if engine is not None:
        Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title="Inclusive Place API",
    description="Inclusive Place accessibility information service",
    version="1.0.0",
    lifespan=lifespan,
)
app.include_router(v1_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Inclusive Place API", "status": "running"}
