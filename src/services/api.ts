import axios from "axios";
import type { AxiosError } from "axios";

import type { ApiErrorBody } from "../types/Api";

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

const TOKEN_KEY = "movieweb.token";
const USER_KEY = "movieweb.user";

/** Fired when the API rejects the stored token, so AuthProvider can log out. */
export const UNAUTHORIZED_EVENT = "movieweb:unauthorized";

export const session = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  getRawUser(): string | null {
    return localStorage.getItem(USER_KEY);
  },
  save(token: string, user: unknown): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the bearer token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = session.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A rejected token means the session is over — drop it once, centrally.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401 && session.getToken()) {
      session.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);

/**
 * Pulls a human-readable message out of whatever the request threw, so pages
 * can show the backend's own wording instead of "Request failed with status
 * code 409".
 */
export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const data = error.response?.data;

    if (data?.fieldErrors) {
      const firstField = Object.values(data.fieldErrors)[0];
      if (firstField) {
        return firstField;
      }
    }
    if (data?.message) {
      return data.message;
    }
    if (error.code === "ERR_NETWORK") {
      return "Cannot reach the server. Is the backend running on " + API_BASE_URL + "?";
    }
    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default api;
