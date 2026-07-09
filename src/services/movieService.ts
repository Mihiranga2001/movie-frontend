import api from "./api";
import type { Movie } from "../types/Movie";

export const getAllMovies = async (): Promise<Movie[]> => {
  const response = await api.get<Movie[]>("/movies");
  return response.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const response = await api.get<Movie>(`/movies/${id}`);
  return response.data;
};

export const addMovie = async (movie: Partial<Movie>): Promise<Movie> => {
  const response = await api.post<Movie>("/movies", movie);
  return response.data;
};

export const updateMovie = async (
  id: number,
  movie: Partial<Movie>
): Promise<Movie> => {
  const response = await api.put<Movie>(`/movies/${id}`, movie);
  return response.data;
};

export const deleteMovie = async (id: number): Promise<void> => {
  await api.delete(`/movies/${id}`);
};