<<<<<<< HEAD
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
=======
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import PlaceCard from "../components/PlaceCard";
import { MOCK_PLACES } from "../mocks/places";
import { getPlaces, getPlaceFacts } from "../api/places";
>>>>>>> origin/6-feat-home-api
import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";
import "./HomePage.css";
import { summarizePlace } from "../api/analysis";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// 칩 이름은 제보 폼(장소 제보 화면)의 항목과 같음 백엔드 facts의 value와 이 이름으로 맞춰야함
// (메뉴·상품은 제보 폼에 없어서 지금은 항상 "정보 없음")
const CATEGORIES = [
  { key: "access", label: "접근성", items: ["계단", "경사로", "자동문", "엘리베이터", "휠체어 가능"] },
  { key: "facility", label: "시설", items: ["유아의자", "장애인석", "콘센트", "흡연구역", "주차"] },
  { key: "menu", label: "메뉴·상품", items: ["메뉴판 있음", "큰 글씨 메뉴", "가격 표시", "사진 메뉴"] },
  { key: "benefit", label: "결제 혜택", items: ["카드 결제", "네이버페이", "제로페이", "포인트 적립", "통신사 할인"] },
  {
    key: "order",
    label: "주문·이용",
    items: [
      "예약없이 이용", "예약 후 이용", "포장>배달 이용",
      "바로 입장", "10분 이내", "30분 이내",
      "최소 주문 없음", "1인 1메뉴", "2인분 이상",
    ],
  },
];

// 주문·이용은 "하나만 고르는 질문"이라, 고른 것(✓)만 카드에 보여줌
const visibleFacts = (facts, key) => {
  const f = facts?.[key] ?? {};
  return key === "order" ? Object.fromEntries(Object.entries(f).filter(([, v]) => v === true)) : f;
};

const CATEGORY_ICONS = {
  access: accessIcon,
  facility: facilityIcon,
  menu: menuIcon,
  benefit: benefitIcon,
  order: orderIcon,
};

<<<<<<< HEAD
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
=======
const NEGATIVE = /없|불가|미설치/;
const buildFacts = (factList) => {
  const values = (Array.isArray(factList) ? factList : []).map((f) => String(f.value ?? ""));
  const facts = {};
  for (const c of CATEGORIES) {
    facts[c.key] = {};
    for (const item of c.items) {
      const hit = values.find((v) => v.includes(item));
      // 칩 이름을 뺀 나머지 글자에서 "없음/불가"를 찾음("예약없이 이용 가능"이 없음으로 잘못 읽히지 않게)
      facts[c.key][item] = hit === undefined ? null : !NEGATIVE.test(hit.replace(item, ""));
    }
  }
  return facts;
};

const toPlace = (p, factList) => {
  const mock = MOCK_PLACES.find((m) => m.name === p.name);
  return {
    id: p.id,
    name: p.name,
    address: p.address,
    category: p.category,
    description: p.description,
    sourceUrl: p.source_url,
    tags: p.category || mock?.tags || "",      // 카드 윗줄: API의 category
    reviewCount: mock?.reviewCount ?? "0",     // 리뷰 수는 API에 없어서 임시값
    thumb: null,
    facts: buildFacts(factList),
  };
>>>>>>> origin/6-feat-home-api
};

export default function HomePage() {
  const navigate = useNavigate();
<<<<<<< HEAD

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
=======
  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState("access");
  const [picked, setPicked] = useState([]); // 선택한 세부 항목(필터)
  const [allPlaces, setAllPlaces] = useState([]); // 응답이 오기 전에는 비워 둠 (깜빡임 방지)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPlaces()
      .then(async (list) => {
        // 테스트로 넣은 "string" 같은 값은 거르고, 데이터가 있을 때만 API 값을 씀
        const real = Array.isArray(list) ? list.filter((p) => p.name && p.name !== "string") : [];
        if (real.length === 0) {
          if (alive) setAllPlaces(MOCK_PLACES);
          return;
        }
        // 장소마다 세부 정보(facts)를 가져옴. 실패하면 그 장소는 "정보 없음"으로 보여짐
        const withFacts = await Promise.all(
          real.map(async (p) => {
            const res = await getPlaceFacts(p.id).catch(() => null);
            return toPlace(p, res?.facts);
          })
        );
        if (alive) setAllPlaces(withFacts);
      })
      .catch(() => {
        if (alive) setAllPlaces(MOCK_PLACES); // 서버가 안 되면 목업을 보여줌
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const category = CATEGORIES.find((c) => c.key === categoryKey);

  const changeCategory = (key) => {
    setCategoryKey(key);
    setPicked([]);
  };
  const togglePick = (item) =>
    setPicked((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));

  const places = useMemo(
    () =>
      allPlaces.filter((p) => p.name.includes(query.trim())).filter((p) =>
        picked.every((item) => p.facts?.[categoryKey]?.[item] === true)
      ),
    [allPlaces, query, categoryKey, picked]
  );

  return (
    <div className="home">
      <header className="home__header"><span className="home__logo">로고</span></header>

      <main className="home__body">
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="search-input" className="sr-only">장소 검색</label>
          <input id="search-input" className="search__input" value={query}
                 onChange={(e) => setQuery(e.target.value)} placeholder="장소명을 검색해 보세요" />
          <button type="submit" className="search__btn" aria-label="검색">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" />
>>>>>>> origin/6-feat-home-api
            </svg>
          </button>
        </form>

<<<<<<< HEAD
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
=======
        <div className="cats" role="tablist" aria-label="카테고리">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button" role="tab" aria-selected={categoryKey === c.key}
                    className={`cat${categoryKey === c.key ? " is-active" : ""}`}
                    onClick={() => changeCategory(c.key)}>
              <img className="cat__icon" src={CATEGORY_ICONS[c.key]} alt="" width="32" height="32" />
>>>>>>> origin/6-feat-home-api
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
<<<<<<< HEAD
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
=======
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} facts={visibleFacts(p.facts, categoryKey)}
                       onClick={() => navigate(`/places/${p.id}`)} />
          ))}
          {loading && <li className="places__empty">불러오는 중이에요...</li>}
          {!loading && places.length === 0 && <li className="places__empty">조건에 맞는 장소가 아직 없어요.</li>}
>>>>>>> origin/6-feat-home-api
        </ul>
      </main>

      <BottomTabBar />
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/6-feat-home-api
