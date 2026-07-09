import api from "./api";
import type { Genre } from "../types/Genre";

export const getAllGenres = async (): Promise<Genre[]> => {
  const response = await api.get<Genre[]>("/genres");
  return response.data;
};

export const addGenre = async (genre: Partial<Genre>): Promise<Genre> => {
  const response = await api.post<Genre>("/genres", genre);
  return response.data;
};