import AISummary from "../components/AI_Summary";
import BottomTabBar from "../components/BottomTabBar";
import { MOCK_PLACES } from "../mocks/places";
import BottomSheet from "./BottomSheet";
import './PlaceDetailPage.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";


function PlaceDetailPage() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const place = MOCK_PLACES.find(
        (p) => String(p.id) === placeId
    );

    if (!place) {
        return <h2>장소를 찾을 수 없습니다.</h2>;
    }

    const photos = [place.thumb, ...(place.photos || [])].filter(Boolean);

    return (
        <div className="place-detail">
            <div className="bluebar"></div>
                <main className="detail-main">
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        〈
                    </button>

                    <div className="store-info">
                        <h1>{place.name}</h1>
                        <p>{place.tags} · 리뷰 {place.reviewCount}</p>
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
                            <div className="store-photo-empty">
                                사진 정보가 없습니다.
                            </div>
                        )}
                    </div> 
                    <AISummary placeId={place.id} />            
                </main>

            <BottomSheet place={place} />

            <BottomTabBar />
        </div>
    );
}

export default PlaceDetailPage