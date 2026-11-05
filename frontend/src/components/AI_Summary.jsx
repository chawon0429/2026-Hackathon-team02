
import { useState } from "react";
import { summarizeReviews } from "../api/analysis";
import { summarizePlaceSubmissions } from "../api/analysis";

function AISummary({ placeId }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSummarize() {
        if (!placeId || loading) return;

        setLoading(true);
        setError("");

        try {
            const result = await summarizePlaceSubmissions(placeId);
            setSummary(result.summary);
        } catch (err) {
            setError(
                "AI 요약을 불러오지 못했습니다. 서버 상태나 AI 사용량을 확인해 주세요."
            );
            console.error("제보 요약 오류:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="ai-summary">
            <h2>AI 요약</h2>

            <p>
                {summary || "승인된 사용자 제보를 바탕으로 장소 정보를 요약합니다."}
            </p>

            <button
                type="button"
                onClick={handleSummarize}
                disabled={loading || !placeId}
            >
                {loading ? "AI 분석 중..." : "제보 리뷰 AI 요약"}
            </button>

            {error && <p role="alert">{error}</p>}
        </section>
    );
}

export default AISummary;
