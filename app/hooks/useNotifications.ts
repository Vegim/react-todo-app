import { useEffect, useRef } from "react";
import type { Todo } from "~/types/todo";

const FIRED_KEY = "reminder-fired";
const POLL_INTERVAL_MS = 30_000;

function getFiredSet(): Set<string> {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markFired(key: string) {
  const set = getFiredSet();
  set.add(key);
  // Keep the set bounded; drop entries older than 7 days
  const now = Date.now();
  const pruned = [...set].filter((k) => {
    const ts = Number(k.split(":")[1]);
    return isNaN(ts) || now - ts < 7 * 24 * 60 * 60 * 1000;
  });
  localStorage.setItem(FIRED_KEY, JSON.stringify(pruned));
}

export function useNotifications(todos: Todo[]) {
  const todosRef = useRef<Todo[]>(todos);
  todosRef.current = todos;

  // Request permission once on mount
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    // Register service worker for background support
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {
        // SW registration is optional; ignore failures
      });
    }
  }, []);

  // Poll for due reminders
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    function checkReminders() {
      if (Notification.permission !== "granted") return;
      const now = Date.now();
      const fired = getFiredSet();

      for (const todo of todosRef.current) {
        if (!todo.reminderAt || todo.completed) continue;
        if (todo.reminderAt > now) continue;

        const key = `${todo.id}:${todo.reminderAt}`;
        if (fired.has(key)) continue;

        markFired(key);

        new Notification("Todo Reminder", {
          body: todo.text,
          icon: "/favicon.ico",
          tag: key,
        });
      }
    }

    checkReminders();
    const interval = setInterval(checkReminders, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);
}
