
import { useState } from "react";
import { summarizeReviews } from "../api/analysis";

function AISummary({ reviews = [] }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSummarize() {
        if (!reviews.length || loading) return;

        setLoading(true);
        setError("");

        try {
            const result = await summarizeReviews(reviews);
            setSummary(result.summary);
        } catch (err) {
            setError("AI 요약을 불러오지 못했습니다.");
            console.error("AI 요약 오류:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="ai-summary">
            <h2>AI 요약</h2>

            <button
                type="button"
                onClick={handleSummarize}
                disabled={loading || reviews.length === 0}
            >
                {loading ? "AI 분석 중..." : "리뷰 AI 요약"}
            </button>

            {error && <p role="alert">{error}</p>}
            {summary && <p>{summary}</p>}
            {!reviews.length && (
                <p>요약할 리뷰가 아직 없습니다.</p>
            )}
        </section>
    );
}

export default AISummary;
