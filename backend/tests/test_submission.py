# 사용자 제보 등록 → 관리자 승인 → 승인된 정보 확인 테스트
# 실제 Supabase가 아닌 임시 SQLite DB를 사용

import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.main as main_module
from app.db.base import Base
from app.db.session import get_db
from app.models.user import User


@pytest.fixture
def client(monkeypatch):
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=test_engine,
    )

    monkeypatch.setattr(main_module, "engine", test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    main_module.app.dependency_overrides[get_db] = override_get_db

    with TestClient(main_module.app) as test_client:
        db = TestingSessionLocal()
        db.add(User(nickname="테스트 사용자"))
        db.commit()
        db.close()

        yield test_client

    main_module.app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()


def test_submission_approval_and_place_facts(client):
    # 1. 테스트 장소 등록
    place_response = client.post(
        "/api/v1/places",
        json={"name": "제보 테스트 장소"},
    )

    assert place_response.status_code == 201
    place_id = place_response.json()["id"]

    # 2. 사용자 제보 등록
    submission_response = client.post(
        "/api/v1/submissions/?user_id=1",
        json={
            "place_id": place_id,
            "accessibility": ["휠체어 접근 가능"],
            "facilities": ["장애인 화장실"],
            "usage_method": "직원에게 요청",
            "content": "접근성 테스트 제보",
        },
    )

    assert submission_response.status_code == 200
    submission_id = submission_response.json()["id"]
    assert submission_response.json()["status"] == "pending"

    # 3. 관리자 제보 목록 조회
    admin_response = client.get(
        "/api/v1/admin/submissions?status=pending"
    )

    assert admin_response.status_code == 200
    assert any(
        item["id"] == submission_id
        for item in admin_response.json()
    )

    # 4. 관리자 승인
    approval_response = client.patch(
        f"/api/v1/admin/submissions/{submission_id}/review",
        json={"status": "approved"},
    )

    assert approval_response.status_code == 200
    assert approval_response.json()["status"] == "approved"

    # 5. 장소 상세 정보의 facts 확인
    facts_response = client.get(
        f"/api/v1/places/{place_id}/facts"
    )

    assert facts_response.status_code == 200

    facts = facts_response.json()["facts"]
    values = [fact["value"] for fact in facts]

    assert "휠체어 접근 가능" in values
    assert "장애인 화장실" in values
    assert "직원에게 요청" in values