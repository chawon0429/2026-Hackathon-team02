import BottomTabBar from "../components/BottomTabBar";
import { getPlace, getPlaceFacts } from "../api/places";
import BottomSheet from "./BottomSheet";
import './PlaceDetailPage.css';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


function PlaceDetailPage() {
    const { placeId } = useParams();
    const navigate = useNavigate();
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
                const data = await getPlace(placeId);

                let factData = { facts: [] };

                try {
                    factData = await getPlaceFacts(placeId);
                } catch (err) {
                    console.error("?쒖꽕 ?뺣낫 議고쉶 ?ㅽ뙣:", err);
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

    if (loading) {
        return (
            <div className="place-detail place-state-screen">
                <div className="bluebar"></div>

                <main className="place-state-main" role="status">
                    <div className="place-loading-spinner"></div>
                    <p>?μ냼 ?뺣낫瑜?遺덈윭?ㅻ뒗 以묒엯?덈떎</p>
                    <span>?좎떆留?湲곕떎??二쇱꽭??/span>
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
                        {error || "?μ냼瑜?李얠쓣 ???놁뒿?덈떎."}
                    </p>

                    <button
                        type="button"
                        className="place-retry-button"
                        onClick={() => window.location.reload()}
                    >
                        ?ㅼ떆 ?쒕룄?섍린
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
                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        ??                    </button>

                    <div className="store-info">
                        <h1>{place.name}</h1>
                        <p>{place.tags || "移댄뀒怨좊━ ?뺣낫 ?놁쓬"}</p>
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
                    <section className="ai-summary">
                        <h2>AI?붿빟</h2>
                        <p>
                            {place.aiSummary || "?꾩쭅 AI ?붿빟 ?뺣낫媛 ?놁뒿?덈떎."}
                        </p>
                    </section>                 
                </main>

            <BottomSheet place={place} />

            <BottomTabBar />
        </div>
    );
}

export default PlaceDetailPage
