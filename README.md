# Inclusive Place  _    2026-Hackathon-team02

> 장소 방문 전 필요한 접근성 정보와 이용 정보를 확인하고, 사용자 제보를 통해 더 나은 장소 정보를 만들어가는 서비스

## 1. 프로젝트 소개

Inclusive Place는 다양한 이용자가 장소 방문 전에 필요한 정보를 확인하고, 자신의 상황과 필요에 맞는 장소를 선택할 수 있도록 돕는 접근성 정보 플랫폼입니다.

기존 장소 정보 서비스에서 확인하기 어려웠던 접근성, 편의시설, 메뉴 및 상품, 결제 혜택, 주문 및 이용 방법 등의 정보를 제공하며, 사용자가 직접 경험한 정보를 제보하고 공유할 수 있습니다.

사용자 제보는 관리자 검수를 거쳐 승인된 정보로 반영되며, 이를 통해 신뢰할 수 있는 장소 정보를 지속적으로 축적합니다.

## 2. 주요 기능

### 장소 정보 탐색
- **장소 검색** — 원하는 장소를 검색하고 상세 정보를 확인합니다.
- **접근성 정보 확인** — 경사로, 자동문 등 장소의 접근성 정보를 확인합니다.
- **시설 정보 확인** — 장애인석 등 이용에 필요한 편의시설 정보를 확인합니다.
- **이용 정보 확인** — 메뉴 및 상품, 결제 혜택, 주문 및 이용 방법 등을 확인합니다.

### 사용자 제보
- **정보 제보** — 방문 경험을 바탕으로 장소의 접근성 및 이용 정보를 제보합니다.
- **제보 관리** — 작성한 제보의 승인 대기, 승인 완료, 반려 상태를 확인합니다.
- **포인트 적립** — 제보 승인에 따른 포인트 적립 내역을 확인합니다.

### 관리자 검수
- **제보 검수** — 사용자가 작성한 제보를 확인하고 승인 또는 반려합니다.
- **정보 반영** — 승인된 제보를 장소 정보에 반영하여 다른 이용자에게 제공합니다.

### AI 리뷰 분석
- **리뷰 분석** — AI를 활용하여 장소 리뷰를 분석합니다.
- **리뷰 요약** — 여러 리뷰의 주요 내용을 요약하여 장소 정보를 쉽게 파악할 수 있도록 지원합니다.

## 3. 기술 스택

### Frontend
- **React** — 사용자 및 관리자 화면 구현
- **JavaScript** — 프론트엔드 기능 개발
- **Vite** — 프론트엔드 개발 서버 및 빌드 환경

### Backend
- **Python** — 백엔드 개발 언어
- **FastAPI** — REST API 구현
- **Uvicorn** — ASGI 서버 실행
- **SQLAlchemy** — 데이터베이스 ORM 및 데이터 관리

### Database
- **PostgreSQL** — 서비스 데이터 저장 및 관리
- **Supabase** — PostgreSQL 기반 공유 데이터베이스 환경

### AI
- **LLM API** — 장소 리뷰 분석 및 요약 기능 구현

### Development
- **Git / GitHub** — 버전 관리 및 협업
- **Swagger UI** — API 명세 확인 및 테스트
- **.env** — 데이터베이스 연결 정보 및 환경 변수 관리

## 4. 시스템 아키텍처

```text
[Frontend]
React + JavaScript
        |
        | REST API
        v
[Backend]
Python + FastAPI
        |
        | SQLAlchemy
        v
[Database]
PostgreSQL / Supabase

[AI Service]
LLM API
        |
        v
리뷰 분석 및 요약
```



## 5. 웹 서비스 흐름


[장소 탐색]
     │
     ▼
[장소 상세 정보 확인]
     │
     ├─ 접근성
     ├─ 시설
     ├─ 메뉴·상품
     ├─ 결제 혜택
     └─ 주문·이용 방법
     │
     ▼
[사용자 리뷰 및 정보 제보]
     │
     ▼
[FastAPI 제보 등록 API]
     │
     ▼
[PostgreSQL submissions 저장]
     │
     ▼
[관리자 제보 검수]
     │
     ├─ 반려 → 반려 사유 저장
     │           → 사용자 상태 확인
     │
     └─ 승인 → place_facts 반영
                    │
                    ▼
            [장소 정보 조회]
                    │
                    ▼
          [승인된 정보 제공]

```

## 6. 데이터베이스 구조

### 주요 테이블
- **users** — 사용자 정보 저장
- **places** — 장소 기본 정보 저장
- **submissions** — 사용자 제보 및 리뷰 원본 저장, 제보 상태 관리
- **place_facts** — 승인된 장소별 접근성 및 이용 정보 저장
- **point_transactions** — 포인트 적립 및 거래 내역 관리

### Submission 모델 주요 필드
- **id** — 제보 고유 ID
- **user_id** — 제보 작성자 ID
- **place_id** — 제보 대상 장소 ID
- **accessibility** — 접근성 관련 정보
- **facilities** — 편의시설 관련 정보
- **usage_method** — 주문 및 이용 방법
- **waiting_time** — 대기 시간
- **min_order** — 최소 주문 정보
- **content** — 제보 및 리뷰 내용
- **status** — 제보 검수 상태

### 제보 상태
- **pending** — 관리자 검수 대기
- **approved** — 관리자 승인 완료
- **rejected** — 관리자 반려

## 7. API 명세

### 장소 정보
- **GET `/api/v1/places`** — 장소 목록 및 검색
- **GET `/api/v1/places/{place_id}`** — 장소 상세 정보 조회
- **GET `/api/v1/places/{place_id}/facts`** — 장소별 세부 정보 조회

### 사용자 제보
- **POST `/api/v1/places/{place_id}/submissions`** — 사용자 제보 등록
- **GET `/api/v1/submissions/me`** — 내 제보 목록 조회
- **GET `/api/v1/submission-fields`** — 제보 문항 및 카테고리 조회

### AI 리뷰 분석
- **POST `/api/v1/places/{place_id}/analysis`** — AI 리뷰 분석 실행
- **GET `/api/v1/places/{place_id}/analysis`** — AI 리뷰 분석 결과 조회

### 관리자 검수
- **GET `/api/v1/admin/submissions`** — 검수 대기 제보 조회
- **PATCH `/api/v1/admin/submissions/{submission_id}`** — 제보 승인 또는 반려

### 포인트
- **GET `/api/v1/users/me/points`** — 내 포인트 조회
- **GET `/api/v1/users/me/point-transactions`** — 포인트 적립 및 거래 내역 조회

> 전체 API 명세 및 테스트는 Swagger UI를 통해 확인할 수 있습니다.

## 8. 실행 방법

### 1) Repository Clone

```bash
git clone -b merge-work-rebuild https://github.com/chawon0429/2026-Hackathon-team02.git
cd 2026-Hackathon-team02
```

### 2) Backend 실행

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

의존성 설치:

```bash
pip install -r ../requirements.txt
```

환경 변수 설정:

프로젝트 루트에 `.env` 파일을 생성하고 데이터베이스 연결 정보를 설정합니다.

```env
DATABASE_URL=your_database_connection_url
```

서버 실행:

```bash
python -m uvicorn app.main:app --reload
```

### 3) Frontend 실행

새 터미널에서:

```bash
cd frontend
npm install
npm run dev
```

### 4) API 문서 확인

- **Swagger UI** — `http://127.0.0.1:8000/docs`

## 9. 기대 효과

- **정보 접근성 향상** — 방문 전 필요한 접근성 및 이용 정보를 확인할 수 있습니다.
- **정보 공유 활성화** — 사용자 경험 기반의 장소 정보를 공유할 수 있습니다.
- **정보 신뢰도 향상** — 관리자 검수를 통해 승인된 정보를 제공합니다.
- **지속적인 정보 축적** — 사용자 제보를 통해 장소 정보를 지속적으로 개선합니다.
- **편리한 장소 선택** — 다양한 이용자의 상황과 필요에 맞는 장소 선택을 지원합니다.

## 10. 프로젝트 정보

- **프로젝트명** — Inclusive Place
- **개발 형태** — 팀 프로젝트
- **주요 기술** — React, FastAPI, PostgreSQL, Supabase, LLM API








