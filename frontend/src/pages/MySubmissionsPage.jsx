import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
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

  const match = String(address).match(/(?:지하\s*\d+층|B\d+층|\d+층)/i);

  return match ? match[0].replace(/\s/g, "") : "";
}

// 배열 또는 문자열 형태의 카테고리 정리
function normalizeTags(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

// content에서 리뷰 본문과 결제 혜택 분리
function parseSubmissionContent(content) {
  if (!content) {
    return {
      review: "",
      benefits: [],
    };
  }

  const lines = String(content).split("\n");
  const reviewLines = [];
  const benefits = [];

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("결제 혜택:")) {
      const benefitText = trimmed.replace("결제 혜택:", "").trim();

      benefits.push(
        ...benefitText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      );
    } else if (trimmed) {
      reviewLines.push(line);
    }
  });

  return {
    review: reviewLines.join("\n").trim(),
    benefits,
  };
}

// 장소 API 응답 형식 통일
function normalizePlaceList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.places)) return data.places;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  return [];
}

function CheckedCircleIcon() {
  return (
    <div className="mission-check-circle is-done">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
}

function UncheckedCircleIcon() {
  return <div className="mission-check-circle is-undone" />;
}

// 프로필
function ProfileSection({ user = {}, submissions = [] }) {
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];

  const approvedCount = safeSubmissions.filter(
    (s) => s && s.status === "approved",
  ).length;

  const pendingCount = safeSubmissions.filter(
    (s) => s && s.status === "pending",
  ).length;

  const rejectedCount = safeSubmissions.filter(
    (s) => s && s.status === "rejected",
  ).length;

  // 전체 제보 수는 반려 제외
  const totalCount = approvedCount + pendingCount;

  const stats = [
    { label: "전체 제보", count: totalCount },
    { label: "승인 완료", count: approvedCount },
    { label: "승인 대기", count: pendingCount },
    { label: "반려", count: rejectedCount },
  ];

  return (
    <section className="profile">
      <div className="profile__row">
        <div className="profile__avatar" aria-hidden="true" />

        <div className="profile__user-info">
          <h1 className="profile__name">{user?.nickname || "테스트사용자1"}</h1>

          {user?.isAdmin && <span className="badge-admin">관리자</span>}
        </div>

        <button type="button" className="btn-logout" onClick={() => {}}>
          로그아웃
        </button>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <span>{s.label}</span>
            <b>{s.count}건</b>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="section__head">
      <h2>{title}</h2>
    </div>
  );
}

// 제보 카테고리 표시
function SubmissionTags({ accessibility, facilities, benefits }) {
  const accessTags = normalizeTags(accessibility);
  const facilityTags = normalizeTags(facilities);
  const benefitTags = normalizeTags(benefits);

  if (
    accessTags.length === 0 &&
    facilityTags.length === 0 &&
    benefitTags.length === 0
  ) {
    return null;
  }

  return (
    <div className="submission-tags">
      {accessTags.length > 0 && (
        <div className="submission-tag-group">
          <span className="submission-tag-label">접근성</span>

          <div className="submission-tag-list">
            {accessTags.map((tag, index) => (
              <span
                className="submission-tag submission-tag--access"
                key={`access-${index}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {facilityTags.length > 0 && (
        <div className="submission-tag-group">
          <span className="submission-tag-label">시설</span>

          <div className="submission-tag-list">
            {facilityTags.map((tag, index) => (
              <span
                className="submission-tag submission-tag--facility"
                key={`facility-${index}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {benefitTags.length > 0 && (
        <div className="submission-tag-group">
          <span className="submission-tag-label">결제 혜택</span>

          <div className="submission-tag-list">
            {benefitTags.map((tag, index) => (
              <span
                className="submission-tag submission-tag--benefit"
                key={`benefit-${index}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// 내 타임라인
function Timeline({
  isAdmin,
  submissions = [],
  places = {},
  loading,
  error,
  tab,
  setTab,
  onReview,
  busyId,
}) {
  const [sort, setSort] = useState("latest");

  const list = useMemo(() => {
    const safeList = Array.isArray(submissions) ? submissions : [];

    const filtered =
      tab === "all" ? safeList : safeList.filter((s) => s && s.status === tab);

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a?.created_at || a?.createdAt || 0).getTime();

      const dateB = new Date(b?.created_at || b?.createdAt || 0).getTime();

      if (dateA !== dateB) {
        return sort === "latest" ? dateB - dateA : dateA - dateB;
      }

      return sort === "latest"
        ? (b?.id || 0) - (a?.id || 0)
        : (a?.id || 0) - (b?.id || 0);
    });
  }, [submissions, tab, sort]);

  return (
    <section className="section">
      <SectionHeader title={isAdmin ? "관리자 승인" : "내 타임라인"} />

      <div className="filters-row">
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="정렬"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>

        <span className="filters-divider" />

        <div role="tablist" className="pill-tabs-list">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`pill-tab-item ${tab === t.key ? "is-active" : ""}`}
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
              if (!item) return null;

              const placeId = Number(item.place_id);
              const place = places?.[placeId] || null;

              const storeName =
                place?.name || item.place_name || `장소 ${item.place_id || ""}`;

              const floor =
                getFloor(place?.address) || item.floor || place?.category || "";

              // 리뷰와 결제 혜택 분리
              const parsedContent = parseSubmissionContent(item.content);

              const userComment =
                parsedContent.review ||
                item.comment ||
                item.description ||
                item.text ||
                item.details ||
                item.review ||
                "";

              const benefits = [
                ...parsedContent.benefits,
                ...normalizeTags(item.benefits),
              ];

              return (
                <li key={item.id} className="card card--submission">
                  <div className="card__header-row">
                    <div className="card__place-info">
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

                          {floor && <span className="card__dong">{floor}</span>}
                        </>
                      )}
                    </div>

                    {isAdmin && item.status === "pending" ? (
                      <div className="admin-btn-group">
                        <button
                          type="button"
                          className="btn-approve"
                          disabled={busyId === item.id}
                          onClick={() =>
                            onReview && onReview(item.id, "approved")
                          }
                        >
                          승인
                        </button>

                        <button
                          type="button"
                          className="btn-reject"
                          disabled={busyId === item.id}
                          onClick={() =>
                            onReview && onReview(item.id, "rejected")
                          }
                        >
                          반려
                        </button>
                      </div>
                    ) : (
                      <span className={`status status--${item.status}`}>
                        {STATUS_LABEL[item.status] || item.status}
                      </span>
                    )}
                  </div>

                  {/* 일반 텍스트 리뷰 */}
                  {userComment && (
                    <div className="submission-review-content">
                      <span className="submission-review-label">
                        작성한 리뷰
                      </span>

                      <p className="card__inline-comment">{userComment}</p>
                    </div>
                  )}

                  {/* 접근성 / 시설 / 결제 혜택 태그 */}
                  <SubmissionTags
                    accessibility={item.accessibility}
                    facilities={item.facilities}
                    benefits={benefits}
                  />

                  {/* 반려 사유 */}
                  {item.status === "rejected" && (
                    <p className="card__inline-reject-reason">
                      반려 사유:{" "}
                      {item.reject_reason ||
                        item.reason ||
                        "정보 미흡으로 반려되었습니다."}
                    </p>
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
      <SectionHeader title="포인트 미션" />

      {points !== null && points !== undefined && (
        <p className="my-points-badge">내 포인트 {points}P</p>
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

            {m.done ? <CheckedCircleIcon /> : <UncheckedCircleIcon />}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MySubmissionsPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isAdmin = searchParams.get("admin") === "1";
  const initialTab = location.state?.tab || "all";

  const [user, setUser] = useState({
    id: DEMO_USER_ID,
    nickname: "테스트사용자1",
    isAdmin,
  });

  const [submissions, setSubmissions] = useState([]);
  const [places, setPlaces] = useState({});
  const [tab, setTab] = useState(isAdmin ? "pending" : initialTab);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [points, setPoints] = useState(100);

  useEffect(() => {
    setUser((prev) => ({
      ...prev,
      isAdmin,
    }));
  }, [isAdmin]);

  // 사용자 정보 조회
  useEffect(() => {
    if (isAdmin) return;

    let alive = true;

    getUser(DEMO_USER_ID)
      .then((userData) => {
        if (!alive || !userData) return;

        setUser({
          id: userData.id || DEMO_USER_ID,
          nickname: userData.nickname || "테스트사용자1",
          isAdmin: false,
        });
      })
      .catch((err) => {
        console.warn("사용자 정보 조회 실패 (fallback):", err);
      })
      .finally(() => {
        if (alive) setUserLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isAdmin]);

  // 제보 및 장소 데이터 조회
  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        let submissionList = [];

        if (isAdmin) {
          const res = await fetch(`${API_BASE}/admin/submissions`);

          if (!res.ok) {
            throw new Error("관리자 제보 조회 실패");
          }

          const submissionResult = await res.json();

          submissionList = Array.isArray(submissionResult)
            ? submissionResult
            : submissionResult?.items ||
              submissionResult?.submissions ||
              submissionResult?.data ||
              [];
        } else {
          const submissionResult = await getMySubmissions();

          submissionList = Array.isArray(submissionResult)
            ? submissionResult
            : submissionResult?.items ||
              submissionResult?.submissions ||
              submissionResult?.data ||
              [];
        }

        // 장소 목록 조회 및 ID별 매핑
        let placeMap = {};

        try {
          const placesResponse = await fetch(`${API_BASE}/places`);

          if (placesResponse.ok) {
            const placesData = await placesResponse.json();
            const placeList = normalizePlaceList(placesData);

            placeList.forEach((place) => {
              if (place?.id != null) {
                placeMap[Number(place.id)] = place;
              }
            });
          } else {
            console.warn("장소 목록 조회 실패:", placesResponse.status);
          }
        } catch (e) {
          console.warn("장소 목록 조회 실패:", e);
        }

        const normalized = (
          Array.isArray(submissionList) ? submissionList : []
        ).map((item) => ({
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
          setError("데이터를 불러오지 못했습니다.");
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
        if (alive) {
          setPoints(result?.points ?? 100);
        }
      })
      .catch(() => {
        if (alive) setPoints(0);
      });

    return () => {
      alive = false;
    };
  }, [isAdmin, reloadKey]);

  // 관리자 승인 / 반려
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
      <header className="mypage__header">
        <h1 className="mypage__title">내 활동</h1>
      </header>

      <main className="mypage__body">
        {userLoading ? (
          <section className="profile">
            <h1 className="profile__name">사용자 정보를 불러오는 중입니다.</h1>
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
