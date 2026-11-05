// import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import BottomTabBar from "../components/BottomTabBar";
// import PlaceCard from "../components/PlaceCard";
// import { CATEGORIES, MOCK_PLACES } from "../mocks/places";
// import accessIcon from "../assets/cat-access.svg";
// import facilityIcon from "../assets/cat-facility.svg";
// import menuIcon from "../assets/cat-menu.svg";
// import benefitIcon from "../assets/cat-benefit.svg";
// import orderIcon from "../assets/cat-order.svg";
// import "./HomePage.css";
// import { summarizePlace } from "../api/analysis";

// const CATEGORY_ICONS = {
//     access: accessIcon,
//     facility: facilityIcon,
//     menu: menuIcon,
//     benefit: benefitIcon,
//     order: orderIcon,
// };

// export default function HomePage() {
//     const navigate = useNavigate();
//     const [query, setQuery] = useState("");
//     const [categoryKey, setCategoryKey] = useState("access");
//     const [picked, setPicked] = useState([]);
//     const [summary, setSummary] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [searchError, setSearchError] = useState("");

//     const category = CATEGORIES.find((c) => c.key === categoryKey);

//     const handleSearch = async (e) => {
//   e.preventDefault();

//   const placeName = query.trim();

//   if (!placeName) {
//     setSummary("");
//     setSearchError("검색할 장소명을 입력해 주세요.");
//     return;
//   }

//   setLoading(true);
//   setSummary("");
//   setSearchError("");

//   try {
//     const result = await summarizePlace(placeName);
//     setSummary(result.summary);
//   } catch (error) {
//     setSearchError(error.message || "장소 검색에 실패했습니다.");
//   } finally {
//     setLoading(false);
//   }
// };

//     const changeCategory = (key) => {
//         setCategoryKey(key);
//         setPicked([]);
//     };
//     const togglePick = (item) =>
//         setPicked((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));

//     const places = useMemo(
//         () =>
//         MOCK_PLACES.filter((p) => p.name.includes(query.trim())).filter((p) =>
//             picked.every((item) => p.facts[categoryKey]?.[item] === true)
//         ),
//         [query, categoryKey, picked]
//     );

//     return (
//         <div className="home">
//             <header className="home__header"><span className="home__logo">로고</span></header>

//             <main className="home__body">
//                 <form className="search" role="search" onSubmit={handleSearch}>
//                     <label htmlFor="search-input" className="sr-only">장소 검색</label>
//                     <input id="search-input" className="search__input" value={query}
//                         onChange={(e) => setQuery(e.target.value)} placeholder="장소명을 검색해 보세요" />
//                     <button type="submit" className="search__btn" aria-label="검색">
//                         <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                             strokeWidth="2" strokeLinecap="round" aria-hidden="true">
//                             <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
//                         </svg>
//                     </button>
//                 </form>
// {loading && (
//   <p role="status">Google 검색으로 장소 정보를 확인하고 있어요...</p>
// )}

// {searchError && (
//   <p role="alert">{searchError}</p>
// )}

// {summary && (
//   <section className="place-summary" aria-live="polite">
//     <h2>AI 장소 검색 결과</h2>
//     <p>{summary}</p>
//   </section>
// )}
//                 <div className="cats" role="tablist" aria-label="카테고리">
//                 {CATEGORIES.map((c) => (
//                     <button key={c.key} type="button" role="tab" aria-selected={categoryKey === c.key}
//                     className={`cat${categoryKey === c.key ? " is-active" : ""}`}
//                     onClick={() => changeCategory(c.key)}>
//                         <img className="cat__icon" src={CATEGORY_ICONS[c.key]} alt="" width="32" height="32" />
//                         <span>{c.label}</span>
//                     </button>
//                     ))}
//                 </div>

//         <ul className="picks" aria-label={`${category.label} 세부 항목`}>
//           {category.items.map((item) => {
//             const on = picked.includes(item);
//             return (
//               <li key={item}>
//                 <button type="button" aria-pressed={on} className={`pick${on ? " is-on" : ""}`}
//                         onClick={() => togglePick(item)}>
//                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//                        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//                     <path d="M5 12.5l4.5 4.5L19 7.5" />
//                   </svg>
//                   {item}
//                 </button>
//               </li>
//             );
//           })}
//         </ul>

//         <ul className="places">
//             {places.map((p) => (
//                 <PlaceCard key={p.id} place={p} facts={p.facts[categoryKey]}
//                         onClick={() => navigate(`/places/${p.id}`)} />
//             ))}
//             {places.length === 0 && <li className="places__empty">조건에 맞는 장소가 아직 없어요.</li>}
//         </ul>
//       </main>

//         <BottomTabBar />
//     </div>
//     );
// }

import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import PlaceCard from "../components/PlaceCard";
import { CATEGORIES } from "../mocks/places";
import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";
import "./HomePage.css";
import { summarizePlace } from "../api/analysis";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const CATEGORY_ICONS = {
  access: accessIcon,
  facility: facilityIcon,
  menu: menuIcon,
  benefit: benefitIcon,
  order: orderIcon,
};

// DB value 내용으로 기존 홈 화면 세부 항목 판별
const FACT_VALUE_RULES = {
  access: {
    계단: ["계단"],
    경사로: ["경사로", "램프"],
    자동문: ["자동문"],
    엘리베이터: ["엘리베이터"],
    "휠체어 이동가능": ["휠체어 이동", "휠체어 접근"],
  },
  facility: {
    화장실: ["화장실"],
    "휠체어 화장실": ["장애인 화장실", "휠체어 화장실"],
    "테이블 간격 넓음": ["테이블 간격 넓"],
    "등받이 의자": ["등받이 의자"],
  },
  menu: {
    "메뉴판 있음": ["메뉴판"],
    "큰 글씨 메뉴": ["큰 글씨 메뉴", "확대 메뉴"],
    "가격 표시": ["가격 표시"],
    "사진 메뉴": ["사진 메뉴", "메뉴 사진"],
  },
  benefit: {
    "카드 할인": ["카드 할인"],
    "통신사 할인": ["통신사 할인"],
    적립: ["적립"],
    "중복 적용": ["중복 적용"],
  },
  order: {
    키오스크: ["키오스크"],
    선결제: ["선결제"],
    "직원 호출": ["직원 호출"],
    "셀프 반납": ["셀프 반납"],
  },
};

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

const parseFactValue = (value) => {
  const text = normalize(value);

  // 부정 표현 먼저 검사
  if (
    ["없음", "불가능", "미설치", "미제공", "불가"].some((word) =>
      text.includes(normalize(word)),
    )
  ) {
    return false;
  }

  // 긍정 표현
  if (
    ["있음", "설치", "가능", "제공", "이용가능"].some((word) =>
      text.includes(normalize(word)),
    )
  ) {
    return true;
  }

  return null;
};

// DB facts -> 기존 PlaceCard에서 사용하는 facts 형식
const convertFacts = (dbFacts = []) => {
  const result = {};

  CATEGORIES.forEach((category) => {
    result[category.key] = {};

    category.items.forEach((item) => {
      result[category.key][item] = null;
    });
  });

  dbFacts.forEach((fact) => {
    const value = String(fact.value ?? "");
    const normalizedValue = normalize(value);

    Object.entries(FACT_VALUE_RULES).forEach(([categoryKey, items]) => {
      Object.entries(items).forEach(([item, keywords]) => {
        const matched = keywords.some((keyword) =>
          normalizedValue.includes(normalize(keyword)),
        );

        if (matched) {
          result[categoryKey][item] = parseFactValue(value);
        }
      });
    });
  });

  return result;
};

// 승인된 DB 접근성 정보를 기존 facts에 반영
const applyApprovedAccessibility = (facts, accessibility = []) => {
  const result = {
    ...facts,
    access: { ...facts.access },
  };

  accessibility.forEach((value) => {
    const normalizedValue = normalize(value);

    Object.entries(FACT_VALUE_RULES.access).forEach(([item, keywords]) => {
      const matched = keywords.some((keyword) =>
        normalizedValue.includes(normalize(keyword)),
      );

      if (matched) {
        result.access[item] = true;
      }
    });
  });

  return result;
};

export default function HomePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState("access");
  const [picked, setPicked] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // 실제 DB 장소
  const [dbPlaces, setDbPlaces] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [placesError, setPlacesError] = useState("");

  const category = CATEGORIES.find((c) => c.key === categoryKey);

  // DB 장소 목록 및 각 장소의 facts 조회
  useEffect(() => {
    const fetchPlaces = async () => {
      setPlacesLoading(true);
      setPlacesError("");

      try {
        const response = await fetch(`${API_BASE}/places`);

        if (!response.ok) {
          throw new Error("장소 목록을 불러오지 못했습니다.");
        }

        const placeData = await response.json();

        const placesWithFacts = await Promise.all(
          placeData.map(async (place) => {
            try {
              const factsResponse = await fetch(
                `${API_BASE}/places/${place.id}/facts`,
              );

              if (!factsResponse.ok) {
                throw new Error("장소 정보 조회 실패");
              }

              const factsData = await factsResponse.json();

              // 기존 place_facts 변환
              const convertedFacts = convertFacts(factsData.facts || []);

              // 승인된 submissions 접근성 정보를 기존 facts에 반영
              const finalFacts = applyApprovedAccessibility(
                convertedFacts,
                place.accessibility || [],
              );

              return {
                ...place,
                facts: finalFacts,
                tags: place.category || "",
                reviewCount: place.review_count ?? 0,
                thumb: place.thumbnail ?? null,
              };
            } catch (error) {
              console.error(`${place.name} facts 조회 실패:`, error);

              // facts 조회 실패 시에도 /places의 접근성 정보 반영
              const convertedFacts = convertFacts([]);

              return {
                ...place,
                facts: applyApprovedAccessibility(
                  convertedFacts,
                  place.accessibility || [],
                ),
                tags: place.category || "",
                reviewCount: place.review_count ?? 0,
                thumb: place.thumbnail ?? null,
              };
            }
          }),
        );

        setDbPlaces(placesWithFacts);
      } catch (error) {
        console.error("장소 목록 조회 실패:", error);
        setPlacesError(error.message || "장소를 불러오지 못했습니다.");
      } finally {
        setPlacesLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // 기존 AI 장소 검색
  const handleSearch = async (e) => {
    e.preventDefault();

    const placeName = query.trim();

    if (!placeName) {
      setSummary("");
      setSearchError("검색할 장소명을 입력해 주세요.");
      return;
    }

    setLoading(true);
    setSummary("");
    setSearchError("");

    try {
      const result = await summarizePlace(placeName);
      setSummary(result.summary);
    } catch (error) {
      setSearchError(error.message || "장소 검색에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 기존 카테고리 변경
  const changeCategory = (key) => {
    setCategoryKey(key);
    setPicked([]);
  };

  // 기존 세부 항목 선택
  const togglePick = (item) =>
    setPicked((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );

  // DB 장소 검색 + 선택한 세부 항목 필터
  const places = useMemo(
    () =>
      dbPlaces
        .filter((p) => p.name?.includes(query.trim()))
        .filter((p) =>
          picked.every((item) => p.facts[categoryKey]?.[item] === true),
        ),
    [dbPlaces, query, categoryKey, picked],
  );

  return (
    <div className="home">
      <header className="home__header">
        <span className="home__logo">로고</span>
      </header>

      <main className="home__body">
        <form className="search" role="search" onSubmit={handleSearch}>
          <label htmlFor="search-input" className="sr-only">
            장소 검색
          </label>

          <input
            id="search-input"
            className="search__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="장소명을 검색해 보세요"
          />

          <button type="submit" className="search__btn" aria-label="검색">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-4-4" />
            </svg>
          </button>
        </form>

        {loading && (
          <p role="status">Google 검색으로 장소 정보를 확인하고 있어요...</p>
        )}

        {searchError && <p role="alert">{searchError}</p>}

        {summary && (
          <section className="place-summary" aria-live="polite">
            <h2>AI 장소 검색 결과</h2>
            <p>{summary}</p>
          </section>
        )}

        <div className="cats" role="tablist" aria-label="카테고리">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={categoryKey === c.key}
              className={`cat${categoryKey === c.key ? " is-active" : ""}`}
              onClick={() => changeCategory(c.key)}
            >
              <img
                className="cat__icon"
                src={CATEGORY_ICONS[c.key]}
                alt=""
                width="32"
                height="32"
              />
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <ul className="picks" aria-label={`${category.label} 세부 항목`}>
          {category.items.map((item) => {
            const on = picked.includes(item);

            return (
              <li key={item}>
                <button
                  type="button"
                  aria-pressed={on}
                  className={`pick${on ? " is-on" : ""}`}
                  onClick={() => togglePick(item)}
                >
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
                  {item}
                </button>
              </li>
            );
          })}
        </ul>

        <ul className="places">
          {placesLoading && (
            <li className="places__empty">장소 정보를 불러오는 중입니다.</li>
          )}

          {placesError && <li className="places__empty">{placesError}</li>}

          {!placesLoading &&
            !placesError &&
            places.map((p) => (
              <PlaceCard
                key={p.id}
                place={p}
                facts={p.facts[categoryKey]}
                onClick={() => navigate(`/places/${p.id}`)}
              />
            ))}

          {!placesLoading && !placesError && places.length === 0 && (
            <li className="places__empty">조건에 맞는 장소가 아직 없어요.</li>
          )}
        </ul>
      </main>

      <BottomTabBar />
    </div>
  );
}
