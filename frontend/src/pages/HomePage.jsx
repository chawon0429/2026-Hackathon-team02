import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import PlaceCard from "../components/PlaceCard";
import { CATEGORIES, MOCK_PLACES } from "../mocks/places";
import { getPlaces } from "../api/places";
import accessIcon from "../assets/cat-access.svg";
import facilityIcon from "../assets/cat-facility.svg";
import menuIcon from "../assets/cat-menu.svg";
import benefitIcon from "../assets/cat-benefit.svg";
import orderIcon from "../assets/cat-order.svg";
import "./HomePage.css";

const CATEGORY_ICONS = {
  access: accessIcon,
  facility: facilityIcon,
  menu: menuIcon,
  benefit: benefitIcon,
  order: orderIcon,
};

// 백엔드 응답을 화면에서 쓰는 모양으로.
// 접근성·시설 정보(facts)는 아직 API에 없어서, 이름이 같은 목업이 있으면 그 값을 임시로 씀
// (백엔드에서 facts를 주기 시작하면 이 부분만 바꾸면 됨)
const toPlace = (p) => {
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
    facts: mock?.facts ?? {},
  };
};

export default function HomePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [categoryKey, setCategoryKey] = useState("access");
  const [picked, setPicked] = useState([]); // 선택한 세부 항목(필터)
  const [allPlaces, setAllPlaces] = useState([]); // 응답이 오기 전에는 비워둠 (깜빡임 방지)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getPlaces()
      .then((list) => {
        if (!alive) return;
        // 테스트로 넣은 "string" 같은 값은 거르고, 데이터가 있을 때만 API 값을 씀
        const real = Array.isArray(list)
          ? list.filter((p) => p.name && p.name !== "string").map(toPlace)
          : [];
        setAllPlaces(real.length > 0 ? real : MOCK_PLACES);
      })
      .catch(() => {
        if (alive) setAllPlaces(MOCK_PLACES); // 서버가 안 되면 목업데이터를 보여줌
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
            <PlaceCard key={p.id} place={p} facts={p.facts?.[categoryKey] ?? {}}
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