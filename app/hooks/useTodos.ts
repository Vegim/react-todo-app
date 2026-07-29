import { useState, useEffect, useCallback } from "react";
import type { Todo } from "~/types/todo";
import * as todosApi from "~/api/todosApi";
import type { TodoResponse } from "~/api/types";

function fromResponse(r: TodoResponse): Todo {
  return { id: r.id, text: r.text, pinned: r.pinned, completed: r.completed, createdAt: r.createdAt, category: r.category ?? null, reminderAt: r.reminderAt ?? null };
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    todosApi.getTodos()
      .then((data) => { setTodos(data.map(fromResponse)); setHydrated(true); })
      .catch(() => setHydrated(true));
  }, []);

  const addTodo = useCallback(async (text: string, reminderAt?: number | null) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const todo = await todosApi.createTodo({ text: trimmed, reminderAt: reminderAt ?? undefined });
    setTodos((prev) => [fromResponse(todo), ...prev]);
  }, []);

  const updateTodo = useCallback(async (id: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const todo = await todosApi.updateTodo(id, { text: trimmed });
    setTodos((prev) => prev.map((t) => (t.id === id ? fromResponse(todo) : t)));
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    await todosApi.deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const todo = await todosApi.togglePin(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? fromResponse(todo) : t)));
  }, []);

  const toggleComplete = useCallback(async (id: string) => {
    const todo = await todosApi.toggleComplete(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? fromResponse(todo) : t)));
  }, []);

  const clearCompleted = useCallback(async () => {
    await todosApi.clearCompleted();
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const setReminder = useCallback(async (id: string, reminderAt: number | null) => {
    const todo = await todosApi.updateTodo(id, { reminderAt: reminderAt ?? 0 });
    setTodos((prev) => prev.map((t) => (t.id === id ? fromResponse(todo) : t)));
  }, []);

  const importTodos = useCallback(async (incoming: Todo[]) => {
    const requests = incoming.map((t) => ({ text: t.text }));
    const created = await todosApi.importTodos(requests);
    setTodos((prev) => [...created.map(fromResponse), ...prev]);
  }, []);

  return { todos, hydrated, addTodo, updateTodo, setReminder, deleteTodo, togglePin, toggleComplete, clearCompleted, importTodos };
}
