import { useState, useEffect } from "react";
import "./SubmissionPage.css";

import BottomTabBar from "../components/BottomTabBar";
import v from "../assets/v.svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getPlace } from "../api/places";
import { createSubmission } from "../api/submission";

const categories = [
  {
    title: "접근성",
    options: ["계단", "경사로", "자동문", "엘리베이터", "휠체어 가능"],
  },
  {
    title: "시설",
    options: ["유아의자", "장애인석", "콘센트", "흡연구역", "주차"],
  },
  {
    title: "결제 혜택",
    options: [
      "카드 결제",
      "네이버 페이",
      "제로 페이",
      "포인트 적립",
      "통신사 할인",
    ],
  },
];

const questions = [
  {
    key: "method",
    label: "어떻게 이용하셨나요?",
    options: ["예약없이 이용", "예약 후 이용", "포장·배달 이용"],
  },
  {
    key: "wait",
    label: "대기 후 이용하셨나요?",
    options: ["바로 입장", "10분 이내", "30분 이내"],
  },
  {
    key: "minimum",
    label: "최소 주문이 있나요?",
    options: ["최소 주문 없음", "1인 1메뉴", "2인분 이상"],
  },
];

function SubmissionPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [answers, setAnswers] = useState({});
  const [review, setReview] = useState("");
  const [completed, setCompleted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [place, setPlace] = useState(null);
  const [placeLoading, setPlaceLoading] = useState(true);
  const [placeError, setPlaceError] = useState("");

  const [searchParams] = useSearchParams();
  const placeId = searchParams.get("placeId");
  const navigate = useNavigate();

  // 실제 DB 장소 조회
  useEffect(() => {
    let cancelled = false;

    async function fetchPlace() {
      if (!placeId) {
        setPlaceError("장소 ID가 없습니다.");
        setPlaceLoading(false);
        return;
      }

      setPlaceLoading(true);
      setPlaceError("");

      try {
        const data = await getPlace(placeId);

        if (!cancelled) {
          setPlace({
            ...data,
            id: data.id,
            dbId: data.id,
            name: data.name,
            tags: data.tags || data.category || "",
            thumb: data.thumb || data.image_url || null,
            photos: data.photos || [],
          });
        }
      } catch (error) {
        console.error("장소 조회 실패:", error);

        if (!cancelled) {
          setPlaceError(error.message || "장소 정보를 불러오지 못했습니다.");
          setPlace(null);
        }
      } finally {
        if (!cancelled) {
          setPlaceLoading(false);
        }
      }
    }

    fetchPlace();

    return () => {
      cancelled = true;
    };
  }, [placeId]);

  const placePhoto = place?.thumb || place?.photos?.[0];

  useEffect(() => {
    if (completed) {
      window.scrollTo(0, 0);
    }
  }, [completed]);

  function selectAnswer(key, option) {
    setAnswers((prev) => ({
      ...prev,
      [key]: option,
    }));
  }

  function toggleCategory(item) {
    setSelectedCategories((prev) =>
      prev.includes(item)
        ? prev.filter((category) => category !== item)
        : [...prev, item],
    );
  }

  // DB 제보 등록
  async function handleComplete() {
    if (isSubmitting) return;

    if (!place || !place.id) {
      setSubmitError("장소 정보를 불러오지 못했습니다.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    const accessibility = selectedCategories.filter((item) =>
      categories[0].options.includes(item),
    );

    const facilities = selectedCategories.filter((item) =>
      categories[1].options.includes(item),
    );

    const benefits = selectedCategories.filter((item) =>
      categories[2].options.includes(item),
    );

    // 결제 혜택은 백엔드 전용 필드가 없어 content에 포함
    const content = [
      review.trim(),
      benefits.length > 0 ? "결제 혜택: " + benefits.join(", ") : "",
    ]
      .filter(Boolean)
      .join("\n");

    const submissionData = {
      place_id: Number(place.id),
      accessibility,
      facilities,
      usage_method: answers.method || null,
      waiting_time: answers.wait || null,
      min_order: answers.minimum || null,
      content: content || null,
    };

    console.log("[1] DB 장소:", place.name);
    console.log("[2] DB 장소 ID:", place.id);
    console.log("[3] 제보 데이터:", submissionData);

    try {
      const result = await createSubmission(submissionData);

      console.log("제보 등록 성공:", result);
      setCompleted(true);
    } catch (error) {
      console.error("제보 등록 실패:", error);
      setSubmitError(error.message || "제보 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (placeLoading) {
    return (
      <div className="submission-app submission-loading-screen">
        <div className="bluebar"></div>

        <main className="submission-loading-main" role="status">
          <div className="submission-loading-spinner"></div>
          <p>장소 정보를 불러오는 중입니다</p>
          <span>잠시만 기다려 주세요</span>
        </main>

        <BottomTabBar />
      </div>
    );
  }

  // 장소 조회 실패
  if (placeError || !place) {
    return (
      <div className="submission-app">
        <div className="bluebar"></div>
        <p
          style={{
            color: "red",
            textAlign: "center",
            padding: "40px 20px",
          }}
        >
          {placeError || "장소 정보가 없습니다."}
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ display: "block", margin: "0 auto" }}
        >
          돌아가기
        </button>
        <BottomTabBar />
      </div>
    );
  }

  // 제보 등록 완료 화면
  if (completed) {
    return (
      <div className="submission-app complete-screen">
        <div className="bluebar"></div>

        <button
          type="button"
          className="complete-close"
          onClick={() => navigate("/")}
          aria-label="닫기"
        >
          ×
        </button>

        <div style={{ textAlign: "center", padding: "40px 20px 20px" }}>
          <div className="complete-message">
            <div className="complete-check">
              <img src={v} alt="완료 체크" />
            </div>

            <h2 className="complete-title">
              감사합니다
              <br />
              리뷰가 작성되었습니다
            </h2>

            <p className="complete-description">
              관리자가 직접 내용을 승인해야
              <br />
              포인트가 적립됩니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="complete-place-card"
          onClick={() => navigate(`/places/${place.id}`)}
        >
          <div className="complete-place-photo">
            {placePhoto ? (
              <img src={placePhoto} alt={place.name} />
            ) : (
              <span>가게 사진이 없습니다.</span>
            )}
          </div>

          <div className="complete-place-info">
            <div className="complete-place-text">
              <h2 className="complete-place-name">{place.name}</h2>
              <span className="complete-place-category">
                {Array.isArray(place.tags)
                  ? place.tags.join(", ")
                  : place.tags || place.category || "카테고리 정보 없음"}
              </span>
            </div>
          </div>
        </button>

        {/* 작성한 리뷰 확인 → 마이페이지 */}
        <div className="complete-review">
          <button
            type="button"
            className="complete-review-button"
            onClick={() =>
              navigate("/mypage", {
                state: {
                  tab: "all",
                  sort: "latest",
                },
              })
            }
          >
            방금 쓴 리뷰 보러가기
          </button>
        </div>

        <BottomTabBar />
      </div>
    );
  }

  // 제보 작성 화면
  return (
    <div className="submission-app">
      <div className="bluebar"></div>

      <div className="submission-place-name">
        <h2>{place.name}</h2>
      </div>

      {/* 카테고리 선택 */}
      <div className="category-scroll">
        {categories.map((category) => (
          <div className="category-group" key={category.title}>
            <h3>{category.title}</h3>

            <div className="category-options">
              {category.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`category-button ${
                    selectedCategories.includes(option) ? "selected" : ""
                  }`}
                  onClick={() => toggleCategory(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="category-divider"></div>

      {/* 이용 관련 질문 */}
      <div className="submission-questions">
        {questions.map((question) => (
          <div className="question-group" key={question.key}>
            <h2>{question.label}</h2>

            <div className="question-options">
              {question.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`question-button ${
                    answers[question.key] === option ? "selected" : ""
                  }`}
                  onClick={() => selectAnswer(question.key, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="category-divider"></div>

      {/* 리뷰 작성 */}
      <div className="submission-review">
        <h2>리뷰를 작성해주세요</h2>

        <textarea
          className="submission-review-input"
          placeholder="방문 경험을 자유롭게 작성해주세요."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={500}
        />

        <p className="review-count">{review.length} / 500</p>
      </div>

      {/* API 오류 메시지 */}
      {submitError && (
        <p
          className="error-message"
          role="alert"
          style={{
            color: "red",
            textAlign: "center",
            padding: "10px 20px",
          }}
        >
          {submitError}
        </p>
      )}

      {/* 제보 등록 */}
      <div className="submission-complete">
        <button
          type="button"
          className="submission-complete-button"
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "작성 완료"}
        </button>
      </div>

      <BottomTabBar />
    </div>
  );
}

export default SubmissionPage;
