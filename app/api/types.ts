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
  /** Epoch milliseconds for the reminder; null means no reminder */
  reminderAt: number | null;
}

export interface CreateTodoRequest {
  text: string;
  category?: string;
  /** Epoch milliseconds for the reminder */
  reminderAt?: number | null;
}

export interface UpdateTodoRequest {
  text?: string;
  pinned?: boolean;
  completed?: boolean;
  category?: string;
  /** Epoch milliseconds for the reminder; 0 clears it */
  reminderAt?: number | null;
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
