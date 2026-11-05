// import AISummary from "../components/AI_Summary";
// import BottomTabBar from "../components/BottomTabBar";
// import { MOCK_PLACES } from "../mocks/places";
// import BottomSheet from "./BottomSheet";
// import './PlaceDetailPage.css';
// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";

// function PlaceDetailPage() {
//     const { placeId } = useParams();
//     const navigate = useNavigate();
//     const [selectedPhoto, setSelectedPhoto] = useState(null);

//     const place = MOCK_PLACES.find(
//         (p) => String(p.id) === placeId
//     );

//     if (!place) {
//         return <h2>장소를 찾을 수 없습니다.</h2>;
//     }

//     const photos = [place.thumb, ...(place.photos || [])].filter(Boolean);

//     return (
//         <div className="place-detail">
//             <div className="bluebar"></div>
//                 <main className="detail-main">
//                     <button
//                         className="back-button"
//                         onClick={() => navigate(-1)}
//                     >
//                         〈
//                     </button>

//                     <div className="store-info">
//                         <h1>{place.name}</h1>
//                         <p>{place.tags} · 리뷰 {place.reviewCount}</p>
//                     </div>
//                     <div className="store-photos">
//                         {photos.length > 0 ? (
//                             photos.map((photo, index) => (
//                                 <button
//                                     type="button"
//                                     className="store-photo"
//                                     key={index}
//                                     onClick={() => setSelectedPhoto(photo)}
//                                 >
//                                     <img src={photo} alt={`${place.name} 사진 ${index + 1}`} />
//                                 </button>
//                             ))
//                         ) : (
//                             <div className="store-photo-empty">
//                                 사진 정보가 없습니다.
//                             </div>
//                         )}
//                     </div>
//                     <AISummary placeId={place.id} />
//                 </main>

//             <BottomSheet place={place} />

//             <BottomTabBar />
//         </div>
//     );
// }

// export default PlaceDetailPage

import AISummary from "../components/AI_Summary";
import BottomTabBar from "../components/BottomTabBar";
import BottomSheet from "./BottomSheet";
import "./PlaceDetailPage.css";

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

function PlaceDetailPage() {
  const { placeId } = useParams();
  const navigate = useNavigate();

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/places/${placeId}`);

        if (!response.ok) {
          throw new Error("장소 정보를 불러오지 못했습니다.");
        }

        const data = await response.json();

        // 기존 프론트 컴포넌트와 호환되는 형태로 변환
        const mappedPlace = {
          ...data,
          id: data.id,
          name: data.name,
          tags: data.tags || data.category || "",
          reviewCount: data.review_count || 0,
          thumb: data.thumb || data.image_url || null,
          photos: data.photos || [],
        };

        setPlace(mappedPlace);
      } catch (err) {
        console.error("장소 조회 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [placeId]);

  if (loading) {
    return <h2>장소 정보를 불러오는 중입니다.</h2>;
  }

  if (error || !place) {
    return (
      <div>
        <h2>{error || "장소를 찾을 수 없습니다."}</h2>
        <button onClick={() => navigate(-1)}>돌아가기</button>
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
            {place.tags} · 리뷰 {place.reviewCount}
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

      <BottomSheet place={place} />

      <BottomTabBar />
    </div>
  );
}

export default PlaceDetailPage;
