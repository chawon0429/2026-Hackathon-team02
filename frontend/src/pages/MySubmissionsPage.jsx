// import { useMemo, useState } from "react";
// import BottomTabBar from "../components/BottomTabBar";
// import "./MySubmissionsPage.css";

// /* 목업 데이터 (API 연동은 이후에) */
// const MOCK_USER = { nickname: "닉네임", isAdmin: false }; // true로 바꾸면 관리자 화면

// // 일반 사용자: 내가 한 제보
// const MY_SUBMISSIONS = [
//   { id: 1, store: "밥가게", floor: "B1층", status: "approved", createdAt: "2026-11-03" },
//   { id: 2, store: "라면가게", floor: "B1층", status: "approved", createdAt: "2026-11-02" },
//   { id: 3, store: "빵가게", floor: "B1층", status: "approved", createdAt: "2026-11-01" },
//   { id: 4, store: "죽가게", floor: "B1층", status: "approved", createdAt: "2026-10-30" },
//   { id: 5, store: "국수가게", floor: "1층", status: "pending", createdAt: "2026-11-03" },
//   { id: 6, store: "분식가게", floor: "1층", status: "pending", createdAt: "2026-11-02" },
// ];

// // 관리자: 모든 사용자의 제보
// const ALL_SUBMISSIONS = [
//   { id: 1, user: "@사용자 1", store: "빵가게", status: "approved", createdAt: "2026-11-03" },
//   { id: 2, user: "@사용자 2", store: "빵가게", status: "approved", createdAt: "2026-11-02" },
//   { id: 3, user: "@사용자 3", store: "빵가게", status: "approved", createdAt: "2026-11-01" },
//   { id: 4, user: "@사용자 4", store: "빵가게", status: "approved", createdAt: "2026-10-30" },
//   { id: 5, user: "@사용자 1", store: "빵가게", status: "pending", createdAt: "2026-11-03" },
//   { id: 6, user: "@사용자 2", store: "빵가게", status: "pending", createdAt: "2026-11-02" },
//   { id: 7, user: "@사용자 3", store: "빵가게", status: "pending", createdAt: "2026-11-01" },
//   { id: 8, user: "@사용자 4", store: "빵가게", status: "pending", createdAt: "2026-10-30" },
// ];

// const MOCK_MISSIONS = [
//   { id: 1, title: "리뷰 작성하기", point: 100, done: true },
//   { id: 2, title: "좋아요 5번 누르기", point: 100, done: false },
//   { id: 3, title: "좋아요 5개 받기", point: 100, done: false },
//   { id: 4, title: "친구에게 공유하기", point: 100, done: false },
// ];

// const TABS = [
//   { key: "approved", label: "승인완료" },
//   { key: "pending", label: "승인대기" },
// ];
// const STATUS_LABEL = { approved: "승인 완료", pending: "승인 대기" };

// function Chevron() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
//          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
//       <path d="M9 5l7 7-7 7" />
//     </svg>
//   );
// }

// function ProfileSection({ user, submissions }) {
//   const stats = [
//     { label: "전체 제보", count: submissions.length },
//     { label: "승인 완료", count: submissions.filter((s) => s.status === "approved").length },
//     { label: "승인 대기", count: submissions.filter((s) => s.status === "pending").length },
//   ];

//   return (
//     <section className="profile">
//       <div className="profile__row">
//         <div className="profile__avatar" aria-hidden="true" />
//         <h1 className="profile__name">{user.nickname}</h1>
//         {user.isAdmin && <span className="badge-admin">관리자</span>}
//         <button type="button" className="btn-logout"
//                 onClick={() => {}}>
//           로그아웃
//         </button>
//       </div>
//       <div className="stats">
//         {stats.map((s) => (
//           <button type="button" key={s.label} className="stat">
//             <b>{s.label}</b> <span>{s.count}건</span> <Chevron />
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }

// function SectionHeader({ title, onMore }) {
//   return (
//     <div className="section__head">
//       <h2>{title}</h2>
//       <button type="button" className="section__more" onClick={onMore} aria-label={`${title} 더보기`}>
//         <Chevron />
//       </button>
//     </div>
//   );
// }

// function Timeline({ isAdmin, submissions }) {
//   // 관리자는 승인대기 탭이 기본 선택
//   const [tab, setTab] = useState(isAdmin ? "pending" : "approved");
//   const [sort, setSort] = useState("latest");

//   const list = useMemo(() => {
//     const filtered = submissions.filter((s) => s.status === tab);
//     return [...filtered].sort((a, b) =>
//       sort === "latest"
//         ? b.createdAt.localeCompare(a.createdAt)
//         : a.createdAt.localeCompare(b.createdAt)
//     );
//   }, [submissions, tab, sort]);

//   return (
//     <section className="section">
//       <SectionHeader title={isAdmin ? "관리자 승인" : "내 타임라인"}
//                      onMore={() => {}} />

//       <div className="filters">
//         <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬">
//           <option value="latest">최신순</option>
//           <option value="oldest">오래된순</option>
//         </select>
//         <span className="filters__divider" />
//         <div role="tablist" className="tabs">
//           {TABS.map((t) => (
//             <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
//                     className={`tab${tab === t.key ? " is-active" : ""}`}
//                     onClick={() => setTab(t.key)}>
//               {t.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <ul className="cards">
//         {list.map((item) => (
//           <li key={item.id} className="card">
//             {isAdmin ? (
//               <>
//                 <span className="card__store">{item.user}</span>
//                 <span className="card__dong">{item.store}</span>
//               </>
//             ) : (
//               <>
//                 <span className="card__store">{item.store}</span>
//                 <span className="card__dong">{item.floor}</span>
//               </>
//             )}
//             <span className={`status status--${item.status}`}>{STATUS_LABEL[item.status]}</span>
//           </li>
//         ))}
//         {list.length === 0 && <li className="empty">아직 제보한 내역이 없어요.</li>}
//       </ul>
//     </section>
//   );
// }

// function Missions() {
//   return (
//     <section className="section">
//       <SectionHeader title="포인트 미션" onMore={() => {}} />
//       <ul className="cards">
//         {MOCK_MISSIONS.map((m, i) => (
//           <li key={m.id} className={`card card--mission${m.done ? " is-done" : ""}`}>
//             <div className="mission__row">
//               <span className="mission__title">{i + 1}. {m.title}</span>
//               <span className="mission__point">{m.point}P</span>
//             </div>
//             <span className={`check${m.done ? " is-done" : ""}`} role="img"
//                   aria-label={m.done ? "완료" : "미완료"}>
//               {m.done && (
//                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff"
//                      strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M5 12.5l4.5 4.5L19 7.5" />
//                 </svg>
//               )}
//             </span>
//           </li>
//         ))}
//       </ul>
//     </section>
//   );
// }

// /*  페이지  */
// export default function MySubmissionsPage() {
//   const user = MOCK_USER;
//   const submissions = user.isAdmin ? ALL_SUBMISSIONS : MY_SUBMISSIONS;

//   return (
//     <div className="mypage">
//       <div className="mypage__topbar" />
//       <main className="mypage__body">
//         <ProfileSection user={user} submissions={submissions} />
//         <Timeline isAdmin={user.isAdmin} submissions={submissions} />
//         <Missions />
//       </main>
//       <BottomTabBar />
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import BottomTabBar from "../components/BottomTabBar";
import { getMySubmissions } from "../api/submission";
import { getUser } from "../api/user";
import "./MySubmissionsPage.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// 로그인 기능이 없으므로 현재 테스트 사용자 ID 유지
const DEMO_USER_ID = 1;

const MOCK_MISSIONS = [
  { id: 1, title: "리뷰 작성하기", point: 100, done: true },
  { id: 2, title: "좋아요 5번 누르기", point: 100, done: false },
  { id: 3, title: "좋아요 5개 받기", point: 100, done: false },
  { id: 4, title: "친구에게 공유하기", point: 100, done: false },
];

const TABS = [
  { key: "approved", label: "승인완료" },
  { key: "pending", label: "승인대기" },
];

const STATUS_LABEL = {
  approved: "승인 완료",
  pending: "승인 대기",
  rejected: "반려",
};

function Chevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ProfileSection({ user, submissions }) {
  const stats = [
    { label: "전체 제보", count: submissions.length },
    {
      label: "승인 완료",
      count: submissions.filter((s) => s.status === "approved").length,
    },
    {
      label: "승인 대기",
      count: submissions.filter((s) => s.status === "pending").length,
    },
  ];

  return (
    <section className="profile">
      <div className="profile__row">
        <div className="profile__avatar" aria-hidden="true" />

        <h1 className="profile__name">{user.nickname}</h1>

        {user.isAdmin && <span className="badge-admin">관리자</span>}

        <button
          type="button"
          className="btn-logout"
          onClick={() => {
            // 로그인 기능이 없으므로 로그아웃 처리 없음
          }}
        >
          로그아웃
        </button>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <button type="button" key={s.label} className="stat">
            <b>{s.label}</b>
            <span>{s.count}건</span>
            <Chevron />
          </button>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, onMore }) {
  return (
    <div className="section__head">
      <h2>{title}</h2>

      <button
        type="button"
        className="section__more"
        onClick={onMore}
        aria-label={`${title} 더보기`}
      >
        <Chevron />
      </button>
    </div>
  );
}

// 주소에서 층 정보 추출
function getFloor(address) {
  if (!address) return "";

  const match = String(address).match(/(?:지하\s*\d+층|B\d+층|\d+층)/);

  return match ? match[0].replace(/\s/g, "") : "";
}

function Timeline({ isAdmin, submissions, places, loading, error }) {
  const [tab, setTab] = useState(isAdmin ? "pending" : "approved");
  const [sort, setSort] = useState("latest");

  const list = useMemo(() => {
    const filtered = submissions.filter((s) => s.status === tab);

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
      const dateB = new Date(b.created_at || b.createdAt || 0).getTime();

      return sort === "latest" ? dateB - dateA : dateA - dateB;
    });
  }, [submissions, tab, sort]);

  return (
    <section className="section">
      <SectionHeader
        title={isAdmin ? "관리자 승인" : "내 타임라인"}
        onMore={() => {}}
      />

      <div className="filters">
        <select
          className="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="정렬"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>

        <span className="filters__divider" />

        <div role="tablist" className="tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`tab${tab === t.key ? " is-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="cards">
        {loading ? (
          <li className="empty">제보를 불러오는 중입니다.</li>
        ) : error ? (
          <li className="empty">{error}</li>
        ) : (
          <>
            {list.map((item) => {
              const place = places[item.place_id];
              const storeName =
                place?.name || item.place_name || `장소 ${item.place_id}`;

              const floor = getFloor(place?.address) || item.floor || "";

              return (
                <li key={item.id} className="card">
                  {isAdmin ? (
                    <>
                      <span className="card__store">
                        {item.user_nickname || `사용자 ${item.user_id}`}
                      </span>
                      <span className="card__dong">{storeName}</span>
                    </>
                  ) : (
                    <>
                      <span className="card__store">{storeName}</span>
                      <span className="card__dong">{floor}</span>
                    </>
                  )}

                  <span className={`status status--${item.status}`}>
                    {STATUS_LABEL[item.status] || item.status}
                  </span>
                </li>
              );
            })}

            {list.length === 0 && (
              <li className="empty">아직 제보한 내역이 없어요.</li>
            )}
          </>
        )}
      </ul>
    </section>
  );
}

function Missions() {
  return (
    <section className="section">
      <SectionHeader title="포인트 미션" onMore={() => {}} />

      <ul className="cards">
        {MOCK_MISSIONS.map((m, i) => (
          <li
            key={m.id}
            className={`card card--mission${m.done ? " is-done" : ""}`}
          >
            <div className="mission__row">
              <span className="mission__title">
                {i + 1}. {m.title}
              </span>

              <span className="mission__point">{m.point}P</span>
            </div>

            <span
              className={`check${m.done ? " is-done" : ""}`}
              role="img"
              aria-label={m.done ? "완료" : "미완료"}
            >
              {m.done && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MySubmissionsPage() {
  const [user, setUser] = useState({
    id: DEMO_USER_ID,
    nickname: "",
    isAdmin: false,
  });

  const [submissions, setSubmissions] = useState([]);
  const [places, setPlaces] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      setUserLoading(true);
      setUserError("");

      try {
        // DB 사용자 정보 조회
        const userData = await getUser(DEMO_USER_ID);

        setUser({
          id: userData.id,
          nickname: userData.nickname,
          isAdmin: false,
        });

        // 실제 내 제보 조회
        const submissionResult = await getMySubmissions();

        const submissionList = Array.isArray(submissionResult)
          ? submissionResult
          : submissionResult?.items || [];

        const normalized = submissionList.map((item) => ({
          ...item,
          place_id: Number(item.place_id),
          status: String(item.status || "").toLowerCase(),
        }));

        setSubmissions(normalized);

        // 실제 장소 이름 및 주소 조회
        const placesResponse = await fetch(`${API_BASE}/places`);

        if (placesResponse.ok) {
          const placesData = await placesResponse.json();

          const placeMap = {};

          placesData.forEach((place) => {
            placeMap[place.id] = place;
          });

          setPlaces(placeMap);
        }
      } catch (err) {
        console.error("내 페이지 데이터 조회 실패:", err);
        setError(err.message || "데이터를 불러오지 못했습니다.");
        setUserError(err.message || "사용자 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
        setUserLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mypage">
      <div className="mypage__topbar" />

      <main className="mypage__body">
        {userLoading ? (
          <section className="profile">
            <h1 className="profile__name">사용자 정보를 불러오는 중입니다.</h1>
          </section>
        ) : userError ? (
          <section className="profile">
            <h1 className="profile__name">{userError}</h1>
          </section>
        ) : (
          <ProfileSection user={user} submissions={submissions} />
        )}

        <Timeline
          isAdmin={user.isAdmin}
          submissions={submissions}
          places={places}
          loading={loading}
          error={error}
        />

        <Missions />
      </main>

      <BottomTabBar />
    </div>
  );
}
