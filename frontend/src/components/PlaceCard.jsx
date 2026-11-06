// import "./PlaceCard.css";

// function Fact({ label, value }) {
//     if (value === true) {
//     return (
//         <li className="fact fact--yes">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
//                 strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" />
//             </svg>
//             <span>{label}</span>
//         </li>
//     );
//     }
//     if (value === false) {
//     return (
//         <li className="fact fact--no">
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
//                 strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" />
//             </svg>
//             <span>{label} 없음</span>
//         </li>
//     );
//     }
//     return (
//     <li className="fact fact--unknown">
//         <span aria-hidden="true">?</span>
//         <span>{label} 정보 없음</span>
//     </li>
//     );
// }

// export default function PlaceCard({ place, facts, onClick }) {
//     return (
//     <li className="place">
//         <button type="button" className="place__btn" onClick={onClick}>
//             <div className="place__top">
//                 <div>
//                     <h3 className="place__name">{place.name}</h3>
//                     <p className="place__meta">{place.tags} · 리뷰 {place.reviewCount}</p>
//                 </div>
//                 <div className="place__thumb" aria-hidden="true">
//                     {place.thumb && <img src={place.thumb} alt="" />}
//                 </div>
//             </div>
//             <ul className="place__facts">
//             {Object.entries(facts).map(([label, value]) => (
//                 <Fact key={label} label={label} value={value} />
//             ))}
//             </ul>
//         </button>
//     </li>
//     );
// }

import React from "react";
import "./PlaceCard.css";

// 파란색 체크 아이콘 SVG
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0057E7"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// 사용자 지정 5대 카테고리별 5개 항목 매핑
const CATEGORY_TAG_MAP = {
  access: [
    { key: "계단", label: "계단" },
    { key: "경사로", label: "경사로" },
    { key: "자동문", label: "자동문" },
    { key: "엘리베이터", label: "엘리베이터" },
    { key: "휠체어이동가능", label: "휠체어 이동가능" },
  ],
  facility: [
    { key: "유아의자", label: "유아의자" },
    { key: "장애인석", label: "장애인석" },
    { key: "콘센트", label: "콘센트" },
    { key: "흡연구역", label: "흡연구역" },
    { key: "주차", label: "주차" },
  ],
  menu: [
    { key: "큰글씨메뉴", label: "큰글씨 메뉴" },
    { key: "사진메뉴", label: "사진 메뉴" },
    { key: "점자메뉴판", label: "점자 메뉴판" },
    { key: "성분표시", label: "성분·알레르기 표시" },
    { key: "가격표시", label: "가격 표시" },
  ],
  benefit: [
    { key: "카드결제", label: "카드 결제" },
    { key: "네이버페이", label: "네이버페이" },
    { key: "제로페이", label: "제로페이" },
    { key: "포인트적립", label: "포인트 적립" },
    { key: "통신사할인", label: "통신사 할인" },
  ],
  order: [
    { key: "키오스크", label: "키오스크" },
    { key: "직원호출", label: "직원 호출" },
    { key: "1인1메뉴", label: "1인1메뉴" },
    { key: "예약가능", label: "예약 가능" },
    { key: "포장배달가능", label: "포장·배달 가능" },
  ],
};

function normalizeKey(str) {
  return String(str ?? "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export default function PlaceCard({
  place,
  categoryKey = "access",
  facts = {},
  onClick,
}) {
  const reviewText = place.reviewCount ?? place.review_count ?? 0;
  const categoryText = place.tags || place.category || "카테고리 정보 없음";
  const imageSrc = place.thumb || place.image_url || place.photo;

  // 현재 선택된 카테고리의 5개 태그
  const currentTags = CATEGORY_TAG_MAP[categoryKey] || CATEGORY_TAG_MAP.access;

  // 데이터 존재 여부 검사
  const checkHasFact = (tagKey) => {
    const normTagKey = normalizeKey(tagKey);

    // 1. props facts 검사
    for (const [fKey, fVal] of Object.entries(facts)) {
      if (normalizeKey(fKey) === normTagKey) {
        return fVal === true;
      }
    }

    // 2. place.facts 카테고리 내부 검사
    const catFacts = place?.facts?.[categoryKey] || {};
    for (const [fKey, fVal] of Object.entries(catFacts)) {
      if (normalizeKey(fKey) === normTagKey) {
        return fVal === true;
      }
    }

    // 3. 접근성 카테고리 DB raw accessibility 검사
    if (categoryKey === "access" || categoryKey === "accessibility") {
      if (place?.accessibility) {
        const dbMap = {
          계단: "stairs",
          경사로: "ramp",
          자동문: "automatic_door",
          엘리베이터: "elevator",
          휠체어이동가능: "wheelchair_accessible",
        };
        const rawKey = dbMap[tagKey];
        if (rawKey && typeof place.accessibility[rawKey] === "boolean") {
          return place.accessibility[rawKey] === true;
        }
      }
    }

    return false;
  };

  return (
    <div className="place-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="place-card__main">
        <div className="place-card__info">
          <h3 className="place-card__title">{place.name}</h3>
          <p className="place-card__meta">
            {categoryText} · 리뷰 {reviewText}
          </p>
        </div>

        <div className="place-card__thumb">
          {imageSrc ? (
            <img src={imageSrc} alt={place.name} />
          ) : (
            <div className="place-card__thumb-placeholder" />
          )}
        </div>
      </div>

      {place.address && <p className="place-card__address">{place.address}</p>}
      {place.description && (
        <p className="place-card__description">{place.description}</p>
      )}

      {/* 동적 5개 필터 태그 표시 */}
      <div className="place-card__tags">
        {currentTags.map((tag) => {
          const isChecked = checkHasFact(tag.key);
          return (
            <span
              key={tag.key}
              className={`place-card__tag-item ${
                isChecked ? "is-checked" : "is-unchecked"
              }`}
            >
              {isChecked ? (
                <CheckIcon />
              ) : (
                <span className="no-check-icon">·</span>
              )}
              <span>{tag.label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
