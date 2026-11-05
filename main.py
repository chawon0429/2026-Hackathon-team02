from contextlib import asynccontextmanager
from fastapi import FastAPI

from app import models  # noqa: F401 - register SQLAlchemy models
from app.api.v1.router import v1_router
from app.db.base import Base
from app.db.session import engine
from fastapi.middleware.cors import CORSMiddleware

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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Inclusive Place API", "status": "running"}
