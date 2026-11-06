// import { useMemo, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import BottomTabBar from "../components/BottomTabBar";
// import PlaceCard from "../components/PlaceCard";
// import { CATEGORIES, MOCK_PLACES } from "../mocks/places";

// import accessIcon from "../assets/cat-access.svg";
// import facilityIcon from "../assets/cat-facility.svg";
// import menuIcon from "../assets/cat-menu.svg";
// import benefitIcon from "../assets/cat-benefit.svg";
// import orderIcon from "../assets/cat-order.svg";

// import { getPlaces, getPlaceFacts } from "../api/places";
// import { summarizePlace } from "../api/analysis";

// import "./HomePage.css";

// const CATEGORY_ICONS = {
//   access: accessIcon,
//   facility: facilityIcon,
//   menu: menuIcon,
//   benefit: benefitIcon,
//   order: orderIcon,
// };

// const FACT_TYPE_MAP = {
//   accessibility: "access",
//   access: "access",
//   facility: "facility",
//   menu: "menu",
//   benefit: "benefit",
//   payment: "benefit",
//   order: "order",
//   usage_method: "order",
// };

// const FACT_VALUE_RULES = {
//   계단: ["계단"],
//   경사로: ["경사로", "램프"],
//   자동문: ["자동문"],
//   엘리베이터: ["엘리베이터"],
//   휠체어이동가능: ["휠체어 이동", "휠체어 접근"],
//   화장실: ["화장실"],
//   휠체어화장실: ["휠체어 화장실", "장애인 화장실"],
//   테이블간격넓음: ["테이블 간격", "간격 넓"],
//   등받이의자: ["등받이 의자"],
//   메뉴판있음: ["메뉴판"],
//   큰글씨메뉴: ["큰 글씨", "큰글씨"],
//   가격표시: ["가격 표시", "가격표"],
//   사진메뉴: ["사진 메뉴", "메뉴 사진"],
//   카드할인: ["카드 할인"],
//   통신사할인: ["통신사 할인"],
//   적립: ["적립"],
//   중복적용: ["중복 적용"],
//   키오스크: ["키오스크"],
//   선결제: ["선결제"],
//   직원호출: ["직원 호출"],
//   셀프반납: ["셀프 반납"],
// };

// const EMPTY_FACTS = () => ({
//   access: {},
//   facility: {},
//   menu: {},
//   benefit: {},
//   order: {},
// });

// function normalizeText(value) {
//   return String(value ?? "")
//     .replace(/\s+/g, "")
//     .toLowerCase();
// }

// function isNegative(value) {
//   const text = normalizeText(value);
//   return ["없음", "불가", "아니오", "미설치", "불가능", "x"].some((word) =>
//     text.includes(normalizeText(word)),
//   );
// }

// function isPositive(value) {
//   const text = normalizeText(value);
//   return ["있음", "가능", "설치", "이용가능", "지원", "제공", "o"].some(
//     (word) => text.includes(normalizeText(word)),
//   );
// }

// function getFactCategory(fact) {
//   const type = normalizeText(
//     fact?.fact_type ?? fact?.type ?? fact?.category ?? "",
//   );

//   for (const [key, category] of Object.entries(FACT_TYPE_MAP)) {
//     if (type === normalizeText(key)) return category;
//   }

//   return null;
// }

// function getFactLabel(fact) {
//   return (
//     fact?.label ??
//     fact?.name ??
//     fact?.fact_name ??
//     fact?.item ??
//     fact?.title ??
//     fact?.fact_type ??
//     ""
//   );
// }

// function getFactValue(fact) {
//   return fact?.value ?? fact?.content ?? fact?.description ?? "";
// }

// /**
//  * DB place_facts 배열을 카테고리별 true/false 객체로 변환
//  */
// function convertFacts(facts = []) {
//   const result = EMPTY_FACTS();

//   if (!Array.isArray(facts)) return result;

//   for (const fact of facts) {
//     const category = getFactCategory(fact);
//     const label = normalizeText(getFactLabel(fact));
//     const value = getFactValue(fact);

//     if (!category || !label) continue;

//     const rules = Object.entries(FACT_VALUE_RULES);

//     for (const [itemKey, keywords] of rules) {
//       const matched = keywords.some((keyword) =>
//         label.includes(normalizeText(keyword)),
//       );

//       if (!matched) continue;

//       const negative = isNegative(value);
//       const positive = isPositive(value);

//       result[category][itemKey] = negative
//         ? false
//         : positive
//           ? true
//           : Boolean(value);

//       break;
//     }
//   }

//   return result;
// }

// /**
//  * DB 접근성 제보를 기존 카테고리 필터와 연결
//  */
// function applyApprovedAccessibility(facts, accessibility) {
//   const result = {
//     ...facts,
//     access: { ...facts.access },
//   };

//   if (!accessibility || typeof accessibility !== "object") {
//     return result;
//   }

//   const accessMap = {
//     ramp: "경사로",
//     slope: "경사로",
//     automatic_door: "자동문",
//     elevator: "엘리베이터",
//     stairs: "계단",
//     wheelchair_accessible: "휠체어이동가능",
//   };

//   for (const [key, value] of Object.entries(accessibility)) {
//     const mappedKey = accessMap[key] ?? key;
//     const normalizedKey = normalizeText(mappedKey);

//     for (const [itemKey, keywords] of Object.entries(FACT_VALUE_RULES)) {
//       if (
//         keywords.some(
//           (keyword) =>
//             normalizeText(keyword) === normalizedKey ||
//             normalizedKey.includes(normalizeText(keyword)),
//         )
//       ) {
//         result.access[itemKey] = Boolean(value);
//       }
//     }
//   }

//   return result;
// }

// /**
//  * DB 제보 + 기존 MOCK 장소 구조 통합
//  */
// function buildPlace(place, facts = []) {
//   const mock = MOCK_PLACES.find((item) => String(item.id) === String(place.id));

//   const convertedFacts = convertFacts(facts);

//   // 기존 목업에 저장된 사실 정보도 보존
//   const mergedFacts = EMPTY_FACTS();

//   for (const category of Object.keys(mergedFacts)) {
//     const mockFacts = mock?.facts?.[category] ?? {};

//     mergedFacts[category] = {
//       ...mockFacts,
//       ...convertedFacts[category],
//     };
//   }

//   const finalFacts = applyApprovedAccessibility(
//     mergedFacts,
//     place.accessibility,
//   );

//   return {
//     ...mock,
//     ...place,
//     id: place.id,
//     dbId: place.id,
//     name: place.name ?? mock?.name ?? "이름 없는 장소",
//     address: place.address ?? mock?.address ?? "",
//     category: place.category ?? mock?.category ?? "",
//     tags: place.tags ?? mock?.tags ?? "",
//     reviewCount: place.review_count ?? mock?.reviewCount ?? 0,
//     facts: finalFacts,
//   };
// }

// function normalizePlaceList(data) {
//   if (Array.isArray(data)) return data;

//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.items)) return data.items;
//   if (Array.isArray(data?.places)) return data.places;

//   return [];
// }

// export default function HomePage() {
//   const navigate = useNavigate();

//   const [query, setQuery] = useState("");
//   const [categoryKey, setCategoryKey] = useState(
//     CATEGORIES?.[0]?.key ?? "access",
//   );
//   const [picked, setPicked] = useState([]);
//   const [summary, setSummary] = useState("");
//   const [summaryLoading, setSummaryLoading] = useState(false);
//   const [searchError, setSearchError] = useState("");

//   const [allPlaces, setAllPlaces] = useState([]);
//   const [placesLoading, setPlacesLoading] = useState(true);
//   const [placesError, setPlacesError] = useState("");

//   const category = useMemo(
//     () => CATEGORIES.find((item) => item.key === categoryKey),
//     [categoryKey],
//   );

//   /**
//    * DB 장소 + DB 사실정보 조회
//    * DB 조회 실패 또는 장소가 없으면 MOCK_PLACES 유지
//    */
//   useEffect(() => {
//     let cancelled = false;

//     async function loadPlaces() {
//       setPlacesLoading(true);
//       setPlacesError("");

//       try {
//         const response = await getPlaces();
//         const places = normalizePlaceList(response).filter(
//           (place) => place?.name && place.name !== "string",
//         );

//         if (places.length === 0) {
//           if (!cancelled) {
//             setAllPlaces(MOCK_PLACES);
//           }
//           return;
//         }

//         const integratedPlaces = await Promise.all(
//           places.map(async (place) => {
//             try {
//               const factResponse = await getPlaceFacts(place.id);
//               const facts = Array.isArray(factResponse)
//                 ? factResponse
//                 : (factResponse?.facts ?? []);

//               return buildPlace(place, facts);
//             } catch (error) {
//               console.error(`장소 ${place.id} 사실정보 조회 실패`, error);

//               return buildPlace(place, []);
//             }
//           }),
//         );

//         if (!cancelled) {
//           setAllPlaces(integratedPlaces);
//         }
//       } catch (error) {
//         console.error("장소 목록 조회 실패:", error);

//         if (!cancelled) {
//           // 민주 브랜치의 MOCK_PLACES fallback 유지
//           setAllPlaces(MOCK_PLACES);
//           setPlacesError(
//             "DB 장소 정보를 불러오지 못해 기본 장소 정보를 표시합니다.",
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setPlacesLoading(false);
//         }
//       }
//     }

//     loadPlaces();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   /**
//    * AI 장소 요약 검색
//    */
//   async function handleSearch(event) {
//     event.preventDefault();

//     const placeName = query.trim();

//     if (!placeName) {
//       setSummary("");
//       setSearchError("요약할 장소명을 입력해 주세요.");
//       return;
//     }

//     setSummaryLoading(true);
//     setSummary("");
//     setSearchError("");

//     try {
//       const result = await summarizePlace(placeName);
//       setSummary(result?.summary ?? result ?? "");
//     } catch (error) {
//       console.error("AI 요약 실패:", error);
//       setSearchError(error?.message ?? "장소 요약을 불러오지 못했습니다.");
//     } finally {
//       setSummaryLoading(false);
//     }
//   }

//   function changeCategory(key) {
//     setCategoryKey(key);
//     setPicked([]);
//   }

//   function togglePick(item) {
//     setPicked((previous) =>
//       previous.includes(item)
//         ? previous.filter((value) => value !== item)
//         : [...previous, item],
//     );
//   }

//   /**
//    * 선택한 카테고리 + 사실정보 필터
//    */
//   const filteredPlaces = useMemo(() => {
//     const keyword = query.trim().toLowerCase();

//     return allPlaces.filter((place) => {
//       const name = String(place.name ?? "").toLowerCase();

//       const matchesName = !keyword || name.includes(keyword);

//       const facts = place.facts?.[categoryKey] ?? {};

//       const matchesFacts =
//         picked.length === 0 || picked.every((item) => facts[item] === true);

//       return matchesName && matchesFacts;
//     });
//   }, [allPlaces, query, categoryKey, picked]);

//   return (
//     <div className="home">
//       <header className="home__header">
//         <div className="home__logo">누리고</div>
//       </header>

//       <main className="home__body">
//         {/* AI 장소 요약 검색 */}
//         <form className="search" onSubmit={handleSearch}>
//           <input
//             type="text"
//             value={query}
//             onChange={(event) => setQuery(event.target.value)}
//             placeholder="장소 이름을 검색해 보세요"
//           />

//           <button type="submit" disabled={summaryLoading}>
//             {summaryLoading ? "검색 중..." : "AI 요약"}
//           </button>
//         </form>

//         {summaryLoading && (
//           <p className="place-summary__loading">
//             장소 정보를 분석하고 있습니다.
//           </p>
//         )}

//         {searchError && <p className="place-summary__error">{searchError}</p>}

//         {summary && (
//           <section className="place-summary">
//             <h3>AI 장소 요약</h3>
//             <p>{summary}</p>
//           </section>
//         )}

//         {/* 카테고리 선택 */}
//         <section className="cats">
//           <div className="cats__list" role="tablist">
//             {CATEGORIES.map((item) => (
//               <button
//                 key={item.key}
//                 type="button"
//                 role="tab"
//                 aria-selected={categoryKey === item.key}
//                 className={
//                   categoryKey === item.key
//                     ? "cats__item cats__item--active"
//                     : "cats__item"
//                 }
//                 onClick={() => changeCategory(item.key)}
//               >
//                 <img
//                   src={CATEGORY_ICONS[item.key]}
//                   alt=""
//                   className="cats__icon"
//                 />
//                 <span>{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* 카테고리별 상세 조건 */}
//         {category && (
//           <section className="picks">
//             <div className="picks__list">
//               {category.items.map((item) => {
//                 const selected = picked.includes(item);

//                 return (
//                   <button
//                     key={item}
//                     type="button"
//                     className={
//                       selected
//                         ? "picks__item picks__item--active"
//                         : "picks__item"
//                     }
//                     onClick={() => togglePick(item)}
//                   >
//                     {item}
//                   </button>
//                 );
//               })}
//             </div>
//           </section>
//         )}

//         {/* 장소 목록 */}
//         <section className="places">
//           {placesLoading && (
//             <p className="places__message">장소 정보를 불러오는 중입니다.</p>
//           )}

//           {!placesLoading && placesError && (
//             <p className="places__message places__message--error">
//               {placesError}
//             </p>
//           )}

//           {!placesLoading && filteredPlaces.length === 0 && (
//             <p className="places__message">조건에 맞는 장소가 없습니다.</p>
//           )}

//           {!placesLoading &&
//             filteredPlaces.map((place) => (
//               <PlaceCard
//                 key={place.id}
//                 place={place}
//                 facts={place.facts?.[categoryKey] ?? {}}
//                 onClick={() => navigate(`/places/${place.id}`)}
//               />
//             ))}
//         </section>
//       </main>

//       <BottomTabBar />
//     </div>
//   );
// }

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BottomTabBar from "../components/BottomTabBar";
import PlaceCard from "../components/PlaceCard";
import { CATEGORIES, MOCK_PLACES } from "../mocks/places";

import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";

import { getPlaces, getPlaceFacts } from "../api/places";
import { summarizePlace } from "../api/analysis";

import "./HomePage.css";

// Figma UI용 돋보기 아이콘 SVG
const SearchIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0057E7"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Figma UI용 파란색 체크 아이콘 SVG
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

const CATEGORY_ICONS = {
  access: accessIcon,
  facility: facilityIcon,
  menu: menuIcon,
  benefit: benefitIcon,
  order: orderIcon,
};

// 5대 카테고리별 5개 세부 필터 항목 확정 목록
const CATEGORY_ITEMS_MAP = {
  access: ["계단", "경사로", "자동문", "엘리베이터", "휠체어 이동가능"],
  facility: ["유아의자", "장애인석", "콘센트", "흡연구역", "주차"],
  menu: [
    "큰글씨 메뉴",
    "사진 메뉴",
    "점자 메뉴판",
    "성분·알레르기 표시",
    "가격 표시",
  ],
  benefit: [
    "카드 결제",
    "네이버페이",
    "제로페이",
    "포인트 적립",
    "통신사 할인",
  ],
  order: ["키오스크", "직원 호출", "1인1메뉴", "예약 가능", "포장·배달 가능"],
};

const FACT_TYPE_MAP = {
  accessibility: "access",
  access: "access",
  facility: "facility",
  menu: "menu",
  benefit: "benefit",
  payment: "benefit",
  order: "order",
  usage_method: "order",
};

const FACT_VALUE_RULES = {
  계단: ["계단"],
  경사로: ["경사로", "램프"],
  자동문: ["자동문"],
  엘리베이터: ["엘리베이터"],
  휠체어이동가능: ["휠체어 이동", "휠체어 접근", "휠체어이동가능"],

  유아의자: ["유아의자", "아기의자", "유아 의자"],
  장애인석: ["장애인석", "배려석"],
  콘센트: ["콘센트", "플러그"],
  흡연구역: ["흡연구역", "흡연실"],
  주차: ["주차", "주차장", "주차 가능"],

  큰글씨메뉴: ["큰글씨", "큰 글씨"],
  사진메뉴: ["사진메뉴", "사진 메뉴"],
  점자메뉴판: ["점자메뉴", "점자 메뉴판"],
  성분표시: ["성분", "알레르기"],
  가격표시: ["가격표시", "가격 표시"],

  카드결제: ["카드", "카드결제", "카드 결제"],
  네이버페이: ["네이버페이", "네이버 페이"],
  제로페이: ["제로페이", "제로 페이"],
  포인트적립: ["포인트", "적립"],
  통신사할인: ["통신사", "통신사 할인"],

  키오스크: ["키오스크"],
  직원호출: ["직원호출", "직원 호출"],
  "1인1메뉴": ["1인1메뉴", "1인 1메뉴"],
  예약가능: ["예약", "예약 가능"],
  포장배달가능: ["포장", "배달", "포장 가능", "배달 가능"],
};

const EMPTY_FACTS = () => ({
  access: {},
  facility: {},
  menu: {},
  benefit: {},
  order: {},
});

function normalizeText(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function isNegative(value) {
  const text = normalizeText(value);
  return ["없음", "불가", "아니오", "미설치", "불가능", "x", "false"].some(
    (word) => text.includes(normalizeText(word)),
  );
}

function isPositive(value) {
  const text = normalizeText(value);
  return ["있음", "가능", "설치", "이용가능", "지원", "제공", "o", "true"].some(
    (word) => text.includes(normalizeText(word)),
  );
}

function getFactCategory(fact) {
  const type = normalizeText(
    fact?.fact_type ?? fact?.type ?? fact?.category ?? "",
  );

  for (const [key, category] of Object.entries(FACT_TYPE_MAP)) {
    if (type === normalizeText(key)) return category;
  }

  return null;
}

function getFactLabel(fact) {
  return (
    fact?.label ??
    fact?.name ??
    fact?.fact_name ??
    fact?.item ??
    fact?.title ??
    fact?.fact_type ??
    ""
  );
}

function getFactValue(fact) {
  return fact?.value ?? fact?.content ?? fact?.description ?? "";
}

function convertFacts(facts = []) {
  const result = EMPTY_FACTS();

  if (!Array.isArray(facts)) return result;

  for (const fact of facts) {
    const category = getFactCategory(fact);
    const label = normalizeText(getFactLabel(fact));
    const value = getFactValue(fact);

    if (!category || !label) continue;

    const rules = Object.entries(FACT_VALUE_RULES);

    for (const [itemKey, keywords] of rules) {
      const matched = keywords.some((keyword) =>
        label.includes(normalizeText(keyword)),
      );

      if (!matched) continue;

      const negative = isNegative(value);
      const positive = isPositive(value);

      const normItemKey = normalizeText(itemKey);
      result[category][normItemKey] = negative
        ? false
        : positive
          ? true
          : Boolean(value);

      break;
    }
  }

  return result;
}

function applyApprovedAccessibility(facts, accessibility) {
  const result = {
    ...facts,
    access: { ...facts.access },
  };

  if (!accessibility || typeof accessibility !== "object") {
    return result;
  }

  const accessMap = {
    ramp: "경사로",
    slope: "경사로",
    automatic_door: "자동문",
    elevator: "엘리베이터",
    stairs: "계단",
    wheelchair_accessible: "휠체어이동가능",
  };

  for (const [key, value] of Object.entries(accessibility)) {
    const mappedKey = accessMap[key] ?? key;
    const normalizedKey = normalizeText(mappedKey);

    for (const [itemKey, keywords] of Object.entries(FACT_VALUE_RULES)) {
      if (
        keywords.some(
          (keyword) =>
            normalizeText(keyword) === normalizedKey ||
            normalizedKey.includes(normalizeText(keyword)),
        )
      ) {
        const normItemKey = normalizeText(itemKey);
        result.access[normItemKey] = Boolean(value);
      }
    }
  }

  return result;
}

function buildPlace(place, facts = []) {
  const mock = MOCK_PLACES.find((item) => String(item.id) === String(place.id));
  const convertedFacts = convertFacts(facts);
  const mergedFacts = EMPTY_FACTS();

  for (const category of Object.keys(mergedFacts)) {
    const mockFacts = mock?.facts?.[category] ?? {};
    const normalizedMockFacts = {};
    for (const [k, v] of Object.entries(mockFacts)) {
      normalizedMockFacts[normalizeText(k)] = v;
    }

    mergedFacts[category] = {
      ...normalizedMockFacts,
      ...convertedFacts[category],
    };
  }

  const finalFacts = applyApprovedAccessibility(
    mergedFacts,
    place.accessibility,
  );

  return {
    ...mock,
    ...place,
    id: place.id,
    dbId: place.id,
    name: place.name ?? mock?.name ?? "이름 없는 장소",
    address: place.address ?? mock?.address ?? "",
    category: place.category ?? mock?.category ?? "",
    tags: place.tags ?? mock?.tags ?? "",
    reviewCount: place.review_count ?? mock?.reviewCount ?? 0,
    facts: finalFacts,
  };
}

function normalizePlaceList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.places)) return data.places;

  return [];
}

export default function HomePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState(
    CATEGORIES?.[0]?.key ?? "access",
  );
  const [picked, setPicked] = useState([]);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [allPlaces, setAllPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState("");

  // 현재 선택된 카테고리의 5개 세부 필터 항목 가져오기
  const currentCategoryItems = useMemo(
    () => CATEGORY_ITEMS_MAP[categoryKey] || [],
    [categoryKey],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPlaces() {
      setPlacesLoading(true);
      setPlacesError("");

      try {
        const response = await getPlaces();
        const places = normalizePlaceList(response).filter(
          (place) => place?.name && place.name !== "string",
        );

        if (places.length === 0) {
          if (!cancelled) {
            setAllPlaces(MOCK_PLACES);
          }
          return;
        }

        const integratedPlaces = await Promise.all(
          places.map(async (place) => {
            try {
              const factResponse = await getPlaceFacts(place.id);
              const facts = Array.isArray(factResponse)
                ? factResponse
                : (factResponse?.facts ?? []);

              return buildPlace(place, facts);
            } catch (error) {
              console.error(`장소 ${place.id} 사실정보 조회 실패`, error);
              return buildPlace(place, []);
            }
          }),
        );

        if (!cancelled) {
          setAllPlaces(integratedPlaces);
        }
      } catch (error) {
        console.error("장소 목록 조회 실패:", error);

        if (!cancelled) {
          setAllPlaces(MOCK_PLACES);
          setPlacesError(
            "DB 장소 정보를 불러오지 못해 기본 장소 정보를 표시합니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setPlacesLoading(false);
        }
      }
    }

    loadPlaces();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    const placeName = query.trim();

    if (!placeName) {
      setSummary("");
      setSearchError("요약할 장소명을 입력해 주세요.");
      return;
    }

    setSummaryLoading(true);
    setSummary("");
    setSearchError("");

    try {
      const result = await summarizePlace(placeName);
      setSummary(result?.summary ?? result ?? "");
    } catch (error) {
      console.error("AI 요약 실패:", error);
      setSearchError(error?.message ?? "장소 요약을 불러오지 못했습니다.");
    } finally {
      setSummaryLoading(false);
    }
  }

  function changeCategory(key) {
    setCategoryKey(key);
    setPicked([]);
  }

  function togglePick(item) {
    setPicked((previous) =>
      previous.includes(item)
        ? previous.filter((value) => value !== item)
        : [...previous, item],
    );
  }

  const filteredPlaces = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    return allPlaces.filter((place) => {
      const name = String(place.name ?? "").toLowerCase();
      const matchesName = !keyword || name.includes(keyword);

      const accessObj = place.accessibility || {};
      const factsObj = place.facts?.[categoryKey] ?? {};

      const matchesFacts =
        picked.length === 0 ||
        picked.every((pickedItem) => {
          const normPicked = normalizeText(pickedItem);

          if (categoryKey === "access" || categoryKey === "accessibility") {
            if (normPicked.includes("휠체어")) {
              if (typeof accessObj.wheelchair_accessible === "boolean") {
                return accessObj.wheelchair_accessible === true;
              }
            }
            if (normPicked.includes("계단")) {
              if (typeof accessObj.stairs === "boolean") {
                return accessObj.stairs === true;
              }
            }
            if (normPicked.includes("경사로")) {
              if (
                typeof accessObj.ramp === "boolean" ||
                typeof accessObj.slope === "boolean"
              ) {
                return accessObj.ramp === true || accessObj.slope === true;
              }
            }
            if (normPicked.includes("자동문")) {
              if (typeof accessObj.automatic_door === "boolean") {
                return accessObj.automatic_door === true;
              }
            }
            if (normPicked.includes("엘리베이터")) {
              if (typeof accessObj.elevator === "boolean") {
                return accessObj.elevator === true;
              }
            }
          }

          for (const [fKey, fVal] of Object.entries(factsObj)) {
            const normKey = normalizeText(fKey);
            if (
              normKey === normPicked ||
              normPicked.includes(normKey) ||
              normKey.includes(normPicked)
            ) {
              return fVal === true;
            }
          }

          return false;
        });

      return matchesName && matchesFacts;
    });
  }, [allPlaces, query, categoryKey, picked]);

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__logo">로고</h1>
      </header>

      <main className="home__body">
        <form className="search" onSubmit={handleSearch}>
          <input
            type="text"
            className="search__input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="장소 이름을 검색해 보세요"
          />

          <button
            type="submit"
            className="search__btn"
            disabled={summaryLoading}
            aria-label="AI 요약 검색"
          >
            {summaryLoading ? (
              <span className="search__loading-text">...</span>
            ) : (
              <SearchIcon />
            )}
          </button>
        </form>

        {summaryLoading && (
          <p className="place-summary__loading">
            장소 정보를 분석하고 있습니다.
          </p>
        )}

        {searchError && <p className="place-summary__error">{searchError}</p>}

        {summary && (
          <section className="place-summary">
            <h3>AI 장소 요약</h3>
            <p>{summary}</p>
          </section>
        )}

        {/* 1행 5열 카테고리 선택 */}
        <section className="cats">
          <div className="cats__list" role="tablist">
            {CATEGORIES.map((item) => (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={categoryKey === item.key}
                className={
                  categoryKey === item.key
                    ? "cats__item cats__item--active"
                    : "cats__item"
                }
                onClick={() => changeCategory(item.key)}
              >
                <img
                  src={CATEGORY_ICONS[item.key]}
                  alt=""
                  className="cats__icon"
                />
                <span className="cats__label">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 선택된 카테고리의 5개 필터 태그 오버라이드 노출 */}
        <section className="picks">
          <div className="picks__list">
            {currentCategoryItems.map((item) => {
              const selected = picked.includes(item);

              return (
                <button
                  key={item}
                  type="button"
                  className={
                    selected ? "picks__item picks__item--active" : "picks__item"
                  }
                  onClick={() => togglePick(item)}
                >
                  <CheckIcon />
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 장소 카드 목록 */}
        <section className="places">
          {placesLoading && (
            <p className="places__message">장소 정보를 불러오는 중입니다.</p>
          )}

          {!placesLoading && placesError && (
            <p className="places__message places__message--error">
              {placesError}
            </p>
          )}

          {!placesLoading && filteredPlaces.length === 0 && (
            <p className="places__message">조건에 맞는 장소가 없습니다.</p>
          )}

          {!placesLoading &&
            filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                categoryKey={categoryKey}
                facts={place.facts?.[categoryKey] ?? {}}
                onClick={() => navigate(`/places/${place.id}`)}
              />
            ))}
        </section>
      </main>

      <BottomTabBar />
    </div>
  );
}
