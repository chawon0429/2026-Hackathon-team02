import { useState, useEffect } from 'react';
    import './SubmissionPage.css';

import BottomTabBar from "../components/BottomTabBar";
import v from "../assets/v.svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MOCK_PLACES } from "../mocks/places";
import { createSubmission } from "../api/submission";
import './SubmissionPage.css';

// 제보 카테고리
const categories = [
    {
        title: '접근성',
        options: ['계단', '경사로', '자동문', '엘리베이터', '휠체어 가능']
    },
    {
        title: '시설',
        options: ['유아의자', '장애인석', '콘센트', '흡연구역', '주차']
    },
    {
        title: '결제 혜택',
        options: ['카드 결제', '네이버 페이', '제로 페이', '포인트 적립', '통신사 할인']
    }
];

// 제보 질문
const questions = [
    {
        key: 'method',
        label: '어떻게 이용하셨나요?',
        options: ['예약없이 이용', '예약 후 이용', '포장·배달 이용']
    },
    {
        key: 'wait',
        label: '대기 후 이용하셨나요?',
        options: ['바로 입장', '10분 이내', '30분 이내']
    },
    {
        key: 'minimum',
        label: '최소 주문이 있나요?',
        options: ['최소 주문 없음', '1인 1메뉴', '2인분 이상']
    }
];

function SubmissionPage() {
    // 상태 관리
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [answers, setAnswers] = useState({});
    const [review, setReview] = useState("");
    const [completed, setCompleted] = useState(false);

    // API 요청 상태
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // URL 파라미터
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get("placeId");

    const navigate = useNavigate();

    // 장소 정보
    const place = MOCK_PLACES.find(
        (p) => String(p.id) === placeId
    );

    const placePhoto = place?.thumb || place?.photos?.[0];

    // 완료 화면으로 이동하면 스크롤 최상단
    useEffect(() => {
        if (completed) {
            window.scrollTo(0, 0);
        }
    }, [completed]);

    // 질문 선택
    function selectAnswer(key, option) {
        setAnswers((prev) => ({
            ...prev,
            [key]: option
        }));
    }

    // 카테고리 선택 및 해제
    function toggleCategory(item) {
        setSelectedCategories((prev) => {
            if (prev.includes(item)) {
                return prev.filter((category) => category !== item);
            }

            return [...prev, item];
        });
    }

    // 제보 등록
    async function handleComplete() {
        if (isSubmitting) return;

        if (!placeId || !place) {
            setSubmitError("장소 정보가 없습니다.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        // 접근성 항목
        const accessibilityOptions = [
            "계단",
            "경사로",
            "자동문",
            "엘리베이터",
            "휠체어 가능"
        ];

        // 시설 항목
        const facilitiesOptions = [
            "유아의자",
            "장애인석",
            "콘센트",
            "흡연구역",
            "주차"
        ];

        // 백엔드 SubmissionCreate 스키마에 맞게 데이터 구성
        const submissionData = {
            place_id: Number(placeId),

            accessibility: selectedCategories.filter(
                (item) => accessibilityOptions.includes(item)
            ),

            facilities: selectedCategories.filter(
                (item) => facilitiesOptions.includes(item)
            ),

            usage_method: answers.method || null,
            waiting_time: answers.wait || null,
            min_order: answers.minimum || null,
            content: review.trim() || null
        };
        console.log("[1] 입력 원문:", review);
        console.log("[2] 전송 데이터:", JSON.stringify(submissionData));

        try {
            // 백엔드 API 호출 및 DB 저장
            const result = await createSubmission(submissionData);

            console.log("제보 등록 성공:", result);

            setCompleted(true);

        } catch (error) {
            console.error("제보 등록 실패:", error);

            setSubmitError(
                error.message || "제보 등록 중 오류가 발생했습니다."
            );

        } finally {
            setIsSubmitting(false);
        }
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

                {place && (
                    <button
                        type="button"
                        className="complete-place-card"
                        onClick={() => navigate("/places/" + place.id)}
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
                                <h2 className="complete-place-name">
                                    {place.name}
                                </h2>

                                <span className="complete-place-category">
                                    {Array.isArray(place.tags)
                                        ? place.tags.join(", ")
                                        : place.tags}
                                </span>
                            </div>
                        </div>
                    </button>
                )}

                {place && (
                    <div className="complete-review">
                        <button
                            type="button"
                            className="complete-review-button"
                            onClick={() =>
                                navigate("/places/" + place.id, {
                                    state: { openReviews: true }
                                })
                            }
                        >
                            방금 쓴 리뷰 보러가기
                        </button>
                    </div>
                )}

                <BottomTabBar />
            </div>
        );
    }

    // 제보 작성 화면
    return (
        <div className="submission-app">
            <div className="bluebar"></div>

            <div className="submission-place-name">
                <h2>{place?.name || "가게 정보 없음"}</h2>
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
                                        selectedCategories.includes(option)
                                            ? "selected"
                                            : ""
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
                                        answers[question.key] === option
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        selectAnswer(question.key, option)
                                    }
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

                <p className="review-count">
                    {review.length} / 500
                </p>
            </div>

            {/* API 오류 메시지 */}
            {submitError && (
                <p
                    className="error-message"
                    role="alert"
                    style={{
                        color: "red",
                        textAlign: "center",
                        padding: "10px 20px"
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
