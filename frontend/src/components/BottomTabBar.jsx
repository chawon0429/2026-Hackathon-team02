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

  // 현재 URL에 admin=1이 있을 때만 관리자 이동 상태 유지
  const searchParams = new URLSearchParams(location.search);
  const isAdminMode = searchParams.get("admin") === "1";

  // 관리자 이동 상태 유지 (일반 사용자는 기존 URL 그대로)
  const getTabPath = (path) => {
    if (isAdminMode) {
      return `${path}?admin=1`;
    }

    return path;
  };

  const isHomeActive = currentPath === "/";
  const isDiscoverActive = currentPath.startsWith("/discover");
  const isMyPageActive = currentPath.startsWith("/mypage");

  return (
    <nav className="bottom-tab-bar" aria-label="하단 네비게이션">
      {/* 홈 */}
      <button
        type="button"
        className={`bottom-tab-item ${isHomeActive ? "active" : ""}`}
        onClick={() => navigate(getTabPath("/"))}
      >
        <div className="tab-icon-wrapper">
          <HomeIcon />
        </div>
        <span className="tab-label">홈</span>
      </button>

      {/* 발견 */}
      <button
        type="button"
        className={`bottom-tab-item ${isDiscoverActive ? "active" : ""}`}
        onClick={() => navigate(getTabPath("/discover"))}
      >
        <div className="tab-icon-wrapper">
          <DiscoverIcon />
        </div>
        <span className="tab-label">발견</span>
      </button>

      {/* 내 페이지 */}
      <button
        type="button"
        className={`bottom-tab-item ${isMyPageActive ? "active" : ""}`}
        onClick={() => navigate(getTabPath("/mypage"))}
      >
        <div className="tab-icon-wrapper">
          <ProfileIcon />
        </div>
        <span className="tab-label">내 페이지</span>
      </button>
    </nav>
  );
}
