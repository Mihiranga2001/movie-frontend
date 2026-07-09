export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  language: string;
  duration: string;
  posterUrl: string;
  bannerUrl: string;
  trailerUrl: string;
  videoUrl: string;
  downloadUrl: string;
  type: string;
  genre: Genre;
}