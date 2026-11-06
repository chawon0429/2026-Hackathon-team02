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
            throw new Error(
                `정보를 불러오는 중 문제가 발생했어요. 다시 시도해 주세요. (${response.status})`
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`API 오류 (${response.status}): ${JSON.stringify(data.detail || data)}`);
        }

        return data;
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("정보를 불러오지 못했어요. 다시 시도해 주세요.");
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

export async function getPlaceFacts(placeId) {
    return requestJson(`/api/v1/places/${placeId}/facts`);
}