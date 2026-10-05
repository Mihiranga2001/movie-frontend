import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./auth-context";
import type { AuthContextValue } from "./auth-context";
import { fetchCurrentUser, loginUser, registerUser } from "../services/authService";
import { session, UNAUTHORIZED_EVENT } from "../services/api";
import type { AuthUser, LoginRequest, RegisterRequest } from "../types/Auth";

function readStoredUser(): AuthUser | null {
  const raw = session.getRawUser();
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    // Corrupted entry — drop it rather than crashing the whole app.
    session.clear();
    return null;
  }
}

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [initialising, setInitialising] = useState(true);

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
  }, []);

  // Revalidate a stored token once on start-up: it may have expired while the
  // tab was closed, and the old code trusted localStorage blindly.
  useEffect(() => {
    let cancelled = false;

    if (!session.getToken()) {
      setInitialising(false);
      return;
    }

    fetchCurrentUser()
      .then((fresh) => {
        if (!cancelled) {
          setUser(fresh);
          session.save(session.getToken() ?? "", fresh);
        }
      })
      .catch(() => {
        if (!cancelled) {
          session.clear();
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setInitialising(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The axios interceptor raises this when the API rejects the token.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const result = await loginUser(credentials);
    session.save(result.token, result.user);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(async (details: RegisterRequest) => {
    const result = await registerUser(details);
    session.save(result.token, result.user);
    setUser(result.user);
    return result.user;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isAdmin: user?.role === "ADMIN",
      initialising,
      login,
      register,
      logout,
    }),
    [user, initialising, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
