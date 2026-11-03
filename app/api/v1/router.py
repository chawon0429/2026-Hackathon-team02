from fastapi import APIRouter
from app.api.v1.endpoints import (
    admin,
    analysis,
    places,
    submissions,
    submission_fields,
)

v1_router = APIRouter()
v1_router.include_router(places.router)
v1_router.include_router(submissions.router)
v1_router.include_router(submission_fields.router)
v1_router.include_router(analysis.analysis_router)
v1_router.include_router(admin.router)
