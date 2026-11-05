import { api } from "./client";

async function requestJson(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error(`API가 JSON이 아닌 응답을 반환했습니다. (${response.status})`);
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`API 오류 (${response.status}): ${JSON.stringify(data.detail || data)}`);
        }

        return data;
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("백엔드 응답 시간 초과. DB 연결을 확인하세요.");
        }
        throw err;
    } finally {
        clearTimeout(timer);
    }
}

export const getPlaces = (params) => api("/places", { params });

export async function getPlace(id) {
    return requestJson(`/api/v1/places/${id}`);
}

export async function getPlaceFacts(id) {
    return requestJson(`/api/v1/places/${id}/facts`);
}
