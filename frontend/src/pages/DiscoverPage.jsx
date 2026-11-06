import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import {
  MAP_SIZE,
  MAP_CELLS,
  MAP_TABLES,
  DISCOVER_CATEGORIES,
  DISCOVER_ITEMS,
} from "../mocks/discover";
import "./DiscoverPage.css";

// 피그마에서 받은 SVG 아이콘
import restroomIcon from "../assets/map-restroom.svg";
import elevatorIcon from "../assets/map-elevator.svg";
import extinguisherIcon from "../assets/map-extinguisher.svg";
import stairsIcon from "../assets/map-stairs.svg";
import exitIcon from "../assets/map-exit.svg";
import cafeIcon from "../assets/map-cafe.svg";
import tableIcon from "../assets/map-table.svg";
import shopIcon from "../assets/map-shop.svg";
import wheelchairIcon from "../assets/badge-wheelchair.svg";
import autodoorIcon from "../assets/badge-autodoor.svg";

const IMG_ICONS = {
  restroom: restroomIcon,
  elevator: elevatorIcon,
  extinguisher: extinguisherIcon,
  stairs: stairsIcon,
  exit: exitIcon,
  cafe: cafeIcon,
  shop: shopIcon,
  wheelchair: wheelchairIcon,
  autodoor: autodoorIcon,
};

function Icon({ name, size, px, active }) {
  return (
    <img
      className={`icon-img${px ? " is-map" : ""}${active ? " is-active" : ""}`}
      src={IMG_ICONS[name]}
      alt=""
      width={size}
      height={size}
      style={px ? { "--icon": px } : undefined}
    />
  );
}

const pos = ({ x, y, w, h }) => ({
  left: `${(x / MAP_SIZE.w) * 100}%`,
  top: `${(y / MAP_SIZE.h) * 100}%`,
  width: `${(w / MAP_SIZE.w) * 100}%`,
  height: `${(h / MAP_SIZE.h) * 100}%`,
});

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [categoryKey, setCategoryKey] = useState("restroom");
  const [selectedId, setSelectedId] = useState(null);

  const items = DISCOVER_ITEMS[categoryKey] || [];
  const selectedItem = items.find((i) => i.id === selectedId);

  const changeCategory = (key) => {
    setCategoryKey(key);
    setSelectedId(null);
  };

  const handleItemClick = (it) => {
    if (selectedId !== it.id) {
      setSelectedId(it.id);
    } else {
      navigate(`/places/${it.placeId || 1}`);
    }
  };

  // 지도 상의 아이콘(셀) 클릭 핸들러
  const handleCellClick = (cell) => {
    if (cell.decor) return;

    // 1. 해당 셀의 종류로 카테고리 자동 변경
    const targetCategory = cell.type || categoryKey;
    if (DISCOVER_CATEGORIES.some((cat) => cat.key === targetCategory)) {
      if (categoryKey !== targetCategory) {
        setCategoryKey(targetCategory);
      }
    }

    // 2. 해당 셀(cell.id)에 해당되는 아이템 탐색
    const categoryItems = DISCOVER_ITEMS[targetCategory] || [];
    const matchedItem = categoryItems.find((it) => it.cell === cell.id);

    if (matchedItem) {
      if (selectedId === matchedItem.id) {
        // 이미 선택되어 강조된 셀/아이콘을 한 번 더 클릭하면 장소 상세 페이지로 이동
        navigate(`/places/${matchedItem.placeId || 1}`);
      } else {
        // 첫 클릭 시 하이라이트 강조 선택
        setSelectedId(matchedItem.id);
      }
    }
  };

  return (
    <div className="discover">
      <main className="discover__body">
        <h1 className="sr-only">큰 건물 내 전체 지도</h1>

        <div
          className="fmap"
          role="group"
          aria-label="건물 B1층 지도"
          style={{ aspectRatio: `${MAP_SIZE.w} / ${MAP_SIZE.h}` }}
        >
          {MAP_CELLS.map((c) => {
            const style = pos(c);
            if (c.decor) {
              return (
                <div
                  key={c.id}
                  className="fmap__cell is-decor"
                  style={style}
                  role="img"
                  aria-label={c.label}
                >
                  <Icon name={c.type} px={c.icon} />
                </div>
              );
            }
            const match = c.type === categoryKey;
            const chosen = selectedItem?.cell === c.id;

            return (
              <div
                key={c.id}
                style={{ ...style, cursor: "pointer" }}
                className={`fmap__cell${match ? " is-match" : ""}${chosen ? " is-chosen" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={c.label + (match ? " (선택한 종류)" : "")}
                onClick={() => handleCellClick(c)}
                onKeyDown={(e) => e.key === "Enter" && handleCellClick(c)}
              >
                <Icon name={c.type} px={c.icon} active={match || chosen} />
              </div>
            );
          })}

          <span className="fmap__exit" aria-hidden="true">
            출구
          </span>
          <span className="fmap__exit-door" aria-hidden="true" />
          <span className="fmap__door" aria-hidden="true" />
          <span className="fmap__label-in" aria-hidden="true">
            입구
          </span>

          {MAP_TABLES.map((t, i) => (
            <span
              key={i}
              className="fmap__table"
              style={pos(t)}
              aria-hidden="true"
            >
              <img src={tableIcon} alt="" />
            </span>
          ))}
        </div>

        {/* 시설 종류 (카테고리 탭) */}
        <div className="dcats" role="tablist" aria-label="시설 종류">
          {DISCOVER_CATEGORIES.map((c) => {
            const isActive = categoryKey === c.key;
            return (
              <button
                key={c.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`dcat${isActive ? " is-active" : ""}`}
                onClick={() => changeCategory(c.key)}
              >
                <Icon name={c.key} size={28} active={isActive} />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* 하단 리스트 */}
        <ul
          className="dlist"
          aria-label={`${DISCOVER_CATEGORIES.find((c) => c.key === categoryKey)?.label || ""} 목록`}
        >
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                aria-pressed={selectedId === it.id}
                className={`ditem${selectedId === it.id ? " is-selected" : ""}`}
                onClick={() => handleItemClick(it)}
              >
                <span className="ditem__text">
                  <strong className="ditem__name">{it.name}</strong>
                  <span className="ditem__meta">
                    <b>{it.distance}</b> {it.where}
                  </span>
                </span>
                <span className="ditem__badges">
                  {it.accessible && (
                    <span className="badge">
                      <Icon name="wheelchair" size={26} />
                      <span className="sr-only">휠체어 이용 가능</span>
                    </span>
                  )}
                  {it.autoDoor && (
                    <span className="badge">
                      <Icon name="autodoor" size={26} />
                      <span className="sr-only">자동문</span>
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>

      <BottomTabBar />
    </div>
  );
}
