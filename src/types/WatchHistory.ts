import type { Episode } from "./Episode";
import type { Movie } from "./Movie";

export interface WatchHistoryEntry {
  id: number;
  watchedAt: string;
  progressSeconds: number;
  movie: Movie | null;
  episode: Episode | null;
}

export interface WatchHistoryPayload {
  movieId?: number | null;
  episodeId?: number | null;
  progressSeconds?: number;
}
