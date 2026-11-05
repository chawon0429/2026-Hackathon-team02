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
export async function summarizePlace(placeName) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/analysis/place-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ place_name: placeName }),
    }
  );

  if (!response.ok) {
    throw new Error("장소 검색에 실패했습니다.");
  }

  return response.json();
}
export async function summarizePlaceSubmissions(placeId) {
    const response = await fetch(
        `${API_BASE_URL}/api/v1/analysis/places/${placeId}/submission-summary`
    );

    if (!response.ok) {
        throw new Error("제보 요약을 불러오지 못했습니다.");
    }

    return response.json();
}