// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}

// ── Todos ─────────────────────────────────────────────────────────────────────

export interface TodoResponse {
  id: string;
  text: string;
  pinned: boolean;
  completed: boolean;
  /** Epoch milliseconds – matches React's Date.now() */
  createdAt: number;
  category: string | null;
}

export interface CreateTodoRequest {
  text: string;
  category?: string;
}

export interface UpdateTodoRequest {
  text?: string;
  pinned?: boolean;
  completed?: boolean;
  category?: string;
}

// ── Profile ───────────────────────────────────────────────────────────────────

export interface ProfileDto {
  displayName: string;
  /** ISO date string "YYYY-MM-DD" or empty string */
  birthday: string;
  bio: string;
  avatarDataUrl: string | null;
}

export interface UpdateProfileRequest {
  displayName?: string;
  /** ISO date string "YYYY-MM-DD" or empty string to clear */
  birthday?: string;
  bio?: string;
  avatarDataUrl?: string | null;
}

// ── Errors ────────────────────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}
