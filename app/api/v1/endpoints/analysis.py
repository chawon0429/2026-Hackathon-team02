from fastapi import APIRouter, HTTPException
from app.integrations.llm_client import (
    classify_report,
    summarize_reviews,
    summarize_place,
)
from app.schemas.analysis_service import (
    ReviewSummaryRequest,
    ReviewSummaryResponse,
    ReportClassificationRequest,
    ReportClassificationResponse,
    PlaceSummaryRequest,
    PlaceSummaryResponse,
)
import logging

logger = logging.getLogger(__name__)

analysis_router = APIRouter(
    prefix="/analysis",
    tags=["AI 분석"],
)


@analysis_router.post(
    "/review-summary",
    response_model=ReviewSummaryResponse,
)
def review_summary(request: ReviewSummaryRequest):
    try:
        summary = summarize_reviews(request.reviews)
        return ReviewSummaryResponse(summary=summary)
    except Exception as exc:
        logger.exception("Gemini 리뷰 요약 실패")
        raise HTTPException(
            status_code=502,
            detail="리뷰 요약에 실패했습니다. 서버 로그를 확인해 주세요.",
        ) from exc


@analysis_router.post(
    "/report-classification",
    response_model=ReportClassificationResponse,
)
def report_classification(request: ReportClassificationRequest):
    try:
        result = classify_report(request.report_text)
        return ReportClassificationResponse(**result)
    except Exception as exc:
        logger.exception("Gemini 제보 분류 실패")
        raise HTTPException(
            status_code=502,
            detail="제보 분류에 실패했습니다. 서버 로그를 확인해 주세요.",
        ) from exc
    
@analysis_router.post(
    "/place-summary",
    response_model=PlaceSummaryResponse,
)
def place_summary(request: PlaceSummaryRequest):
    try:
        summary = summarize_place(request.place_name)
        return PlaceSummaryResponse(summary=summary)
    except Exception as exc:
        logger.exception("Gemini 장소 검색 요약 실패")
        raise HTTPException(
            status_code=502,
            detail="장소 검색 및 요약에 실패했습니다. 서버 로그를 확인해 주세요.",
        ) from exc