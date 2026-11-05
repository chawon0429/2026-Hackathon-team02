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

import "./PlaceCard.css";

function Fact({ label, value }) {
  if (value === true) {
    return (
      <li className="fact fact--yes">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        <span>{label}</span>
      </li>
    );
  }

  if (value === false) {
    return (
      <li className="fact fact--no">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span>{label} 없음</span>
      </li>
    );
  }

  return (
    <li className="fact fact--unknown">
      <svg
        className="fact__unknown-icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
        <path d="M9.8 9a2.3 2.3 0 1 1 3.8 1.7c-1.1.8-1.6 1.2-1.6 2.8" />
        <circle cx="12" cy="16.5" r=".6" fill="currentColor" />
      </svg>
      <span>{label} 정보 없음</span>
    </li>
  );
}

export default function PlaceCard({ place, facts, onClick }) {
  return (
    <li className="place">
      <button type="button" className="place__btn" onClick={onClick}>
        <div className="place__top">
          <div>
            <h3 className="place__name">{place.name}</h3>
            <p className="place__meta">
              {place.tags || place.category || "분류 없음"}
              {" · "}
              리뷰 {place.reviewCount ?? place.review_count ?? 0}
            </p>
          </div>

          <div className="place__thumb" aria-hidden="true">
            {place.thumb && <img src={place.thumb} alt="" />}
          </div>
        </div>

        {place.address && <p className="place__address">{place.address}</p>}

        {place.description && (
          <p className="place__description">{place.description}</p>
        )}

        <ul className="place__facts">
          {Object.entries(facts || {}).map(([label, value]) => (
            <Fact key={label} label={label} value={value} />
          ))}
        </ul>
      </button>
    </li>
  );
}
