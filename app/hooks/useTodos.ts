import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import type { Todo } from "~/types/todo";

const STORAGE_KEY = "todos-v1";

function loadFromStorage(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Todo[];
    // Migrate existing todos that predate the `completed` field
    return parsed.map((t) => ({ ...t, completed: t.completed ?? false }));
  } catch {
    return [];
  }
}

function saveToStorage(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Fail silently (private browsing / quota exceeded)
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // useLayoutEffect runs synchronously before the browser paints (never on
  // the server), so todos and hydrated are set before the first visible frame —
  // no skeleton flash, no re-classification of stored categories.
  useLayoutEffect(() => {
    setTodos(loadFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveToStorage(todos);
    }
  }, [todos, hydrated]);

  const addTodo = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: trimmed, pinned: false, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const updateTodo = useCallback((id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: trimmed } : t))
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t))
    );
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const importTodos = useCallback((incoming: Todo[]) => {
    setTodos((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const newOnes = incoming
        .filter((t) => !existingIds.has(t.id))
        .map((t) => ({
          ...t,
          completed: t.completed ?? false,
          pinned: t.pinned ?? false,
          createdAt: t.createdAt ?? Date.now(),
        }));
      return [...newOnes, ...prev];
    });
  }, []);

  return { todos, hydrated, addTodo, updateTodo, deleteTodo, togglePin, toggleComplete, clearCompleted, importTodos };
}
