export interface Episode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string | null;
  duration: string | null;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  downloadUrl: string | null;
  seriesId: number | null;
  seriesTitle: string | null;
}

/** Body accepted by POST /api/series/{id}/episodes and PUT /api/episodes/{id}. */
export interface EpisodePayload {
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description?: string | null;
  duration?: string | null;
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  downloadUrl?: string | null;
}
