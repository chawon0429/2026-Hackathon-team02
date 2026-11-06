import { useState, useRef, useEffect } from 'react';
import './BottomSheet.css';
import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";
import { CATEGORIES, MOCK_REVIEWS} from "../mocks/places";
import { useNavigate, useLocation } from "react-router-dom";
import like from "../assets/like.svg";

function CommentWindow({
    place, reviews, reviewsLoading, reviewsError, onRetry,
    onClose, likedReviews, onToggleLike, reviewPending
}) {
    return (
        <div className="comment-window">
            <div className="comment-window-bluebar"></div>

            <button
                type="button"
                className="comment-window-close"
                onClick={onClose}
                aria-label="닫기"
            >
                ×
            </button>

            <main className="comment-window-content">                
                <div className="comment-window-header-text">
                    <p className="comment-window-place">
                        {place?.name}
                    </p>

                    <h1 className="comment-window-title">
                        리뷰 <span>{reviews.length}</span>
                    </h1>
                </div>



                {reviewPending && (
                    <p role="status">
                        방금 작성한 리뷰는 관리자 승인 후 공개 목록에 표시됩니다.
                    </p>
                )}

                <div className="comment-window-list">
                    {reviewsLoading ? (
                        <p className="comment-window-empty">
                            승인된 리뷰를 불러오는 중입니다.
                        </p>
                    ) : reviewsError ? (
                        <div className="comment-window-empty">
                            <p>{reviewsError}</p>
                            <button type="button" onClick={onRetry}>
                                다시 불러오기
                            </button>
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((review) => {
                            const reviewId = review.reviewId ?? review.id;

                            return (
                                <div className="sheet-review-item" key={reviewId}>
                                    <div className="sheet-review-profile"></div>

                                    <div className="sheet-review-info">
                                        <div className="sheet-review-user">
                                            <strong>{review.nickname}</strong>
                                            {review.date && <span>{review.date}</span>}
                                        </div>

                                        <p>{review.content}</p>

                                        {review.likes != null && (
                                            <button
                                                type="button"
                                                className={`sheet-review-like${likedReviews.includes(reviewId) ? " is-liked" : ""}`}
                                                onClick={() => onToggleLike(reviewId)}
                                            >
                                                <img src={like} alt="" />
                                                좋아요 {review.likes + (likedReviews.includes(reviewId) ? 1 : 0)}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="comment-window-empty">
                            아직 작성된 리뷰가 없습니다.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}

function BottomSheet({
    place,
    sheetHeight,
    openReviews = false,
    reviewPending = false
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const CATEGORY_ICONS = {
        access: accessIcon,
        facility: facilityIcon,
        menu: menuIcon,
        benefit: benefitIcon,
        order: orderIcon,
    };
    const shouldOpenReviews =
        openReviews || location.state?.openReviews === true;

    const showPendingNotice =
        reviewPending || location.state?.reviewPending === true;

    const [isOpen, setIsOpen] = useState(shouldOpenReviews);

    const [dragHeight, setDragHeight] = useState(null);
    const startRef = useRef(null);
    const wasDragged = useRef(false);
    const contentTouchStartY = useRef(null);
    const [categoryKey, setCategoryKey] = useState("access");
    const [likedReviews, setLikedReviews] = useState([]);

    const [showCommentWindow, setShowCommentWindow] =
        useState(shouldOpenReviews);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState("");
    const [retryCount, setRetryCount] = useState(0);
    const facts = place?.facts?.[categoryKey] || {};
    const reviewPhotos = [
        place?.thumb,
        ...(place?.photos || [])
    ].filter(Boolean);

    useEffect(() => {
        if (!place?.id) {
            setReviews([]);
            setReviewsLoading(false);
            return;
        }

        const controller = new AbortController();

        async function fetchReviews() {
            setReviewsLoading(true);
            setReviewsError("");

            try {
                const response = await fetch(
                    "/api/v1/admin/submissions?status=approved",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("승인된 리뷰 조회에 실패했습니다.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("리뷰 데이터 형식이 올바르지 않습니다.");
                }

                const approvedReviews = data
                    .filter((item) =>
                        String(item.place_id) === String(place.id) &&
                        item.status === "approved"
                    )
                    .map((item) => {
                        const factsText = [
                            ...(item.accessibility || []),
                            ...(item.facilities || []),
                            item.usage_method,
                            item.waiting_time,
                            item.min_order
                        ].filter(Boolean).join(", ");

                        return {
                            reviewId: item.id,
                            nickname: `사용자 ${item.user_id}`,
                            date: "승인 완료",
                            content: item.content || factsText || "작성된 내용이 없습니다.",
                            likes: 0
                        };
                    });

                if (!controller.signal.aborted) {
                    setReviews(approvedReviews);
                }

            } catch (error) {
                if (controller.signal.aborted) return;

                setReviews([]);
                setReviewsError(error.message);
            } finally {
                if (!controller.signal.aborted) {
                    setReviewsLoading(false);
                }
            }
        }

        fetchReviews();

        return () => controller.abort();
    }, [place?.id, retryCount]);

    function toggleSheet() {
        if (wasDragged.current) {
            wasDragged.current = false;
            return;
        }

        setIsOpen(!isOpen);
    }
    
    function handle(e) {
        wasDragged.current = false;
        e.currentTarget.setPointerCapture(e.pointerId);
        startRef.current = {y: e.clientY, height: e.currentTarget.parentElement.offsetHeight};
    }

    function handlemove(e) {
        if (startRef.current === null) return;

        const distance = startRef.current.y - e.clientY;

        if (Math.abs(distance) > 10) {
            wasDragged.current = true;
        }

        const minHeight = window.innerHeight * 0.2;
        const maxHeight = window.innerHeight - 108;
        const newHeight = startRef.current.height + distance;
        const height = Math.max(minHeight, Math.min(maxHeight, newHeight));

        setDragHeight(height);
    }

    function handleUp(e) {
        if (startRef.current === null) return;
        const distance = e.clientY - startRef.current.y;
        if (distance < -10) {
            setIsOpen(true);
        } else if (distance > 10) {
            setIsOpen(false);
        }

        setDragHeight(null);
        startRef.current = null;
    }

    function handleCancel() {
        startRef.current = null;
        setDragHeight(null);
    }

    function handleContentWheel() {
        if (isOpen === false) {
            setIsOpen(true);
        }
    }

    function handleContentTouchStart(e) {
        contentTouchStartY.current = e.touches[0].clientY;
    }

    function handleContentTouchMove(e) {
        if (contentTouchStartY.current === null) return;

        const distance = contentTouchStartY.current - e.touches[0].clientY;

        if (distance > 20 && isOpen === false) {
            setIsOpen(true);
            contentTouchStartY.current = null;
        }
    }

    let sheetClass = 'bottom-sheet';
    
    if (isOpen === true) {
        sheetClass = 'bottom-sheet open';
    }

    let sheetStyle = {};

    if (dragHeight !== null) {
        sheetStyle = {
            height: dragHeight + 'px',
            transition: 'none'
        };
    } else if (isOpen === false && sheetHeight !== null) {
        sheetStyle = {
            height: sheetHeight + 'px'
        };
    }

    function toggleLike(reviewId) {
        if (likedReviews.includes(reviewId)) {
            setLikedReviews(
                likedReviews.filter((id) => id !== reviewId)
            );
        } else {
            setLikedReviews([...likedReviews, reviewId]);
        }
    }
    if (showCommentWindow) {
        return (
            <CommentWindow
                place={place}
                reviews={reviews}
                reviewsLoading={reviewsLoading}
                reviewsError={reviewsError}
                reviewPending={showPendingNotice}
                onRetry={() => setRetryCount((prev) => prev + 1)}
                likedReviews={likedReviews}
                onToggleLike={toggleLike}
                onClose={() => setShowCommentWindow(false)}
            />
        );
    }
    return (
        <div className={sheetClass} style={sheetStyle}>
            <button className="sheet-handle" 
            type="button"
            onClick={toggleSheet}
            onPointerDown={handle}
            onPointerMove={handlemove}
            onPointerUp={handleUp}
            onPointerCancel={handleCancel}
            >
                <div className="handle-bar"></div>
            </button>
            <div className="sheet-content"
                onWheel={handleContentWheel}
                onTouchStart={handleContentTouchStart}
                onTouchMove={handleContentTouchMove}
            >
                <div className="sheet-categories">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            className={`sheet-category${categoryKey === c.key ? " is-active" : ""}`}
                            onClick={() => {
                                setCategoryKey(c.key);
                                setIsOpen(true);
                            }}
                        >
                            <img
                                src={CATEGORY_ICONS[c.key]}
                                alt=""
                                width="32"
                                height="32"
                            />
                            <span>{c.label}</span>
                        </button>
                    ))}
                </div>

                {categoryKey === "menu" ? (
                    <div className="sheet-menu-list">
                        {(place?.menuItems || []).map((menu) => (
                            <div className="sheet-menu-card" key={menu.id}>
                                <div className="sheet-menu-info">
                                    <div>
                                        <h3>{menu.name}</h3>
                                        <p className="sheet-menu-price">
                                            {menu.price.toLocaleString()}원
                                        </p>
                                    </div>

                                    <p className="sheet-menu-description">
                                        {menu.description}
                                    </p>
                                </div>

                                <div className="sheet-menu-photo">
                                    {menu.image && (
                                        <img src={menu.image} alt={menu.name} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {(!place?.menuItems || place.menuItems.length === 0) && (
                            <p className="sheet-menu-empty">
                                등록된 메뉴 정보가 없습니다.
                            </p>
                        )}
                    </div>
                ) : (
                    <>
                    
                    <ul className="sheet-facts">
                        {Object.entries(facts)
                            .filter(([, value]) => value === true)
                            .map(([label]) => (
                                <li key={label}>
                                    <span className="sheet-check">✓</span>
                                    <span>{label}</span>
                                </li>
                            ))}
                    </ul>
                <div className="sheet-divider"></div>
                <h2>사진·영상 리뷰</h2>

                <div className="sheet-review-photos">
                    {reviewPhotos.length > 0 ? (
                        reviewPhotos.map((photo, index) => (
                            <button
                                type="button"
                                className="sheet-review-photo"
                                key={index}
                            >
                                <img src={photo} alt={`${place.name} 사진 ${index + 1}`} />
                            </button>
                        ))
                    ) : (
                        <div className="sheet-review-empty">
                            사진 정보가 없습니다.
                        </div>
                    )}
                </div>
                <div className="sheet-divider"></div>
                <div className="sheet-review-write">
                    <h2>
                        <span>{place?.name}</span> 다녀오셨나요?
                        <br />
                        소중한 리뷰를 남겨주세요!
                    </h2>

                    <button
                        type="button"
                        className="sheet-review-write-button"
                        onClick={() => navigate("/submission?placeId=" + place.id)}
                    >
                        리뷰 작성하기
                    </button>
                </div>
                <div className="sheet-divider"></div>
                <div className="sheet-review-list">
                    <div className="sheet-review-list-title">
                        <h2>
                            리뷰 <span>{reviews.length}</span>
                        </h2>

                        <button
                            type="button"
                            className="sheet-review-arrow is-right"
                            onClick={() => setShowCommentWindow(true)}
                            aria-label="전체 리뷰 보기"
                        >
                            ›
                        </button>
                    </div>

                {reviewsLoading ? (
                    <p className="sheet-review-empty">
                        승인된 리뷰를 불러오는 중입니다.
                    </p>
                ) : reviewsError ? (
                    <div className="sheet-review-empty">
                        <p>{reviewsError}</p>
                        <button
                            type="button"
                            onClick={() => setRetryCount((prev) => prev + 1)}
                        >
                            다시 불러오기
                        </button>
                    </div>
                ) : reviews.length > 0 ? (
                        reviews
                            .slice(0, 2)
                            .map((review) => (
                            <div className="sheet-review-item" key={review.reviewId}>
                                <div className="sheet-review-profile"></div>

                                <div className="sheet-review-info">
                                    <div className="sheet-review-user">
                                        <strong>{review.nickname}</strong>
                                        <span>{review.date}</span>
                                    </div>

                                    <p>{review.content}</p>

                                    <button
                                        type="button"
                                        className={`sheet-review-like${likedReviews.includes(review.reviewId) ? " is-liked" : ""}`}
                                        onClick={() => toggleLike(review.reviewId)}
                                        aria-pressed={likedReviews.includes(review.reviewId)}
                                    >
                                        <img src={like} alt="" />
                                        좋아요 {review.likes + (likedReviews.includes(review.reviewId) ? 1 : 0)}
                                    </button>
                                </div>

                                <span className="sheet-review-more">⋮</span>
                            </div>
                        ))
                    ) : (
                        <p className="sheet-review-empty">
                            아직 작성된 리뷰가 없습니다.
                        </p>
                    )}
                </div>


    </>
)}
            </div>

        </div>
    );
}

export default BottomSheet;