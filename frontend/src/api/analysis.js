const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function summarizeReviews(reviews) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/analysis/review-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews }),
    }
  );

  if (!response.ok) {
    throw new Error("리뷰 요약에 실패했습니다.");
  }

  return response.json();
}