import api from "./api";
import type { MessageResponse } from "../types/Api";
import type { Movie, MovieLink, MoviePayload } from "../types/Movie";

export interface MovieQuery {
  search?: string;
  genreId?: number | null;
}

export async function getMovies(query: MovieQuery = {}): Promise<Movie[]> {
  const response = await api.get<Movie[]>("/movies", {
    params: {
      search: query.search?.trim() || undefined,
      genreId: query.genreId ?? undefined,
    },
  });
  return response.data;
}

export async function getFeaturedMovies(): Promise<Movie[]> {
  const response = await api.get<Movie[]>("/movies/featured");
  return response.data;
}

export async function getMovieById(id: number): Promise<Movie> {
  const response = await api.get<Movie>(`/movies/${id}`);
  return response.data;
}

export async function createMovie(payload: MoviePayload): Promise<Movie> {
  const response = await api.post<Movie>("/movies", payload);
  return response.data;
}

export async function updateMovie(id: number, payload: MoviePayload): Promise<Movie> {
  const response = await api.put<Movie>(`/movies/${id}`, payload);
  return response.data;
}

export async function deleteMovie(id: number): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(`/movies/${id}`);
  return response.data;
}

export async function getMovieLinks(movieId: number): Promise<MovieLink[]> {
  const response = await api.get<MovieLink[]>(`/movies/${movieId}/links`);
  return response.data;
}
