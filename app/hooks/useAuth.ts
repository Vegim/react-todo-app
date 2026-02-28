import { useState, useEffect, useCallback } from "react";

const AUTH_KEY = "auth-user";

export const DEMO_CREDENTIALS = { username: "john", password: "secret" } as const;

export function useAuth() {
  const [user, setUser] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    setUser(stored);
    setHydrated(true);
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (
      username.trim() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      localStorage.setItem(AUTH_KEY, username.trim());
      setUser(username.trim());
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setUser(null);
  }, []);

  return { user, hydrated, login, logout };
}
