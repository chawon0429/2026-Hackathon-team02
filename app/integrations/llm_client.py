import json
import os

from google import genai


MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")


def _get_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY가 설정되지 않았습니다.")
    return genai.Client(api_key=api_key)


def summarize_reviews(reviews: list[str]) -> str:
    client = _get_client()

    prompt = f"""
다음은 한 장소에 대한 방문자 리뷰입니다.

리뷰:
{json.dumps(reviews, ensure_ascii=False)}

요구사항:
- 한국어로 장소의 전반적인 후기를 3~4줄로 요약하세요.
- 여러 리뷰에서 반복적으로 나타나는 특징을 우선하세요.
- 리뷰에 없는 사실은 추측하지 마세요.
- 광고 문구나 과장된 표현을 추가하지 마세요.
- 요약문만 반환하세요.
- 한국어로 장소의 전반적인 후기를 3~4줄로 요약하세요.
- 여러 리뷰에서 반복적으로 나타나는 특징을 우선하세요.
- 리뷰에 없는 사실은 추측하지 마세요.
- 광고 문구나 과장된 표현을 추가하지 마세요.
- 모든 문장의 종결 표현을 정중한 경어체인 "-습니다", "-입니다"로 통일하세요.
- "-해요", "-해요", "-한다", "-이다" 등의 다른 종결 표현은 사용하지 마세요.
- 요약문만 반환하세요.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
    )

    result = (response.text or "").strip()
    if not result:
        raise RuntimeError("Gemini가 리뷰 요약 결과를 반환하지 않았습니다.")

    return result


def classify_report(report_text: str) -> dict[str, str]:
    client = _get_client()

    prompt = f"""
당신은 장소 이용 제보를 정리하는 분류 도우미입니다.
아래 제보를 정확히 다음 5개 항목으로 분류하세요.

1. accessibility: 접근성
2. menu_product: 메뉴·상품
3. payment_benefits: 결제·혜택
4. ordering_usage: 주문·이용
5. facilities: 시설

규칙:
- 제보에 명시되거나 명확하게 뒷받침되는 내용만 분류하세요.
- 해당 내용이 없으면 정확히 "정보 없음"이라고 작성하세요.
- 내용을 임의로 추측하거나 새 사실을 만들지 마세요.
- 각 값은 한국어로 간결하게 작성하세요.
- 반드시 지정된 5개 키만 포함한 JSON 객체를 반환하세요.

제보:
{report_text}
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": {
                "type": "OBJECT",
                "properties": {
                    "accessibility": {"type": "STRING"},
                    "menu_product": {"type": "STRING"},
                    "payment_benefits": {"type": "STRING"},
                    "ordering_usage": {"type": "STRING"},
                    "facilities": {"type": "STRING"},
                },
                "required": [
                    "accessibility",
                    "menu_product",
                    "payment_benefits",
                    "ordering_usage",
                    "facilities",
                ],
            },
        },
    )

    try:
        result = json.loads(response.text or "")
    except (json.JSONDecodeError, TypeError) as exc:
        raise RuntimeError("Gemini의 분류 결과를 JSON으로 읽을 수 없습니다.") from exc

    keys = {
        "accessibility",
        "menu_product",
        "payment_benefits",
        "ordering_usage",
        "facilities",
    }

    if not isinstance(result, dict) or set(result) != keys:
        raise RuntimeError("Gemini의 분류 결과 형식이 올바르지 않습니다.")

    for key, value in result.items():
        if not isinstance(value, str) or not value.strip():
            result[key] = "정보 없음"

    return result

def summarize_place(place_name: str) -> str:
    """Google 검색 기반으로 장소 정보를 수집하고 요약합니다."""
    client = _get_client()

    prompt = f"""
장소명: {place_name}

Google 검색을 이용해 위 장소에 관한 공개 웹 정보를 검색하세요.
가능하면 방문자 리뷰, 이용 후기, 시설 및 이용 관련 정보를 우선적으로 확인하세요.

요구사항:
- 검색 결과에서 실제로 확인할 수 있는 내용만 요약하세요.
- 다른 동명 장소와 혼동하지 않도록 장소 정보를 확인하세요.
- 확인 가능한 정보를 한국어로 3~4줄로 요약하세요.
- 모든 문장은 정중한 경어체인 '-습니다', '-입니다'로 통일하세요.
- 검색 결과에 근거가 부족하면 확인할 수 있는 정보가 부족하다고 명시하세요.
- 리뷰에 없는 사실을 추측하거나 만들어 내지 마세요.
- 광고성 표현을 추가하지 마세요.
- 요약문만 반환하세요.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt,
        config={
            "tools": [{"google_search": {}}],
        },
    )

    result = (response.text or "").strip()
    if not result:
        raise RuntimeError("Gemini가 장소 검색 요약 결과를 반환하지 않았습니다.")

    return result
