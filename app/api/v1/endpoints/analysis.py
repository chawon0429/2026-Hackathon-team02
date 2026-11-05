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
from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.submission import Submission

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
    
@analysis_router.get(
    "/places/{place_id}/submission-summary",
    response_model=ReviewSummaryResponse,
)
def summarize_place_submissions(
    place_id: int,
    db: Session = Depends(get_db),
):
    submissions = (
        db.query(Submission)
        .filter(
            Submission.place_id == place_id,
            Submission.status == "approved",
        )
        .order_by(Submission.id.desc())
        .all()
    )

    if not submissions:
        return ReviewSummaryResponse(
            summary="아직 승인된 제보가 없습니다."
        )

    reviews = []

    for submission in submissions:
        parts = []

        fields = {
            "접근성": submission.accessibility,
            "시설": submission.facilities,
            "이용 방법": submission.usage_method,
            "대기 시간": submission.waiting_time,
            "최소 주문": submission.min_order,
            "추가 제보": submission.content,
        }

        for label, value in fields.items():
            if value is not None and value != "" and value != []:
                parts.append(f"{label}: {value}")

        if parts:
            reviews.append("\n".join(parts))

    if not reviews:
        return ReviewSummaryResponse(
            summary="승인된 제보에 요약할 내용이 없습니다."
        )

    try:
        summary = summarize_reviews(reviews)
        return ReviewSummaryResponse(summary=summary)
    except Exception as exc:
        logger.exception("승인된 제보 요약 실패")
        raise HTTPException(
            status_code=502,
            detail="제보 요약에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        ) from exc