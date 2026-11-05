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
        return <h2>?μ냼瑜?李얠쓣 ???놁뒿?덈떎.</h2>;
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
                        ??                    </button>

                    <div className="store-info">
                        <h1>{place.name}</h1>
                        <p>{place.tags} 쨌 由щ럭 {place.reviewCount}</p>
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
                                    <img src={photo} alt={`${place.name} ?ъ쭊 ${index + 1}`} />
                                </button>
                            ))
                        ) : (
                            <div className="store-photo-empty">
                                ?ъ쭊 ?뺣낫媛 ?놁뒿?덈떎.
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
