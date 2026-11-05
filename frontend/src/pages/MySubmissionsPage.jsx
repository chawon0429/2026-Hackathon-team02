import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import { getMyPoints } from "../api/points";
import { getMySubmissions, getAllSubmissions, reviewSubmission } from "../api/submissions";
import { getPlaces } from "../api/places";
import "./MySubmissionsPage.css";

/* 목업 데이터: 평소엔 API 값을 쓰고, 서버가 안 될 때만 보여줌 */
const MOCK_USER = { nickname: "닉네임", isAdmin: false }; // true로 바꾸면 관리자 화면 -> ?admin=1 뒤에 붙이기
const DEMO_USER_ID = 1; // 로그인이 없어서 데모용으로 고정한 사용자 번호

// 일반 사용자: 내가 한 제보
const MY_SUBMISSIONS = [
  { id: 1, store: "밥가게", floor: "B1층", status: "approved", createdAt: "2026-11-03" },
  { id: 2, store: "라면가게", floor: "B1층", status: "approved", createdAt: "2026-11-02" },
  { id: 3, store: "빵가게", floor: "B1층", status: "approved", createdAt: "2026-11-01" },
  { id: 4, store: "죽가게", floor: "B1층", status: "approved", createdAt: "2026-10-30" },
  { id: 5, store: "국수가게", floor: "1층", status: "pending", createdAt: "2026-11-03" },
  { id: 6, store: "분식가게", floor: "1층", status: "pending", createdAt: "2026-11-02" },
];

// 관리자: 모든 사용자의 제보
const ALL_SUBMISSIONS = [
  { id: 1, user: "@사용자 1", store: "빵가게", status: "approved", createdAt: "2026-11-03" },
  { id: 2, user: "@사용자 2", store: "빵가게", status: "approved", createdAt: "2026-11-02" },
  { id: 3, user: "@사용자 3", store: "빵가게", status: "approved", createdAt: "2026-11-01" },
  { id: 4, user: "@사용자 4", store: "빵가게", status: "approved", createdAt: "2026-10-30" },
  { id: 5, user: "@사용자 1", store: "빵가게", status: "pending", createdAt: "2026-11-03" },
  { id: 6, user: "@사용자 2", store: "빵가게", status: "pending", createdAt: "2026-11-02" },
  { id: 7, user: "@사용자 3", store: "빵가게", status: "pending", createdAt: "2026-11-01" },
  { id: 8, user: "@사용자 4", store: "빵가게", status: "pending", createdAt: "2026-10-30" },
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
const STATUS_LABEL = { approved: "승인 완료", pending: "승인 대기", rejected: "반려" };

// 관리자 승인/반려 버튼 모양
const BTN = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  border: "1.5px solid #0057e7",
};
const BTN_APPROVE = { ...BTN, background: "#0057e7", color: "#fff" };
const BTN_REJECT = { ...BTN, background: "#fff", color: "#0057e7" };
// 반려 배지 모양
const REJECTED_BADGE = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 800,
  background: "#fff",
  color: "#c62828",
  border: "1.5px solid #c62828",
};

// 백엔드 제보를 화면에서 쓰는 모양으로 바꿈
// 제보에는 장소 이름이 없고 place_id만 있어서, 장소 목록에서 이름을 찾아 붙임
// (층 정보는 API에 없어서 장소 분류(category)를 대신 보여줌)
const toItem = (s, placeMap) => {
  const place = placeMap[s.place_id];
  return {
    id: s.id,
    user: `@사용자 ${s.user_id}`,
    store: place?.name ?? `장소 ${s.place_id}`,
    floor: place?.category ?? "",
    // approved, pending 외의 값(반려 등)은 모두 "반려" 탭으로 보냄
    status: ["approved", "pending"].includes(String(s.status ?? "").toLowerCase())
      ? String(s.status).toLowerCase()
      : "rejected",
    createdAt: String(s.created_at ?? "").slice(0, 10),
  };
};

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ProfileSection({ user, submissions }) {
  const stats = [
    // 반려는 숫자에 넣지 않고 "반려" 탭에서만 보여줌 (승인 완료 + 승인 대기 = 전체)
    { label: "전체 제보", count: submissions.filter((s) => s.status === "approved" || s.status === "pending").length },
    { label: "승인 완료", count: submissions.filter((s) => s.status === "approved").length },
    { label: "승인 대기", count: submissions.filter((s) => s.status === "pending").length },
  ];

  return (
    <section className="profile">
      <div className="profile__row">
        <div className="profile__avatar" aria-hidden="true" />
        <h1 className="profile__name">{user.nickname}</h1>
        {user.isAdmin && <span className="badge-admin">관리자</span>}
        <button type="button" className="btn-logout"
                onClick={() => {}}>
          로그아웃
        </button>
      </div>
      <div className="stats">
        {stats.map((s) => (
          <button type="button" key={s.label} className="stat">
            <b>{s.label}</b> <span>{s.count}건</span> <Chevron />
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
      <button type="button" className="section__more" onClick={onMore} aria-label={`${title} 더보기`}>
        <Chevron />
      </button>
    </div>
  );
}

function Timeline({ isAdmin, submissions, loading, onReview, busyId }) {
  // 관리자는 승인대기 탭이 기본 선택
  const [tab, setTab] = useState(isAdmin ? "pending" : "approved");
  const [sort, setSort] = useState("latest");

  const list = useMemo(() => {
    const filtered = submissions.filter((s) => s.status === tab);
    // API 응답에 제보 날짜가 없어서, 날짜가 같거나 비어 있으면 번호(id)로 비교함 (번호가 클수록 최근)
    const newer = (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id;
    return [...filtered].sort((a, b) => (sort === "latest" ? newer(a, b) : newer(b, a)));
  }, [submissions, tab, sort]);

  return (
    <section className="section">
      <SectionHeader title={isAdmin ? "관리자 승인" : "내 타임라인"}
                     onMore={() => {}} />

      <div className="filters">
        <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="정렬">
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
        <span className="filters__divider" />
        <div role="tablist" className="tabs">
          {TABS.map((t) => (
            <button key={t.key} type="button" role="tab" aria-selected={tab === t.key}
                    className={`tab${tab === t.key ? " is-active" : ""}`}
                    onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="cards">
        {list.map((item) => (
          <li key={item.id} className="card">
            {isAdmin ? (
              <>
                <span className="card__store">{item.user}</span>
                <span className="card__dong">{item.store}</span>
              </>
            ) : (
              <>
                <span className="card__store">{item.store}</span>
                <span className="card__dong">{item.floor}</span>
              </>
            )}
            {isAdmin && item.status === "pending" ? (
              <span style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                <button type="button" style={BTN_APPROVE} disabled={busyId === item.id}
                        onClick={() => onReview(item.id, "approved")}>승인</button>
                <button type="button" style={BTN_REJECT} disabled={busyId === item.id}
                        onClick={() => onReview(item.id, "rejected")}>반려</button>
              </span>
            ) : (
              <span className={`status status--${item.status}`}
                    style={item.status === "rejected" ? REJECTED_BADGE : undefined}>{STATUS_LABEL[item.status]}</span>
            )}
          </li>
        ))}
        {loading && <li className="empty">불러오는 중이에요...</li>}
        {!loading && list.length === 0 && <li className="empty">아직 제보한 내역이 없어요.</li>}
      </ul>
    </section>
  );
}

function Missions({ points }) {
  return (
    <section className="section">
      <SectionHeader title="포인트 미션" onMore={() => {}} />
      {points !== null && (
        <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 800, color: "#0057e7" }}>
          내 포인트 {points}P
        </p>
      )}
      <ul className="cards">
        {MOCK_MISSIONS.map((m, i) => (
          <li key={m.id} className={`card card--mission${m.done ? " is-done" : ""}`}>
            <div className="mission__row">
              <span className="mission__title">{i + 1}. {m.title}</span>
              <span className="mission__point">{m.point}P</span>
            </div>
            <span className={`check${m.done ? " is-done" : ""}`} role="img"
                  aria-label={m.done ? "완료" : "미완료"}>
              {m.done && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff"
                     strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
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

/*  페이지  */
export default function MySubmissionsPage() {
  // 시연용: 주소 끝에 ?admin=1 을 붙이면 관리자 화면 (예: /mypage?admin=1)
  const [searchParams] = useSearchParams();
  const user = { ...MOCK_USER, isAdmin: searchParams.get("admin") === "1" };
  const [submissions, setSubmissions] = useState([]); // 응답이 오기 전에는 비워둠
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0); // 승인·반려가 끝나면 목록을 다시 불러옴
  const [busyId, setBusyId] = useState(null);

  const onReview = async (id, status) => {
    let reason;
    if (status === "rejected") {
      reason = window.prompt("반려 사유를 입력해 주세요", "정보가 정확하지 않아요");
      if (reason === null) return; // 취소하면 아무것도 안 함
    }
    setBusyId(id);
    try {
      await reviewSubmission(id, status, reason);
      setReloadKey((k) => k + 1);
    } catch {
      window.alert("처리하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    let alive = true;
    Promise.all([
      user.isAdmin ? getAllSubmissions() : getMySubmissions(DEMO_USER_ID),
      getPlaces().catch(() => []), // 장소 이름을 붙이기 위해 같이 가져옴
    ])
      .then(([list, places]) => {
        if (!alive) return;
        const placeMap = Object.fromEntries((Array.isArray(places) ? places : []).map((p) => [p.id, p]));
        setSubmissions((Array.isArray(list) ? list : []).map((s) => toItem(s, placeMap)));
      })
      .catch(() => {
        if (alive) setSubmissions(user.isAdmin ? ALL_SUBMISSIONS : MY_SUBMISSIONS); // 서버가 안 되면 목업
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user.isAdmin, reloadKey]);

  // 내 포인트 합계 (실패하면 숨김)
  const [points, setPoints] = useState(null);
  useEffect(() => {
    let alive = true;
    getMyPoints(DEMO_USER_ID)
      .then((r) => alive && setPoints(r?.points ?? 0))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [reloadKey]);

  return (
    <div className="mypage">
      <div className="mypage__topbar" />
      <main className="mypage__body">
        <ProfileSection user={user} submissions={submissions} />
        <Timeline key={user.isAdmin ? "admin" : "user"} isAdmin={user.isAdmin} submissions={submissions} loading={loading}
                  onReview={onReview} busyId={busyId} />
        {!user.isAdmin && <Missions points={points} />}
      </main>
      <BottomTabBar />
    </div>
  );
}