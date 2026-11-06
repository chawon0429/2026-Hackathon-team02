import BottomTabBar from "../components/BottomTabBar";
import { getPlace, getPlaceFacts } from "../api/places";
import BottomSheet from "./BottomSheet";
import './PlaceDetailPage.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import AISummary from "../components/AI_Summary";


function PlaceDetailPage() {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [selectedPhoto, setSelectedPhoto] = useState(null);

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const mainRef = useRef(null);
    const [sheetHeight, setSheetHeight] = useState(null);
    const [showCommentWindow, setShowCommentWindow] = useState(
        location.state?.openReviews === true
    );

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
                    order: {}
                };

                const factTypes = {
                    accessibility: "access",
                    facility: "facility",
                    usage_method: "order",
                    waiting_time: "order",
                    min_order: "order"
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
                        tags: data.category || "",
                        reviewCount: null,
                        thumb: data.thumb || data.image_url || null,
                        photos: data.photos || [],
                        facts: facts
                    });
                }

            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
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
    useEffect(() => {
        if (!place || !mainRef.current) return;

        const main = mainRef.current;

        function updateSheetHeight() {
            const paddingBottom =
                parseFloat(getComputedStyle(main).paddingBottom) || 0;

            const contentBottom =
                main.getBoundingClientRect().bottom
                + window.scrollY
                - paddingBottom;

            const availableHeight =
                window.innerHeight - 76 - contentBottom - 16;

            const maxHeight = window.innerHeight - 116;

            const newHeight = Math.max(
                window.innerHeight * 0.2,
                Math.min(availableHeight, maxHeight)
            );

            setSheetHeight(newHeight);
        }

        updateSheetHeight();

        const observer = new ResizeObserver(updateSheetHeight);
        observer.observe(main);

        window.addEventListener("resize", updateSheetHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateSheetHeight);
        };
    }, [place]);

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

    if (error || !place) {
        return (
            <div className="place-detail place-state-screen">
                <div className="bluebar"></div>

                <main className="place-state-main">
                    <p role="alert">
                        {error || "장소를 찾을 수 없습니다."}
                    </p>

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
        <div className="place-detail">
            <div className="bluebar"></div>
                <main className="detail-main" ref={mainRef}>
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        〈
                    </button>
                    <section className="store-card">
                    <div className="store-info">
                        <h1>{place.name}</h1>
                        <p>{place.tags || "카테고리 정보 없음"}</p>
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
                    </section>
                    <AISummary placeId={place.id} />              
                </main>
                {selectedPhoto && (
                    <div
                        className="photo-modal"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <button
                            type="button"
                            className="photo-close"
                            onClick={() => setSelectedPhoto(null)}
                        >
                            ×
                        </button>
                        <img
                            src={selectedPhoto}
                            alt="확대 사진"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            <BottomSheet place={place} sheetHeight={sheetHeight} />

            <BottomTabBar />
        </div>
    );
}

export default PlaceDetailPage