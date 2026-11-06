// import { NavLink } from "react-router-dom";
// import homeIcon from "../assets/home.svg";
// import discoverIcon from "../assets/discover.svg";
// import mypageIcon from "../assets/mypage.svg";
// import "./BottomTabBar.css";

// // 경로는 App.jsx의 Route path와 같아야함
// const TABS = [
//   { to: "/", label: "홈", icon: homeIcon },
//   { to: "/discover", label: "발견", icon: discoverIcon },
//   { to: "/mypage", label: "내 페이지", icon: mypageIcon },
// ];

// export default function BottomTabBar() {
//   return (
//     <nav className="tabbar" aria-label="하단 메뉴">
//       {TABS.map(({ to, label, icon }) => (
//         <NavLink key={to} to={to} end={to === "/"}
//                  className={({ isActive }) => `tabbar__item${isActive ? " is-active" : ""}`}>
//           <img className="tabbar__icon" src={icon} alt="" width="28" height="28" />
//           <span className="tabbar__label">{label}</span>
//         </NavLink>
//       ))}
//     </nav>
//   );
//}

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomTabBar.css";

// 홈 아이콘 SVG
const HomeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

// 발견 아이콘 SVG
const DiscoverIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="10" r="3" />
    <path d="M12 21s-6-5.33-6-11a6 6 0 0 1 12 0c0 5.67-6 11-6 11z" />
  </svg>
);

// 내 페이지 아이콘 SVG
const ProfileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function BottomTabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // App.jsx 라우트 경로와 100% 일치하도록 매핑
  const isHomeActive = currentPath === "/";
  const isDiscoverActive = currentPath.startsWith("/discover");
  const isMyPageActive = currentPath.startsWith("/mypage");

  return (
    <nav className="bottom-tab-bar" aria-label="하단 네비게이션">
      <button
        type="button"
        className={`bottom-tab-item ${isHomeActive ? "active" : ""}`}
        onClick={() => navigate("/")}
      >
        <div className="tab-icon-wrapper">
          <HomeIcon />
        </div>
        <span className="tab-label">홈</span>
      </button>

      <button
        type="button"
        className={`bottom-tab-item ${isDiscoverActive ? "active" : ""}`}
        onClick={() => navigate("/discover")}
      >
        <div className="tab-icon-wrapper">
          <DiscoverIcon />
        </div>
        <span className="tab-label">발견</span>
      </button>

      <button
        type="button"
        className={`bottom-tab-item ${isMyPageActive ? "active" : ""}`}
        onClick={() => navigate("/mypage")}
      >
        <div className="tab-icon-wrapper">
          <ProfileIcon />
        </div>
        <span className="tab-label">내 페이지</span>
      </button>
    </nav>
  );
}
