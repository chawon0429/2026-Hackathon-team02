import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import PlaceCard from "../components/PlaceCard";
import { MOCK_PLACES } from "../mocks/places";
import { getPlaces, getPlaceFacts } from "../api/places";
import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";
import "./HomePage.css";

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
};

export default function HomePage() {
  const navigate = useNavigate();
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
            </svg>
          </button>
        </form>

        <div className="cats" role="tablist" aria-label="카테고리">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button" role="tab" aria-selected={categoryKey === c.key}
                    className={`cat${categoryKey === c.key ? " is-active" : ""}`}
                    onClick={() => changeCategory(c.key)}>
              <img className="cat__icon" src={CATEGORY_ICONS[c.key]} alt="" width="32" height="32" />
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <ul className="picks" aria-label={`${category.label} 세부 항목`}>
          {category.items.map((item) => {
            const on = picked.includes(item);
            return (
              <li key={item}>
                <button type="button" aria-pressed={on} className={`pick${on ? " is-on" : ""}`}
                        onClick={() => togglePick(item)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                  {item}
                </button>
              </li>
            );
          })}
        </ul>

        <ul className="places">
          {places.map((p) => (
            <PlaceCard key={p.id} place={p} facts={visibleFacts(p.facts, categoryKey)}
                       onClick={() => navigate(`/places/${p.id}`)} />
          ))}
          {loading && <li className="places__empty">불러오는 중이에요...</li>}
          {!loading && places.length === 0 && <li className="places__empty">조건에 맞는 장소가 아직 없어요.</li>}
        </ul>
      </main>

      <BottomTabBar />
    </div>
  );
}