import { useState, useEffect } from 'react'
import './SubmissionPage.css'
import BottomTabBar from "../components/BottomTabBar";
import v from "../assets/v.svg";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MOCK_PLACES } from "../mocks/places";

const categories = [
    {title: '접근성', options: ['계단', '경사로', '자동문', '엘리베이터', '휠체어 가능']},
    {title: '시설', options: ['유아의자', '장애인석', '콘센트', '흡연구역', '주차']},
    {title: '결제 혜택', options: ['카드 결제', '네이버 페이', '제로 페이', '포인트 적립', '통신사 할인']}
];

const questions = [
  { key: 'method', label: '어떻게 이용하셨나요?', options: ['예약없이 이용', '예약 후 이용', '포장·배달 이용'] },
  { key: 'wait', label: '대기 후 이용하셨나요?', options: ['바로 입장', '10분 이내', '30분 이내'] },
  { key: 'minimum', label: '최소 주문이 있나요?', options: ['최소 주문 없음', '1인 1메뉴', '2인분 이상'] }
];

function SubmissionPage() {
    const [selectedCategories, setSelectedCategories] = useState([])
    const [answers, setAnswers] = useState({});
    const [review, setReview] = useState("");
    const [completed, setCompleted] = useState(false);
    useEffect(() => {
        if (completed) {
            window.scrollTo(0, 0);
        }
    }, [completed]);
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get("placeId");
    const navigate = useNavigate();

    const place = MOCK_PLACES.find(
        (p) => String(p.id) === placeId
    );
    const placePhoto = place?.thumb || place?.photos?.[0];

    function selectAnswer(key, option) {
        setAnswers((prev) => ({
            ...prev,
            [key]: option
        }));
    }

    function toggleCategory(item) {
        if (selectedCategories.includes(item)) {
            setSelectedCategories(
                selectedCategories.filter((category) => category !== item)
            );
        } else {
            setSelectedCategories([...selectedCategories, item]);
        }
    }

    function handleComplete() {
        const savedReviews = JSON.parse(
            localStorage.getItem("submittedReviews") || "[]"
        );
        

        const newReview = {
            id: Date.now(),
            placeId: Number(placeId),
            selectedCategories: selectedCategories,
            answers: answers,
            content: review.trim(),
            status: "pending"
        };

        localStorage.setItem(
            "submittedReviews",
            JSON.stringify([...savedReviews, newReview])
        );

        setCompleted(true);
    }

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

     return (
        <div className="submission-app">
            <div className="bluebar"></div>
            <div className="submission-place-name">
                <h2>{place?.name || "가게 정보 없음"}</h2>
            </div>
                <div className="category-scroll">
                    {categories.map((category) => (
                        <div className="category-group" key={category.title}>
                            <h3>{category.title}</h3>

                            <div className="category-options">
                                {category.options.map((option) => (
                                    <button
                                        type="button"
                                        key={option}
                                        className={`category-button ${selectedCategories.includes(option) ? "selected" : ""}`}
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

                <div className="submission-questions">
                    {questions.map((question) => (
                        <div className="question-group" key={question.key}>
                            <h2>{question.label}</h2>

                            <div className="question-options">
                                {question.options.map((option) => (
                                    <button
                                        type="button"
                                        key={option}
                                        className={`question-button ${answers[question.key] === option ? "selected" : ""}`}
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

                <div className="submission-complete">
                    <button
                        type="button"
                        className="submission-complete-button"
                        onClick={handleComplete}
                    >
                        작성 완료
                    </button>
                </div>

            <BottomTabBar />
        </div>
    )
}


export default SubmissionPage