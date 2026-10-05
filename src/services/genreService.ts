import api from "./api";
import type { MessageResponse } from "../types/Api";
import type { Genre } from "../types/Genre";

export async function getAllGenres(): Promise<Genre[]> {
  const response = await api.get<Genre[]>("/genres");
  return response.data;
}

export async function createGenre(name: string): Promise<Genre> {
  const response = await api.post<Genre>("/genres", { name });
  return response.data;
}

export async function updateGenre(id: number, name: string): Promise<Genre> {
  const response = await api.put<Genre>(`/genres/${id}`, { name });
  return response.data;
}

export async function deleteGenre(id: number): Promise<MessageResponse> {
  const response = await api.delete<MessageResponse>(`/genres/${id}`);
  return response.data;
}
