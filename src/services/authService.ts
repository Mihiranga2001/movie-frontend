import api from "./api";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types/Auth";

export const registerUser = async (
  data: RegisterRequest
): Promise<AuthUser> => {
  const response = await api.post<AuthUser>("/auth/register", data);
  return response.data;
};

export const loginUser = async (
  data: LoginRequest
): Promise<AuthUser> => {
  const response = await api.post<AuthUser>("/auth/login", data);
  return response.data;
};