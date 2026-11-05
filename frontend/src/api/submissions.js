import { api } from "./client";

// 로그인이 없어서 user_id를 쿼리로 보냄 (데모용 고정 사용자)
export const getMySubmissions = (userId) => api("/submissions/my", { params: { user_id: userId } });

// 관리자: 전체 제보. status를 주면 그 상태만 가져옴
export const getAllSubmissions = (status) => api("/admin/submissions", { params: { status } });

// 관리자: 제보 승인/반려. status는 "approved" 또는 "rejected", 반려할 때만 reject_reason을 보냄
export const reviewSubmission = (id, status, rejectReason) =>
  api(`/admin/submissions/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(rejectReason ? { status, reject_reason: rejectReason } : { status }),
  });