import api from "./api";
import type { MessageResponse } from "../types/Api";
import type { Episode, EpisodePayload } from "../types/Episode";
import type { TvSeries, TvSeriesPayload } from "../types/TvSeries";

export interface SeriesQuery {
  search?: string;
  genreId?: number | null;
}

export async function getSeries(query: SeriesQuery = {}): Promise<TvSeries[]> {
  const response = await api.get<TvSeries[]>("/series", {
    params: {
      search: query.search?.trim() || undefined,
      genreId: query.genreId ?? undefined,
    },
  });
  return response.data;
}

export async function getFeaturedSeries(): Promise<TvSeries[]> {
  const response = await api.get<TvSeries[]>("/series/featured");
  return response.data;
}

/** Returns the series together with all of its episodes. */
export async function getSeriesById(id: number): Promise<TvSeries> {
  const response = await api.get<TvSeries>(`/series/${id}`);
  return response.data;
}

export async function createSeries(payload: TvSeriesPayload): Promise<TvSeries> {
  const response = await api.post<TvSeries>("/series", payload);
  return response.data;
}

export async function updateSeries(id: number, payload: TvSeriesPayload): Promise<TvSeries> {
  const response = await api.put<TvSeries>(`/series/${id}`, payload);
  return response.data;
}

export async function deleteSeries(id: number): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(`/series/${id}`);
  return response.data;
}

export async function getEpisodes(seriesId: number, season?: number): Promise<Episode[]> {
  const response = await api.get<Episode[]>(`/series/${seriesId}/episodes`, {
    params: { season: season ?? undefined },
  });
  return response.data;
}

export async function getEpisodeById(episodeId: number): Promise<Episode> {
  const response = await api.get<Episode>(`/episodes/${episodeId}`);
  return response.data;
}

export async function createEpisode(seriesId: number, payload: EpisodePayload): Promise<Episode> {
  const response = await api.post<Episode>(`/series/${seriesId}/episodes`, payload);
  return response.data;
}

export async function updateEpisode(episodeId: number, payload: EpisodePayload): Promise<Episode> {
  const response = await api.put<Episode>(`/episodes/${episodeId}`, payload);
  return response.data;
}

export async function deleteEpisode(episodeId: number): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(`/episodes/${episodeId}`);
  return response.data;
}
