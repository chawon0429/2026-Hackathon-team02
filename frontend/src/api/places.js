import { api } from "./client";

// 장소 목록. params 이름은 /docs 에서 GET /places 의 Parameters 를 보고 맞추세요.
export const getPlaces = (params) => api("/places", { params });
export const getPlace = (id) => api(`/places/${id}`);