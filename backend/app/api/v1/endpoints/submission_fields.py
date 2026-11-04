
from fastapi import APIRouter

from app.schemas.submission_field import (
    SubmissionFieldGroup,
    SubmissionFieldResponse,
)

router = APIRouter(
    prefix="/submission-fields",
    tags=["Submission Fields"],
)


# 리뷰 작성 화면에서 선택할 수 있는 항목 목록
@router.get("/", response_model=list[SubmissionFieldGroup])
def get_submission_fields():
    return [
        SubmissionFieldGroup(
            category="접근성",
            fields=[
                SubmissionFieldResponse(name="계단"),
                SubmissionFieldResponse(name="경사로"),
                SubmissionFieldResponse(name="자동문"),
                SubmissionFieldResponse(name="엘리베이터"),
                SubmissionFieldResponse(name="휠체어 가능"),
            ],
        ),
        SubmissionFieldGroup(
            category="시설",
            fields=[
                SubmissionFieldResponse(name="유아의자"),
                SubmissionFieldResponse(name="장애인석"),
                SubmissionFieldResponse(name="콘센트"),
                SubmissionFieldResponse(name="흡연구역"),
                SubmissionFieldResponse(name="주차"),
            ],
        ),
        SubmissionFieldGroup(
            category="이용 방법",
            fields=[
                SubmissionFieldResponse(name="예약없이 이용"),
                SubmissionFieldResponse(name="예약 후 이용"),
                SubmissionFieldResponse(name="포장·배달 이용"),
            ],
        ),
        SubmissionFieldGroup(
            category="대기 시간",
            fields=[
                SubmissionFieldResponse(name="바로 입장"),
                SubmissionFieldResponse(name="10분 이내"),
                SubmissionFieldResponse(name="30분 이내"),
            ],
        ),
        SubmissionFieldGroup(
            category="최소 주문",
            fields=[
                SubmissionFieldResponse(name="최소 주문 없음"),
                SubmissionFieldResponse(name="1인 1메뉴"),
                SubmissionFieldResponse(name="2인분 이상"),
            ],
        ),
    ]
