import { createContext } from "react";

import type { AuthUser, LoginRequest, RegisterRequest } from "../types/Auth";

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  /** True until the stored session has been checked on first load. */
  initialising: boolean;
  login: (credentials: LoginRequest) => Promise<AuthUser>;
  register: (details: RegisterRequest) => Promise<AuthUser>;
  logout: () => void;
}

/**
 * Kept in its own module (no components) so Vite's fast refresh stays happy.
 */
export const AuthContext = createContext<AuthContextValue | null>(null);
