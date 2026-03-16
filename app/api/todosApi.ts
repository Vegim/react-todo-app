import { apiClient } from "./client";
import type { CreateTodoRequest, TodoResponse, UpdateTodoRequest } from "./types";

const BASE = "/api/todos";

/** Fetch all todos for the current user (pinned first, then newest first). */
export function getTodos(): Promise<TodoResponse[]> {
  return apiClient.get<TodoResponse[]>(BASE);
}

/** Create a new todo. */
export function createTodo(payload: CreateTodoRequest): Promise<TodoResponse> {
  return apiClient.post<TodoResponse>(BASE, payload);
}

/** Update text, pinned, completed and/or category of an existing todo. */
export function updateTodo(id: string, payload: UpdateTodoRequest): Promise<TodoResponse> {
  return apiClient.put<TodoResponse>(`${BASE}/${id}`, payload);
}

/** Permanently delete a single todo. */
export function deleteTodo(id: string): Promise<void> {
  return apiClient.delete<void>(`${BASE}/${id}`);
}

/** Toggle the pinned state of a todo. */
export function togglePin(id: string): Promise<TodoResponse> {
  return apiClient.patch<TodoResponse>(`${BASE}/${id}/pin`);
}

/** Toggle the completed state of a todo. */
export function toggleComplete(id: string): Promise<TodoResponse> {
  return apiClient.patch<TodoResponse>(`${BASE}/${id}/complete`);
}

/** Delete all completed todos for the current user. */
export function clearCompleted(): Promise<void> {
  return apiClient.delete<void>(`${BASE}/completed`);
}

/**
 * Bulk-import todos. Each entry is inserted as a new todo on the backend.
 * Returns the list of created todos.
 */
export function importTodos(todos: CreateTodoRequest[]): Promise<TodoResponse[]> {
  return apiClient.post<TodoResponse[]>(`${BASE}/import`, todos);
}

/** Export all todos (alias for getTodos, maps to GET /api/todos/export). */
export function exportTodos(): Promise<TodoResponse[]> {
  return apiClient.get<TodoResponse[]>(`${BASE}/export`);
}
