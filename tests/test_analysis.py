# 장소 API 테스트
# 사용자 제보 및 관리자 승인 테스트
# 승인된 제보의 장소 정보 반영 테스트
# AI 분석 API 3종 테스트
# => 모두 통과

from fastapi.testclient import TestClient
from app.main import app
from app.api.v1.endpoints import analysis

client = TestClient(app)


def test_review_summary(monkeypatch):
    monkeypatch.setattr(
        analysis,
        "summarize_reviews",
        lambda reviews: "친절하고 접근성이 좋은 장소입니다."
    )

    response = client.post(
        "/api/v1/analysis/review-summary",
        json={"reviews": ["친절해요", "휠체어 접근 가능해요"]}
    )

    assert response.status_code == 200
    assert response.json()["summary"] == "친절하고 접근성이 좋은 장소입니다."


def test_report_classification(monkeypatch):
    monkeypatch.setattr(
        analysis,
        "classify_report",
        lambda report_text: {
            "accessibility": "휠체어 접근 가능",
            "menu_product": "정보 없음",
            "payment_benefits": "정보 없음",
            "ordering_usage": "직원에게 요청",
            "facilities": "장애인 화장실 있음",
        }
    )

    response = client.post(
        "/api/v1/analysis/report-classification",
        json={"report_text": "휠체어 접근이 가능하고 장애인 화장실이 있습니다."}
    )

    assert response.status_code == 200
    assert response.json()["accessibility"] == "휠체어 접근 가능"


def test_place_summary(monkeypatch):
    monkeypatch.setattr(
        analysis,
        "summarize_place",
        lambda place_name: "접근성이 좋은 장소입니다."
    )

    response = client.post(
        "/api/v1/analysis/place-summary",
        json={"place_name": "테스트 장소"}
    )

    assert response.status_code == 200
    assert response.json()["summary"] == "접근성이 좋은 장소입니다."
    
    
    