const BASE = import.meta.env.VITE_API_BASE ?? "";

// 응답이 없을 때 화면이 계속 "불러오는 중"에 머무르지 않도록, 기본 8초 뒤에 포기함
export async function api(path, { params, timeout = 8000, ...options } = {}) {
  const query = params
    ? "?" +
      new URLSearchParams(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
      )
    : "";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(`${BASE}/api/v1${path}${query}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });
    if (!res.ok) throw new Error(`API ${res.status} ${path}`);
    return res.status === 204 ? null : await res.json();
  } finally {
    clearTimeout(timer);
  }
}