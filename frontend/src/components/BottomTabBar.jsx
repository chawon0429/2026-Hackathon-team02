import { NavLink } from "react-router-dom";
import homeIcon from "../assets/home.svg";
import discoverIcon from "../assets/discover.svg";
import mypageIcon from "../assets/mypage.svg";
import "./BottomTabBar.css";

// 경로는 App.jsx의 Route path와 같아야함
const TABS = [
  { to: "/", label: "홈", icon: homeIcon },
  { to: "/discover", label: "발견", icon: discoverIcon },
  { to: "/mypage", label: "내 페이지", icon: mypageIcon },
];

export default function BottomTabBar() {
  return (
    <nav className="tabbar" aria-label="하단 메뉴">
      {TABS.map(({ to, label, icon }) => (
        <NavLink key={to} to={to} end={to === "/"}
                 className={({ isActive }) => `tabbar__item${isActive ? " is-active" : ""}`}>
          <img className="tabbar__icon" src={icon} alt="" width="28" height="28" />
          <span className="tabbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}