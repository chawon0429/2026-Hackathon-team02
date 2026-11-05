import AISummary from "../components/AI_Summary";
import BottomTabBar from "../components/BottomTabBar";
import BottomSheet from "./BottomSheet";
import { getPlace, getPlaceFacts } from "../api/places";
import "./PlaceDetailPage.css";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function PlaceDetailPage() {
  const { placeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPlace() {
      setLoading(true);
      setError("");
      setPlace(null);

      try {
        // 민주 브랜치: DB 장소 상세 조회
        const data = await getPlace(placeId);

        // 민주 브랜치: DB 장소별 사실 정보 조회
        let factData = { facts: [] };

        try {
          factData = await getPlaceFacts(placeId);
        } catch (err) {
          console.error("시설 정보 조회 실패:", err);
        }

        // 사실 정보 분류
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
          setPlace({
            ...data,
            id: data.id,
            name: data.name,
            tags: data.tags || data.category || "",
            reviewCount: data.review_count ?? 0,
            thumb: data.thumb || data.image_url || null,
            photos: data.photos || [],
            facts,
          });
        }
      } catch (err) {
        console.error("장소 조회 실패:", err);

        if (!cancelled) {
          setError(err.message || "장소 정보를 불러오지 못했습니다.");
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

  // 민주 브랜치: 로딩 화면
  if (loading) {
    return (
      <div className="place-detail place-state-screen">
        <div className="bluebar"></div>

        <main className="place-state-main" role="status">
          <div className="place-loading-spinner"></div>
          <p>장소 정보를 불러오는 중입니다</p>
          <span>잠시만 기다려 주세요</span>
        </main>

        <BottomTabBar />
      </div>
    );
  }

  // 민주 브랜치: 오류 화면 및 재시도
  if (error || !place) {
    return (
      <div className="place-detail place-state-screen">
        <div className="bluebar"></div>

        <main className="place-state-main">
          <p role="alert">{error || "장소를 찾을 수 없습니다."}</p>

          <button
            type="button"
            className="place-retry-button"
            onClick={() => window.location.reload()}
          >
            다시 시도하기
          </button>

          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            돌아가기
          </button>
        </main>

        <BottomTabBar />
      </div>
    );
  }

  const photos = [place.thumb, ...(place.photos || [])].filter(Boolean);

  return (
    <div className="place-detail">
      <div className="bluebar"></div>

      <main className="detail-main">
        <button className="back-button" onClick={() => navigate(-1)}>
          〈
        </button>

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

        {/* 기존 브랜치: AI 요약 기능 */}
        <AISummary placeId={place.id} />
      </main>

      {/* 기존 브랜치: 리뷰 조회 및 작성 */}
      {/* 방금 작성한 리뷰 바로 보기 상태도 유지 */}
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
