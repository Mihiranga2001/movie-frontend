import api from "./api";
import type { MessageResponse } from "../types/Api";
import type { WatchHistoryEntry, WatchHistoryPayload } from "../types/WatchHistory";

export async function getWatchHistory(): Promise<WatchHistoryEntry[]> {
  const response = await api.get<WatchHistoryEntry[]>("/watch-history");
  return response.data;
}

export async function recordWatch(payload: WatchHistoryPayload): Promise<WatchHistoryEntry> {
  const response = await api.post<WatchHistoryEntry>("/watch-history", payload);
  return response.data;
}

export async function clearWatchHistory(): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>("/watch-history");
  return response.data;
}
