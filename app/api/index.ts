// Re-export types
export type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  TodoResponse,
  CreateTodoRequest,
  UpdateTodoRequest,
  ProfileDto,
  UpdateProfileRequest,
  ApiError,
} from "./types";

// Re-export client utilities
export { apiClient, getToken, setToken, clearToken, ApiRequestError } from "./client";

// Re-export auth API
export { register, login, logout } from "./authApi";

// Re-export todos API
export {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  togglePin,
  toggleComplete,
  clearCompleted,
  importTodos,
  exportTodos,
} from "./todosApi";

// Re-export profile API
export { getProfile, updateProfile } from "./profileApi";
