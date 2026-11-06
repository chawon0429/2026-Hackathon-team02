import { api } from "./client";

// 내 포인트 합계: { user_id, points }  (로그인이 없어서 user_id를 쿼리로 보냄)
export const getMyPoints = (userId) => api("/users/me/points", { params: { user_id: userId } });

// 포인트 적립 내역: [{ id, user_id, submission_id, amount, description, created_at }]
export const getMyPointTransactions = (userId) =>
  api("/users/me/point-transactions", { params: { user_id: userId } });