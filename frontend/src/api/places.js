import { api } from "./client";

export const getPlaces = (params) => api("/places", { params });
export const getPlace = (id) => api(`/places/${id}`);
export const getPlaceFacts = (id) => api(`/places/${id}/facts`);