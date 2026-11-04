// 백엔드 호출 공통 함수. 주소와 에러 처리를 여기서만 해요.
// 개발 중에는 vite 프록시가 /api 를 localhost:8000 으로 보내줘서 BASE 가 비어 있어도 돼요.
const BASE = import.meta.env.VITE_API_BASE ?? "";

export async function api(path, { params, ...options } = {}) {
  const query = params
    ? "?" + new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )
    : "";
  const res = await fetch(`${BASE}/api/v1${path}${query}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status} ${path}`);
  return res.status === 204 ? null : res.json();
}