const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function summarizeReviews(reviews) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/analysis/review-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews }),
    },
  );

  if (!response.ok) {
    throw new Error("리뷰 요약에 실패했습니다.");
  }

  return response.json();
}

// 현재 백엔드에 장소 요약 API가 확인되지 않아 임시 처리
export async function summarizePlace(placeName) {
  if (!placeName || !placeName.trim()) {
    throw new Error("장소 이름을 입력해 주세요.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analysis/place-summary`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        place_name: placeName.trim(),
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || "AI 장소 요약에 실패했습니다.",
    );
  }

  return response.json();
}


export async function classifyPlaceSummary(summary) {
  if (!summary || !summary.trim()) {
    throw new Error("분류할 장소 요약이 없습니다.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/analysis/report-classification`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report_text: summary.trim(),
      }),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || "AI 장소 정보 분류에 실패했습니다.",
    );
  }

  return response.json();
}


export async function summarizePlaceSubmissions(placeId) {
  if (!placeId) {
    throw new Error("장소 ID가 없습니다.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/v1/admin/submissions?status=approved`
  );

  if (!response.ok) {
    throw new Error("승인된 리뷰 조회 실패");
  }

  const submissions = await response.json();

  const reviews = submissions
    .filter(
      (submission) =>
        String(submission.place_id) === String(placeId) &&
        submission.status === "approved" &&
        submission.content
    )
    .map((submission) => submission.content);

  if (reviews.length === 0) {
    throw new Error("AI 요약할 승인된 리뷰가 없습니다.");
  }

  const result = await summarizeReviews(reviews);

  return {
    ...result,
    summary: result.summary ?? result,
  };
}
