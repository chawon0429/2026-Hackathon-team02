import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BottomTabBar from "../components/BottomTabBar";
import { getMySubmissions } from "../api/submission";
import { getUser } from "../api/user";
import { getMyPoints } from "../api/points";
import "./MySubmissionsPage.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const DEMO_USER_ID = 1;

const MOCK_MISSIONS = [
  { id: 1, title: "리뷰 작성하기", point: 100, done: true },
  { id: 2, title: "좋아요 5번 누르기", point: 100, done: false },
  { id: 3, title: "좋아요 5개 받기", point: 100, done: false },
  { id: 4, title: "친구에게 공유하기", point: 100, done: false },
];

const TABS = [
  { key: "all", label: "전체" },
  { key: "approved", label: "승인완료" },
  { key: "pending", label: "승인대기" },
  { key: "rejected", label: "반려" },
];

const STATUS_LABEL = {
  approved: "승인 완료",
  pending: "승인 대기",
  rejected: "반려",
};

const BTN = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 800,
  cursor: "pointer",
  border: "1.5px solid #0057e7",
};

const BTN_APPROVE = {
  ...BTN,
  background: "#0057e7",
  color: "#fff",
};

const BTN_REJECT = {
  ...BTN,
  background: "#fff",
  color: "#0057e7",
};

const REJECTED_BADGE = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: 800,
  background: "#fff",
  color: "#c62828",
  border: "1.5px solid #c62828",
};

function normalizeStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (["approved", "승인완료", "승인 완료"].includes(value)) {
    return "approved";
  }

  if (["pending", "승인대기", "승인 대기"].includes(value)) {
    return "pending";
  }

  if (["rejected", "반려"].includes(value)) {
    return "rejected";
  }

  return value;
}

function getFloor(address) {
  if (!address) return "";

  const match = String(address).match(/(?:지하\s*\d+층|B\d+층|\d+층)/);

  return match ? match[0].replace(/\s/g, "") : "";
}

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

function ProfileSection({ user, submissions, onSelectTab }) {
  const approvedCount = submissions.filter(
    (s) => s.status === "approved",
  ).length;

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  const stats = [
    {
      label: "전체 제보",
      count: approvedCount + pendingCount,
      tab: "all",
    },
    {
      label: "승인 완료",
      count: approvedCount,
      tab: "approved",
    },
    {
      label: "승인 대기",
      count: pendingCount,
      tab: "pending",
    },
  ];

  return (
    <section className="profile">
      <div className="profile__row">
        <div className="profile__avatar" aria-hidden="true" />

        <h1 className="profile__name">{user.nickname || "사용자"}</h1>

        {user.isAdmin && <span className="badge-admin">관리자</span>}

        <button type="button" className="btn-logout" onClick={() => {}}>
          로그아웃
        </button>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <button
            type="button"
            key={s.label}
            className="stat"
            onClick={() => onSelectTab(s.tab)}
          >
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

function Timeline({
  isAdmin,
  submissions,
  places,
  loading,
  error,
  tab,
  setTab,
  onReview,
  busyId,
}) {
  const [sort, setSort] = useState("latest");

  const list = useMemo(() => {
    const filtered =
      tab === "all" ? submissions : submissions.filter((s) => s.status === tab);

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0).getTime();

      const dateB = new Date(b.created_at || b.createdAt || 0).getTime();

      if (dateA !== dateB) {
        return sort === "latest" ? dateB - dateA : dateA - dateB;
      }

      return sort === "latest" ? b.id - a.id : a.id - b.id;
    });
  }, [submissions, tab, sort]);

  return (
    <section className="section">
      <SectionHeader
        title={isAdmin ? "관리자 승인" : "내 타임라인"}
        onMore={() => setTab("all")}
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

              const floor =
                getFloor(place?.address) || item.floor || place?.category || "";

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

                  {isAdmin && item.status === "pending" ? (
                    <span
                      style={{
                        display: "flex",
                        gap: 6,
                        marginLeft: "auto",
                      }}
                    >
                      <button
                        type="button"
                        style={BTN_APPROVE}
                        disabled={busyId === item.id}
                        onClick={() => onReview(item.id, "approved")}
                      >
                        승인
                      </button>

                      <button
                        type="button"
                        style={BTN_REJECT}
                        disabled={busyId === item.id}
                        onClick={() => onReview(item.id, "rejected")}
                      >
                        반려
                      </button>
                    </span>
                  ) : (
                    <span
                      className={`status status--${item.status}`}
                      style={
                        item.status === "rejected" ? REJECTED_BADGE : undefined
                      }
                    >
                      {STATUS_LABEL[item.status] || item.status}
                    </span>
                  )}
                </li>
              );
            })}

            {list.length === 0 && (
              <li className="empty">
                {tab === "all"
                  ? "아직 제보한 내역이 없어요."
                  : "해당 상태의 제보가 없어요."}
              </li>
            )}
          </>
        )}
      </ul>
    </section>
  );
}

function Missions({ points }) {
  return (
    <section className="section">
      <SectionHeader title="포인트 미션" onMore={() => {}} />

      {points !== null && (
        <p
          style={{
            margin: "0 0 10px",
            fontSize: 16,
            fontWeight: 800,
            color: "#0057e7",
          }}
        >
          내 포인트 {points}P
        </p>
      )}

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
  const [searchParams] = useSearchParams();

  const isAdmin = searchParams.get("admin") === "1";

  const [user, setUser] = useState({
    id: DEMO_USER_ID,
    nickname: "",
    isAdmin,
  });

  const [submissions, setSubmissions] = useState([]);
  const [places, setPlaces] = useState({});
  const [tab, setTab] = useState(isAdmin ? "pending" : "approved");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLoading, setUserLoading] = useState(!isAdmin);
  const [userError, setUserError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [points, setPoints] = useState(null);

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      isAdmin,
    }));
  }, [isAdmin]);

  // 사용자 정보 조회
  useEffect(() => {
    if (isAdmin) {
      setUserLoading(false);
      return;
    }

    let alive = true;

    getUser(DEMO_USER_ID)
      .then((userData) => {
        if (!alive) return;

        setUser({
          id: userData.id,
          nickname: userData.nickname,
          isAdmin: false,
        });
      })
      .catch((err) => {
        if (!alive) return;

        setUserError(err.message || "사용자 정보를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (alive) setUserLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isAdmin]);

  // 제보 및 장소 조회
  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const submissionResult = isAdmin
          ? await fetch(`${API_BASE}/admin/submissions`)
          : await getMySubmissions();

        let submissionList;

        if (isAdmin) {
          if (!submissionResult.ok) {
            throw new Error("관리자 제보 조회에 실패했습니다.");
          }

          submissionList = await submissionResult.json();
        } else {
          submissionList = Array.isArray(submissionResult)
            ? submissionResult
            : submissionResult?.items || [];
        }

        const placesResponse = await fetch(`${API_BASE}/places`);

        const placesData = placesResponse.ok ? await placesResponse.json() : [];

        const placeMap = {};

        (Array.isArray(placesData) ? placesData : []).forEach((place) => {
          placeMap[place.id] = place;
        });

        const normalized = submissionList.map((item) => ({
          ...item,
          place_id: Number(item.place_id),
          status: normalizeStatus(item.status),
        }));

        if (alive) {
          setSubmissions(normalized);
          setPlaces(placeMap);
        }
      } catch (err) {
        console.error("내 페이지 데이터 조회 실패:", err);

        if (alive) {
          setError(err.message || "데이터를 불러오지 못했습니다.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [isAdmin, reloadKey]);

  // 포인트 조회
  useEffect(() => {
    if (isAdmin) return;

    let alive = true;

    getMyPoints(DEMO_USER_ID)
      .then((result) => {
        if (alive) setPoints(result?.points ?? 0);
      })
      .catch(() => {});

    return () => {
      alive = false;
    };
  }, [isAdmin, reloadKey]);

  // 관리자 승인/반려
  const onReview = async (id, status) => {
    let rejectReason;

    if (status === "rejected") {
      rejectReason = window.prompt(
        "반려 사유를 입력해 주세요",
        "정보가 정확하지 않아요",
      );

      if (rejectReason === null) return;
    }

    setBusyId(id);

    try {
      const response = await fetch(
        `${API_BASE}/admin/submissions/${id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            reject_reason: rejectReason,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("승인/반려 처리 실패");
      }

      setReloadKey((key) => key + 1);
    } catch (err) {
      console.error("제보 심사 실패:", err);
      window.alert("처리하지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusyId(null);
    }
  };

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
          <ProfileSection
            user={user}
            submissions={submissions}
            onSelectTab={setTab}
          />
        )}

        <Timeline
          isAdmin={user.isAdmin}
          submissions={submissions}
          places={places}
          loading={loading}
          error={error}
          tab={tab}
          setTab={setTab}
          onReview={onReview}
          busyId={busyId}
        />

        {!user.isAdmin && <Missions points={points} />}
      </main>

      <BottomTabBar />
    </div>
  );
}
