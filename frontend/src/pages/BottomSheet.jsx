// import { useState, useRef, useEffect } from 'react';
// import './BottomSheet.css';
// import accessIcon from "../assets/cat-access.svg";
// import facilityIcon from "../assets/cat-facility.svg";
// import menuIcon from "../assets/cat-menu.svg";
// import benefitIcon from "../assets/cat-benefit.svg";
// import orderIcon from "../assets/cat-order.svg";
// import { CATEGORIES, MOCK_REVIEWS} from "../mocks/places";
// import { useNavigate, useLocation } from "react-router-dom";
// import like from "../assets/like.svg";

// function BottomSheet({ place }) {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const CATEGORY_ICONS = {
//         access: accessIcon,
//         facility: facilityIcon,
//         menu: menuIcon,
//         benefit: benefitIcon,
//         order: orderIcon,
//     };
//     const [isOpen, setIsOpen] = useState(
//         location.state?.openReviews === true
//     );
//     const [dragHeight, setDragHeight] = useState(null);
//     const startRef = useRef(null);
//     const contentTouchStartY = useRef(null);
//     const [categoryKey, setCategoryKey] = useState("access");
//     const [likedReviews, setLikedReviews] = useState([]);
//     const [showAllReviews, setShowAllReviews] = useState(
//         location.state?.openReviews === true
//     );
//     const facts = place?.facts?.[categoryKey] || {};
//     const reviewPhotos = [
//         place?.thumb,
//         ...(place?.photos || [])
//     ].filter(Boolean);

//     const reviews = MOCK_REVIEWS.filter(
//         (review) => String(review.id) === String(place?.id)
//     );

//     function toggleSheet() {
//         setIsOpen(!isOpen);
//     }

//     function handle(e) {
//         e.currentTarget.setPointerCapture(e.pointerId);
//         startRef.current = {y: e.clientY, height: e.currentTarget.parentElement.offsetHeight};
//     }

//     function handlemove(e) {
//         if (startRef.current === null) return;

//         const distance = startRef.current.y - e.clientY;
//         const minHeight = window.innerHeight * 0.4;
//         const maxHeight = window.innerHeight - 114;
//         const newHeight = startRef.current.height + distance;
//         const height = Math.max(minHeight, Math.min(maxHeight, newHeight));

//         setDragHeight(height);
//     }

//     function handleUp(e) {
//         if (startRef.current === null) return;
//         const distance = e.clientY - startRef.current.y;
//         if (distance < -10) {
//             setIsOpen(true);
//         } else if (distance > 10) {
//             setIsOpen(false);
//         }

//         setDragHeight(null);
//         startRef.current = null;
//     }

//     function handleCancel() {
//         startRef.current = null;
//         setDragHeight(null);
//     }

//     function handleContentWheel() {
//         if (isOpen === false) {
//             setIsOpen(true);
//         }
//     }

//     function handleContentTouchStart(e) {
//         contentTouchStartY.current = e.touches[0].clientY;
//     }

//     function handleContentTouchMove(e) {
//         if (contentTouchStartY.current === null) return;

//         const distance = contentTouchStartY.current - e.touches[0].clientY;

//         if (distance > 20 && isOpen === false) {
//             setIsOpen(true);
//             contentTouchStartY.current = null;
//         }
//     }

//     let sheetClass = 'bottom-sheet';

//     if (isOpen === true) {
//         sheetClass = 'bottom-sheet open';
//     }

//     let sheetStyle = {};

//     if (dragHeight !== null) {
//         sheetStyle = {height: dragHeight + 'px',transition: 'none'};
//     }

//     function toggleLike(reviewId) {
//         if (likedReviews.includes(reviewId)) {
//             setLikedReviews(
//                 likedReviews.filter((id) => id !== reviewId)
//             );
//         } else {
//             setLikedReviews([...likedReviews, reviewId]);
//         }
//     }

//     return (
//         <div className={sheetClass} style={sheetStyle}>
//             <button className="sheet-handle"
//             type="button"
//             onClick={toggleSheet}
//             onPointerDown={handle}
//             onPointerMove={handlemove}
//             onPointerUp={handleUp}
//             onPointerCancel={handleCancel}
//             >
//                 <div className="handle-bar"></div>
//             </button>
//             <div className="sheet-content"
//                 onWheel={handleContentWheel}
//                 onTouchStart={handleContentTouchStart}
//                 onTouchMove={handleContentTouchMove}
//             >
//                 <div className="sheet-categories">
//                     {CATEGORIES.map((c) => (
//                         <button
//                             key={c.key}
//                             type="button"
//                             className={`sheet-category${categoryKey === c.key ? " is-active" : ""}`}
//                             onClick={() => {
//                                 setCategoryKey(c.key);
//                                 setIsOpen(true);
//                             }}
//                         >
//                             <img
//                                 src={CATEGORY_ICONS[c.key]}
//                                 alt=""
//                                 width="32"
//                                 height="32"
//                             />
//                             <span>{c.label}</span>
//                         </button>
//                     ))}
//                 </div>

//                 {categoryKey === "menu" ? (
//                     <div className="sheet-menu-list">
//                         {(place?.menuItems || []).map((menu) => (
//                             <div className="sheet-menu-card" key={menu.id}>
//                                 <div className="sheet-menu-info">
//                                     <div>
//                                         <h3>{menu.name}</h3>
//                                         <p className="sheet-menu-price">
//                                             {menu.price.toLocaleString()}원
//                                         </p>
//                                     </div>

//                                     <p className="sheet-menu-description">
//                                         {menu.description}
//                                     </p>
//                                 </div>

//                                 <div className="sheet-menu-photo">
//                                     {menu.image && (
//                                         <img src={menu.image} alt={menu.name} />
//                                     )}
//                                 </div>
//                             </div>
//                         ))}

//                         {(!place?.menuItems || place.menuItems.length === 0) && (
//                             <p className="sheet-menu-empty">
//                                 등록된 메뉴 정보가 없습니다.
//                             </p>
//                         )}
//                     </div>
//                 ) : (
//                     <>

//                     <ul className="sheet-facts">
//                         {Object.entries(facts)
//                             .filter(([, value]) => value === true)
//                             .map(([label]) => (
//                                 <li key={label}>
//                                     <span className="sheet-check">✓</span>
//                                     <span>{label}</span>
//                                 </li>
//                             ))}
//                     </ul>
//                 <div className="sheet-divider"></div>
//                 <h2>사진·영상 리뷰</h2>

//                 <div className="sheet-review-photos">
//                     {reviewPhotos.length > 0 ? (
//                         reviewPhotos.map((photo, index) => (
//                             <button
//                                 type="button"
//                                 className="sheet-review-photo"
//                                 key={index}
//                             >
//                                 <img src={photo} alt={`${place.name} 사진 ${index + 1}`} />
//                             </button>
//                         ))
//                     ) : (
//                         <div className="sheet-review-empty">
//                             사진 정보가 없습니다.
//                         </div>
//                     )}
//                 </div>
//                 <div className="sheet-divider"></div>
//                 <div className="sheet-review-write">
//                     <h2>
//                         <span>{place?.name}</span> 다녀오셨나요?
//                         <br />
//                         소중한 리뷰를 남겨주세요!
//                     </h2>

//                     <button
//                         type="button"
//                         className="sheet-review-write-button"
//                         onClick={() => navigate("/submission?placeId=" + place.id)}
//                     >
//                         리뷰 작성하기
//                     </button>
//                 </div>
//                 <div className="sheet-divider"></div>
//                 <div className="sheet-review-list">
//                     <div className="sheet-review-list-title">
//                         <h2>
//                             리뷰 <span>{reviews.length}</span>
//                         </h2>

//                         <button
//                             type="button"
//                             className={`sheet-review-arrow${!showAllReviews ? " is-right" : ""}`}
//                             onClick={() => setShowAllReviews(!showAllReviews)}
//                             aria-expanded={showAllReviews}
//                         >
//                             {showAllReviews ? "⌄" : "›"}
//                         </button>
//                     </div>

//                     {reviews.length > 0 ? (
//                         reviews
//                             .slice(0, showAllReviews ? reviews.length : 2)
//                             .map((review) => (
//                             <div className="sheet-review-item" key={review.reviewId}>
//                                 <div className="sheet-review-profile"></div>

//                                 <div className="sheet-review-info">
//                                     <div className="sheet-review-user">
//                                         <strong>{review.nickname}</strong>
//                                         <span>{review.date}</span>
//                                     </div>

//                                     <p>{review.content}</p>

//                                     <button
//                                         type="button"
//                                         className={`sheet-review-like${likedReviews.includes(review.reviewId) ? " is-liked" : ""}`}
//                                         onClick={() => toggleLike(review.reviewId)}
//                                         aria-pressed={likedReviews.includes(review.reviewId)}
//                                     >
//                                         <img src={like} alt="" />
//                                         좋아요 {review.likes + (likedReviews.includes(review.reviewId) ? 1 : 0)}
//                                     </button>
//                                 </div>

//                                 <span className="sheet-review-more">⋮</span>
//                             </div>
//                         ))
//                     ) : (
//                         <p className="sheet-review-empty">
//                             아직 작성된 리뷰가 없습니다.
//                         </p>
//                     )}
//                 </div>

//     </>
// )}
//             </div>

//         </div>
//     );
// }

// export default BottomSheet;

import { useState, useRef, useEffect } from "react";
import "./BottomSheet.css";
import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";
import { CATEGORIES } from "../mocks/places";
import { useNavigate, useLocation } from "react-router-dom";
import like from "../assets/like.svg";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

function BottomSheet({ place, openReviews = false }) {
  const navigate = useNavigate();
  const location = useLocation();

  const CATEGORY_ICONS = {
    access: accessIcon,
    facility: facilityIcon,
    menu: menuIcon,
    benefit: benefitIcon,
    order: orderIcon,
  };

  const shouldOpenReviews = openReviews || location.state?.openReviews === true;

  const [isOpen, setIsOpen] = useState(shouldOpenReviews);
  const [dragHeight, setDragHeight] = useState(null);

  const startRef = useRef(null);
  const contentTouchStartY = useRef(null);
  const reviewListRef = useRef(null);

  const [categoryKey, setCategoryKey] = useState("access");
  const [likedReviews, setLikedReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(shouldOpenReviews);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  const facts = place?.facts?.[categoryKey] || {};

  const reviewPhotos = [place?.thumb, ...(place?.photos || [])].filter(Boolean);

  // 리뷰 보러가기 클릭 시 BottomSheet 열고 리뷰 목록으로 이동
  useEffect(() => {
    if (!shouldOpenReviews || !place?.id) return;

    setIsOpen(true);
    setShowAllReviews(true);

    const timer = setTimeout(() => {
      reviewListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [shouldOpenReviews, place?.id]);

  // 실제 DB 승인 리뷰 조회
  useEffect(() => {
    if (!place?.id) return;

    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/admin/submissions?status=approved`,
        );

        if (!response.ok) {
          throw new Error("리뷰를 불러오지 못했습니다.");
        }

        const data = await response.json();

        const submissions = Array.isArray(data)
          ? data
          : data.items || data.submissions || [];

        const placeReviews = submissions
          .filter(
            (submission) =>
              Number(submission.place_id) === Number(place.id) &&
              submission.status === "approved",
          )
          .map((submission) => ({
            reviewId: submission.id,
            nickname: `사용자 ${submission.user_id}`,
            date: "승인 완료",
            content: submission.content || "작성된 리뷰 내용이 없습니다.",
            likes: 0,
          }));

        setReviews(placeReviews);
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setReviewsError(error.message);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [place?.id]);

  function toggleSheet() {
    setIsOpen((prev) => !prev);
  }

  function handle(e) {
    e.currentTarget.setPointerCapture(e.pointerId);

    startRef.current = {
      y: e.clientY,
      height: e.currentTarget.parentElement.offsetHeight,
    };
  }

  function handlemove(e) {
    if (startRef.current === null) return;

    const distance = startRef.current.y - e.clientY;
    const minHeight = window.innerHeight * 0.4;
    const maxHeight = window.innerHeight - 114;
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

  const sheetClass = isOpen ? "bottom-sheet open" : "bottom-sheet";

  const sheetStyle =
    dragHeight !== null
      ? {
          height: dragHeight + "px",
          transition: "none",
        }
      : {};

  function toggleLike(reviewId) {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(likedReviews.filter((id) => id !== reviewId));
    } else {
      setLikedReviews([...likedReviews, reviewId]);
    }
  }

  return (
    <div className={sheetClass} style={sheetStyle}>
      <button
        className="sheet-handle"
        type="button"
        onClick={toggleSheet}
        onPointerDown={handle}
        onPointerMove={handlemove}
        onPointerUp={handleUp}
        onPointerCancel={handleCancel}
      >
        <div className="handle-bar"></div>
      </button>

      <div
        className="sheet-content"
        onWheel={handleContentWheel}
        onTouchStart={handleContentTouchStart}
        onTouchMove={handleContentTouchMove}
      >
        <div className="sheet-categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              className={`sheet-category${
                categoryKey === c.key ? " is-active" : ""
              }`}
              onClick={() => {
                setCategoryKey(c.key);
                setIsOpen(true);
              }}
            >
              <img src={CATEGORY_ICONS[c.key]} alt="" width="32" height="32" />
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

                  <p className="sheet-menu-description">{menu.description}</p>
                </div>

                <div className="sheet-menu-photo">
                  {menu.image && <img src={menu.image} alt={menu.name} />}
                </div>
              </div>
            ))}

            {(!place?.menuItems || place.menuItems.length === 0) && (
              <p className="sheet-menu-empty">등록된 메뉴 정보가 없습니다.</p>
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
                <div className="sheet-review-empty">사진 정보가 없습니다.</div>
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

            {/* 리뷰 목록: 자동 스크롤 대상 */}
            <div className="sheet-review-list" ref={reviewListRef}>
              <div className="sheet-review-list-title">
                <h2>
                  리뷰 <span>{reviews.length}</span>
                </h2>

                <button
                  type="button"
                  className={`sheet-review-arrow${
                    !showAllReviews ? " is-right" : ""
                  }`}
                  onClick={() => setShowAllReviews((prev) => !prev)}
                  aria-expanded={showAllReviews}
                >
                  {showAllReviews ? "⌄" : "›"}
                </button>
              </div>

              {reviewsLoading ? (
                <p className="sheet-review-empty">리뷰를 불러오는 중입니다.</p>
              ) : reviewsError ? (
                <p className="sheet-review-empty">{reviewsError}</p>
              ) : reviews.length > 0 ? (
                reviews
                  .slice(0, showAllReviews ? reviews.length : 2)
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
                          className={`sheet-review-like${
                            likedReviews.includes(review.reviewId)
                              ? " is-liked"
                              : ""
                          }`}
                          onClick={() => toggleLike(review.reviewId)}
                          aria-pressed={likedReviews.includes(review.reviewId)}
                        >
                          <img src={like} alt="" />
                          좋아요{" "}
                          {review.likes +
                            (likedReviews.includes(review.reviewId) ? 1 : 0)}
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
