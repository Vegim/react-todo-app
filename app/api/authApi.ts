import { apiClient, setToken, clearToken } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

/**
 * Register a new user account. Stores the returned JWT automatically.
 */
export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/register", payload, false);
  setToken(response.token);
  return response;
}

/**
 * Log in with existing credentials. Stores the returned JWT automatically.
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/api/auth/login", payload, false);
  setToken(response.token);
  return response;
}

/**
 * Log out by clearing the stored JWT from localStorage.
 */
export function logout(): void {
  clearToken();
}
