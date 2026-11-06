import AISummary from "../components/AI_Summary";
import BottomTabBar from "../components/BottomTabBar";
import BottomSheet from "./BottomSheet";
import { getPlace, getPlaceFacts } from "../api/places";
import { MOCK_PLACES } from "../mocks/places";
import "./PlaceDetailPage.css";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

// 뒤로가기 화살표 SVG (파란 헤더 안에서 잘리지 않는 흰색 SVG)
function BackChevronIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function cleanText(val, fallback) {
  if (!val || val === "string" || String(val).trim() === "") return fallback;
  return val;
}

function PlaceDetailPage() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 바텀시트/화면 드래그 내리기용 state & ref
  const [dragY, setDragY] = useState(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const mainRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlace() {
      setLoading(true);
      setError("");
      setPlace(null);

      try {
        const data = await getPlace(placeId);
        let factData = { facts: [] };

        try {
          factData = await getPlaceFacts(placeId);
        } catch (err) {
          console.error("시설 정보 조회 실패:", err);
        }

        const facts = {
          access: {},
          facility: {},
          menu: {},
          benefit: {},
          order: {},
        };

        const factTypes = {
          accessibility: "access",
          facility: "facility",
          usage_method: "order",
          waiting_time: "order",
          min_order: "order",
        };

        for (const fact of factData.facts || []) {
          const category = factTypes[fact.fact_type];
          if (category && fact.value) {
            facts[category][fact.value] = true;
          }
        }

        if (!cancelled) {
          const mockFound = MOCK_PLACES.find((m) => String(m.id) === String(placeId)) || MOCK_PLACES[0];
          setPlace({
            ...data,
            id: data.id,
            name: cleanText(data.name, mockFound.name),
            tags: cleanText(data.tags || data.category, mockFound.tags || "카페, 디저트"),
            reviewCount: data.review_count ?? mockFound.reviewCount ?? 0,
            thumb: data.thumb || data.image_url || null,
            photos: data.photos || [],
            facts,
          });
        }
      } catch (err) {
        console.error("장소 조회 실패:", err);

        if (!cancelled) {
          const mockFound = MOCK_PLACES.find((m) => String(m.id) === String(placeId)) || MOCK_PLACES[0];
          setPlace({
            ...mockFound,
            id: placeId,
            name: mockFound.name,
            tags: mockFound.tags || "카페, 디저트",
            reviewCount: mockFound.reviewCount || 2,
            photos: [],
            facts: mockFound.facts || {},
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPlace();

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  // 스크롤이 최상단일 때 터치하사 아래로 끌어내리는 제스처
  const handleTouchStart = (e) => {
    if (mainRef.current && mainRef.current.scrollTop <= 5) {
      touchStartY.current = e.touches[0].clientY;
      isDragging.current = true;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY.current;

    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    if (dragY > 70) {
      // 70px 이상 아래로 끌어내리면 이전 화면으로 이동
      navigate(-1);
    }
    setDragY(0);
    isDragging.current = false;
  };

  // 로딩 화면 UI (파란 상단바 + 중앙 정돈 로딩)
  if (loading) {
    return (
      <div className="place-detail place-state-screen">
        <header className="detail-topbar">
          <button type="button" className="btn-back" onClick={() => navigate(-1)} aria-label="이전 화면으로 돌아가기">
            <BackChevronIcon />
          </button>
        </header>

        <main className="place-state-main" role="status">
          <div className="place-loading-spinner" />
          <p className="loading-title">장소 정보를 불러오는 중입니다</p>
          <span className="loading-sub">잠시만 기다려 주세요</span>
        </main>

        <BottomTabBar />
      </div>
    );
  }

  // 오류 화면 UI
  if (error || !place) {
    return (
      <div className="place-detail place-state-screen">
        <header className="detail-topbar">
          <button type="button" className="btn-back" onClick={() => navigate(-1)} aria-label="이전 화면으로 돌아가기">
            <BackChevronIcon />
          </button>
        </header>

        <main className="place-state-main">
          <p className="error-msg" role="alert">{error || "장소를 찾을 수 없습니다."}</p>

          <button
            type="button"
            className="place-retry-button"
            onClick={() => window.location.reload()}
          >
            다시 시도하기
          </button>
        </main>

        <BottomTabBar />
      </div>
    );
  }

  const photos = [place.thumb, ...(place.photos || [])].filter(Boolean);

  return (
    <div
      className="place-detail"
      style={{
        transform: `translateY(${dragY}px)`,
        transition: isDragging.current ? "none" : "transform 0.2s ease-out",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 화살표가 잘리지 않고 선명하게 들어오는 파란색 헤더 */}
      <header className="detail-topbar">
        <button type="button" className="btn-back" onClick={() => navigate(-1)} aria-label="이전 화면으로 돌아가기">
          <BackChevronIcon />
        </button>
      </header>

      <main className="detail-main" ref={mainRef}>
        <div className="store-info">
          <h1>{place.name}</h1>
          <p>
            {place.tags || "카테고리 정보 없음"} · 리뷰 {place.reviewCount}
          </p>
        </div>

        <div className="store-photos">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <button
                type="button"
                className="store-photo"
                key={index}
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo} alt={`${place.name} 사진 ${index + 1}`} />
              </button>
            ))
          ) : (
            <div className="store-photo-empty">사진 정보가 없습니다.</div>
          )}
        </div>

        <AISummary placeId={place.id} />
      </main>

      <BottomSheet
        key={place.id}
        place={place}
        openReviews={location.state?.openReviews === true}
      />

      <BottomTabBar />
    </div>
  );
}

export default PlaceDetailPage;