const BASE_URL = "/api/v1/submissions";

// 테스트용 사용자 ID
export const DEMO_USER_ID = 1;

// 제보 등록
export async function createSubmission(data) {
  const response = await fetch(`${BASE_URL}/?user_id=${DEMO_USER_ID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "제보 등록에 실패했습니다.");
  }

  return response.json();
}

// 내 제보 목록 조회
export async function getMySubmissions() {
  const response = await fetch(`${BASE_URL}/my?user_id=${DEMO_USER_ID}`);

  if (!response.ok) {
    throw new Error("제보 목록을 불러오지 못했습니다.");
  }

  return response.json();
}

// 제보 상세 조회
export async function getSubmission(submissionId) {
  const response = await fetch(`${BASE_URL}/${submissionId}`);

  if (!response.ok) {
    throw new Error("제보 정보를 불러오지 못했습니다.");
  }

  return response.json();
}
