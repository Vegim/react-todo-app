import { useState, useEffect, useCallback } from "react";
import * as authApi from "~/api/authApi";
import { getToken } from "~/api/client";

const USERNAME_KEY = "auth-user";

export function useAuth() {
  const [user, setUser] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = getToken();
    const stored = localStorage.getItem(USERNAME_KEY);
    if (token && stored) {
      setUser(stored);
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    const res = await authApi.login({ username, password });
    localStorage.setItem(USERNAME_KEY, res.username);
    setUser(res.username);
  }, []);

  const register = useCallback(async (username: string, password: string): Promise<void> => {
    const res = await authApi.register({ username, password });
    localStorage.setItem(USERNAME_KEY, res.username);
    setUser(res.username);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    localStorage.removeItem(USERNAME_KEY);
    setUser(null);
  }, []);

  return { user, hydrated, login, register, logout };
}
