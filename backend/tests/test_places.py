# 실제 Supabase DB를 건드리지 않고 SQLite 임시 DB로 장소 API를 테스트

import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.main as main_module
from app.db.base import Base
from app.db.session import get_db


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

    # 실제 DB 대신 테스트 DB 사용
    monkeypatch.setattr(main_module, "engine", test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    main_module.app.dependency_overrides[get_db] = override_get_db

    with TestClient(main_module.app) as test_client:
        yield test_client

    main_module.app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()


def test_create_place(client):
    response = client.post(
        "/api/v1/places",
        json={
            "name": "테스트 장소",
            "address": "서울특별시 강남구",
            "category": "카페",
            "description": "테스트용 장소",
        },
    )

    assert response.status_code == 201
    assert response.json()["name"] == "테스트 장소"


def test_get_places(client):
    client.post(
        "/api/v1/places",
        json={"name": "테스트 장소"},
    )

    response = client.get("/api/v1/places")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_place_detail(client):
    create_response = client.post(
        "/api/v1/places",
        json={"name": "상세 조회 테스트"},
    )

    place_id = create_response.json()["id"]

    response = client.get(f"/api/v1/places/{place_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "상세 조회 테스트"