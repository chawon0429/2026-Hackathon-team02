from fastapi import APIRouter
from app.schemas.submission_field import SubmissionFieldGroup, SubmissionFieldResponse

router = APIRouter(prefix="/submission-fields", tags=["Submission Fields"])

@router.get("/", response_model=list[SubmissionFieldGroup])
def get_submission_fields():
    return [
        SubmissionFieldGroup(category="접근성", fields=[
            SubmissionFieldResponse(name="휠체어 접근 가능"),
            SubmissionFieldResponse(name="경사로"),
            SubmissionFieldResponse(name="자동문"),
            SubmissionFieldResponse(name="엘리베이터"),
            SubmissionFieldResponse(name="장애인 화장실"),
        ]),
        SubmissionFieldGroup(category="메뉴상품", fields=[
            SubmissionFieldResponse(name="메뉴"),
            SubmissionFieldResponse(name="상품"),
        ]),
        SubmissionFieldGroup(category="결제혜택", fields=[
            SubmissionFieldResponse(name="결제수단"),
            SubmissionFieldResponse(name="할인 및 혜택"),
        ]),
        SubmissionFieldGroup(category="주문이용", fields=[
            SubmissionFieldResponse(name="주문 방법"),
            SubmissionFieldResponse(name="이용 방법"),
            SubmissionFieldResponse(name="대기 시간"),
            SubmissionFieldResponse(name="최소 주문"),
        ]),
        SubmissionFieldGroup(category="시설", fields=[
            SubmissionFieldResponse(name="장애인 주차"),
            SubmissionFieldResponse(name="좌석"),
            SubmissionFieldResponse(name="화장실"),
            SubmissionFieldResponse(name="기타 시설"),
        ]),
    ]
