from fastapi import APIRouter
from app.api.v1.router import v1_router
from app.api.v1.endpoints.analysis import analysis_router

v1_router.include_router(analysis_router)

api_router = APIRouter()

api_router.include_router(
    v1_router,
    prefix="/api/v1",
)