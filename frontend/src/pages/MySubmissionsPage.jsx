// // import { useMemo, useState } from "react";

// import BottomTabBar from "../components/BottomTabBar";
// import "./MySubmissionsPage.css";

// /* 목업 데이터 (API 연동은 이후에) */
// const MOCK_USER = { nickname: "닉네임", isAdmin: false }; // true로 바꾸면 관리자 화면

// // 일반 사용자: 내가 한 제보
// const MY_SUBMISSIONS = [
//   {
//     id: 1,
//     store: "밥가게",
//     floor: "B1층",
//     status: "approved",
//     createdAt: "2026-11-03",
//   },
//   {
//     id: 2,
//     store: "라면가게",
//     floor: "B1층",
//     status: "approved",
//     createdAt: "2026-11-02",
//   },
//   {
//     id: 3,
//     store: "빵가게",
//     floor: "B1층",
//     status: "approved",
//     createdAt: "2026-11-01",
//   },
//   {
//     id: 4,
//     store: "죽가게",
//     floor: "B1층",
//     status: "approved",
//     createdAt: "2026-10-30",
//   },
//   {
//     id: 5,
//     store: "국수가게",
//     floor: "1층",
//     status: "pending",
//     createdAt: "2026-11-03",
//   },
//   {
//     id: 6,
//     store: "분식가게",
//     floor: "1층",
//     status: "pending",
//     createdAt: "2026-11-02",
//   },
// ];

// // 관리자: 모든 사용자의 제보
// const ALL_SUBMISSIONS = [
//   {
//     id: 1,
//     user: "@사용자 1",
//     store: "빵가게",
//     status: "approved",
//     createdAt: "2026-11-03",
//   },
//   {
//     id: 2,
//     user: "@사용자 2",
//     store: "빵가게",
//     status: "approved",
//     createdAt: "2026-11-02",
//   },
//   {
//     id: 3,
//     user: "@사용자 3",
//     store: "빵가게",
//     status: "approved",
//     createdAt: "2026-11-01",
//   },
//   {
//     id: 4,
//     user: "@사용자 4",
//     store: "빵가게",
//     status: "approved",
//     createdAt: "2026-10-30",
//   },
//   {
//     id: 5,
//     user: "@사용자 1",
//     store: "빵가게",
//     status: "pending",
//     createdAt: "2026-11-03",
//   },
//   {
//     id: 6,
//     user: "@사용자 2",
//     store: "빵가게",
//     status: "pending",
//     createdAt: "2026-11-02",
//   },
//   {
//     id: 7,
//     user: "@사용자 3",
//     store: "빵가게",
//     status: "pending",
//     createdAt: "2026-11-01",
//   },
//   {
//     id: 8,
//     user: "@사용자 4",
//     store: "빵가게",
//     status: "pending",
//     createdAt: "2026-10-30",
//   },
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
//     <svg
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       aria-hidden="true"
//     >
//       <path d="M9 5l7 7-7 7" />
//     </svg>
//   );
// }

// function ProfileSection({ user, submissions }) {
//   const stats = [
//     { label: "전체 제보", count: submissions.length },
//     {
//       label: "승인 완료",
//       count: submissions.filter((s) => s.status === "approved").length,
//     },
//     {
//       label: "승인 대기",
//       count: submissions.filter((s) => s.status === "pending").length,
//     },
//   ];

//   return (
//     <section className="profile">
//       <div className="profile__row">
//         <div className="profile__avatar" aria-hidden="true" />
//         <h1 className="profile__name">{user.nickname}</h1>
//         {user.isAdmin && <span className="badge-admin">관리자</span>}
//         <button type="button" className="btn-logout" onClick={() => {}}>
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
//       <button
//         type="button"
//         className="section__more"
//         onClick={onMore}
//         aria-label={`${title} 더보기`}
//       >
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
//         : a.createdAt.localeCompare(b.createdAt),
//     );
//   }, [submissions, tab, sort]);

//   return (
//     <section className="section">
//       <SectionHeader
//         title={isAdmin ? "관리자 승인" : "내 타임라인"}
//         onMore={() => {}}
//       />

//       <div className="filters">
//         <select
//           className="sort"
//           value={sort}
//           onChange={(e) => setSort(e.target.value)}
//           aria-label="정렬"
//         >
//           <option value="latest">최신순</option>
//           <option value="oldest">오래된순</option>
//         </select>
//         <span className="filters__divider" />
//         <div role="tablist" className="tabs">
//           {TABS.map((t) => (
//             <button
//               key={t.key}
//               type="button"
//               role="tab"
//               aria-selected={tab === t.key}
//               className={`tab${tab === t.key ? " is-active" : ""}`}
//               onClick={() => setTab(t.key)}
//             >
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
//             <span className={`status status--${item.status}`}>
//               {STATUS_LABEL[item.status]}
//             </span>
//           </li>
//         ))}
//         {list.length === 0 && (
//           <li className="empty">아직 제보한 내역이 없어요.</li>
//         )}
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
//           <li
//             key={m.id}
//             className={`card card--mission${m.done ? " is-done" : ""}`}
//           >
//             <div className="mission__row">
//               <span className="mission__title">
//                 {i + 1}. {m.title}
//               </span>
//               <span className="mission__point">{m.point}P</span>
//             </div>
//             <span
//               className={`check${m.done ? " is-done" : ""}`}
//               role="img"
//               aria-label={m.done ? "완료" : "미완료"}
//             >
//               {m.done && (
//                 <svg
//                   width="14"
//                   height="14"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="#fff"
//                   strokeWidth="3.2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
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
import "./MySubmissionsPage.css";

// DB 장소 ID -> 장소 정보
const PLACE_INFO = {
  1: { name: "string", floor: "B1층" },
  2: { name: "하루카페", floor: "B1층" },
  3: { name: "모두의 카페", floor: "B1층" },
  4: { name: "행복한 식당", floor: "B1층" },
  5: { name: "그린 베이커리", floor: "B1층" },
  6: { name: "함께하는 도서관", floor: "B1층" },
  7: { name: "편안한 식당", floor: "B1층" },
};

const MOCK_USER = {
  nickname: "닉네임",
  isAdmin: false,
};

// 관리자 더미 데이터
const ALL_SUBMISSIONS = [
  {
    id: 1,
    user: "@사용자 1",
    store: "빵가게",
    floor: "B1층",
    status: "approved",
    createdAt: "2026-11-03",
  },
  {
    id: 2,
    user: "@사용자 2",
    store: "빵가게",
    floor: "B1층",
    status: "approved",
    createdAt: "2026-11-02",
  },
  {
    id: 3,
    user: "@사용자 3",
    store: "빵가게",
    floor: "B1층",
    status: "approved",
    createdAt: "2026-11-01",
  },
  {
    id: 4,
    user: "@사용자 4",
    store: "빵가게",
    floor: "B1층",
    status: "approved",
    createdAt: "2026-10-30",
  },
  {
    id: 5,
    user: "@사용자 1",
    store: "빵가게",
    floor: "B1층",
    status: "pending",
    createdAt: "2026-11-03",
  },
  {
    id: 6,
    user: "@사용자 2",
    store: "빵가게",
    floor: "B1층",
    status: "pending",
    createdAt: "2026-11-02",
  },
  {
    id: 7,
    user: "@사용자 3",
    store: "빵가게",
    floor: "B1층",
    status: "pending",
    createdAt: "2026-11-01",
  },
  {
    id: 8,
    user: "@사용자 4",
    store: "빵가게",
    floor: "B1층",
    status: "pending",
    createdAt: "2026-10-30",
  },
];

const MOCK_MISSIONS = [
  { id: 1, title: "리뷰 작성하기", point: 100, done: true },
  { id: 2, title: "좋아요 5번 누르기", point: 100, done: false },
  { id: 3, title: "좋아요 5개 받기", point: 100, done: false },
  { id: 4, title: "친구에게 공유하기", point: 100, done: false },
];

const TABS = [
  { key: "approved", label: "승인완료" },
  { key: "pending", label: "승인대기" },
  { key: "rejected", label: "반려" },
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

        <button type="button" className="btn-logout" onClick={() => {}}>
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

function Timeline({ isAdmin, submissions }) {
  const [tab, setTab] = useState(isAdmin ? "pending" : "approved");
  const [sort, setSort] = useState("latest");

  const list = useMemo(() => {
    const filtered = submissions.filter((s) => s.status === tab);

    return [...filtered].sort((a, b) =>
      sort === "latest" ? b.id - a.id : a.id - b.id,
    );
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
        {list.map((item) => {
          const place = PLACE_INFO[item.place_id];

          const storeName = isAdmin
            ? item.user
            : place?.name || `장소 ${item.place_id}`;

          const floorName = isAdmin
            ? item.floor || "B1층"
            : place?.floor || "층 정보 없음";

          return (
            <li key={item.id} className="card card--submission">
              <div className="card__place-info">
                <span className="card__store">{storeName}</span>
                <span className="card__dong">{floorName}</span>
              </div>

              <span className={`status status--${item.status}`}>
                {STATUS_LABEL[item.status]}
              </span>

              {!isAdmin && item.content && (
                <p className="card__content">{item.content}</p>
              )}

              {!isAdmin && item.status === "rejected" && item.reject_reason && (
                <p className="card__content card__reject-reason">
                  반려 사유: {item.reject_reason}
                </p>
              )}
            </li>
          );
        })}

        {list.length === 0 && (
          <li className="empty">아직 제보한 내역이 없어요.</li>
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
  const user = MOCK_USER;

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSubmissions() {
      try {
        setLoading(true);
        setError("");

        const data = await getMySubmissions();

        if (!cancelled) {
          const normalized = data.map((item) => ({
            ...item,
            store: PLACE_INFO[item.place_id]?.name || `장소 ${item.place_id}`,
            floor: PLACE_INFO[item.place_id]?.floor || "층 정보 없음",
          }));

          setSubmissions(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "제보 목록 조회 실패");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSubmissions();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayedSubmissions = user.isAdmin ? ALL_SUBMISSIONS : submissions;

  return (
    <div className="mypage">
      <div className="mypage__topbar" />

      <main className="mypage__body">
        {loading && !user.isAdmin ? (
          <p className="empty">제보 목록을 불러오는 중입니다.</p>
        ) : error && !user.isAdmin ? (
          <p className="empty">{error}</p>
        ) : (
          <>
            <ProfileSection user={user} submissions={displayedSubmissions} />

            <Timeline
              isAdmin={user.isAdmin}
              submissions={displayedSubmissions}
            />

            <Missions />
          </>
        )}
      </main>

      <BottomTabBar />
    </div>
  );
}
