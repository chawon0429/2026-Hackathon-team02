
import { api } from "./client";

// 민주 브랜치: 제보 등록
export async function createSubmission(userId, data) {
  const response = await fetch(
    `/api/v1/submissions/?user_id=${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await response.text();

    console.error("잘못된 API 응답:", response.status, text);

    throw new Error(
      `백엔드에서 JSON이 아닌 응답을 받았습니다. (${response.status})`
    );
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      `리뷰 저장 실패 (${response.status}): ${JSON.stringify(result.detail || result)}`
    );
  }

  return result;
}

// 기존 코드: 내 제보 목록 조회
export const getMySubmissions = (userId) =>
  api("/submissions/my", {
    params: { user_id: userId },
  });

// 기존 코드: 관리자 전체 제보 조회
export const getAllSubmissions = (status) =>
  api("/admin/submissions", {
    params: status ? { status } : {},
  });

// 기존 코드: 관리자 승인 / 반려
export const reviewSubmission = (id, status, rejectReason) =>
  api(`/admin/submissions/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(
      rejectReason
        ? { status, reject_reason: rejectReason }
        : { status }
    ),
  });
