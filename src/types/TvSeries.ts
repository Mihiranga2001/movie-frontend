import type { Episode } from "./Episode";
import type { Genre } from "./Genre";

export interface TvSeries {
  id: number;
  title: string;
  description: string | null;
  releaseYear: number | null;
  language: string | null;
  duration: string | null;
  seasonNo: number | null;
  episodeNo: number | null;
  rating: number | null;
  posterUrl: string | null;
  bannerUrl: string | null;
  trailerUrl: string | null;
  videoUrl: string | null;
  downloadUrl: string | null;
  type: string;
  featured: boolean;
  createdAt: string | null;
  genre: Genre | null;
  /** Empty on list endpoints, populated by GET /api/series/{id}. */
  episodes: Episode[];
}

/** Body accepted by POST/PUT /api/series. */
export interface TvSeriesPayload {
  title: string;
  description?: string | null;
  releaseYear?: number | null;
  language?: string | null;
  duration?: string | null;
  seasonNo?: number | null;
  episodeNo?: number | null;
  rating?: number | null;
  posterUrl?: string | null;
  bannerUrl?: string | null;
  trailerUrl?: string | null;
  videoUrl?: string | null;
  downloadUrl?: string | null;
  featured?: boolean;
  genreId?: number | null;
}
