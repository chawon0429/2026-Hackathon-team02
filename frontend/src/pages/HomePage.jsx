import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import PlaceCard from "../components/PlaceCard";
import { CATEGORIES, MOCK_PLACES } from "../mocks/places";
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

export default function HomePage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [categoryKey, setCategoryKey] = useState("access");
    const [picked, setPicked] = useState([]);

    const category = CATEGORIES.find((c) => c.key === categoryKey);

    const changeCategory = (key) => {
        setCategoryKey(key);
        setPicked([]);
    };
    const togglePick = (item) =>
        setPicked((prev) => (prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]));

    const places = useMemo(
        () =>
        MOCK_PLACES.filter((p) => p.name.includes(query.trim())).filter((p) =>
            picked.every((item) => p.facts[categoryKey]?.[item] === true)
        ),
        [query, categoryKey, picked]
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
                <PlaceCard key={p.id} place={p} facts={p.facts[categoryKey]}
                        onClick={() => navigate(`/places/${p.id}`)} />
            ))}
            {places.length === 0 && <li className="places__empty">조건에 맞는 장소가 아직 없어요.</li>}
        </ul>
      </main>

        <BottomTabBar />
    </div>
    );
}