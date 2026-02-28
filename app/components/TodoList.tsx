import { useMemo } from "react";
import type { Todo } from "~/types/todo";
import { TodoItem } from "./TodoItem";
import { TodoEmptyState } from "./TodoEmptyState";
import type { CategoryMap } from "~/hooks/useClassifier";

export type Filter = "all" | "active" | "done";

interface Props {
  todos: Todo[];
  filter: Filter;
  categoryMap: CategoryMap;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onClearCompleted: () => void;
}

const EMPTY_MESSAGES: Record<Filter, { title: string; subtitle: string }> = {
  all:    { title: "No todos yet",      subtitle: "Add one above to get started" },
  active: { title: "Nothing active",    subtitle: "All your tasks are done!" },
  done:   { title: "Nothing completed", subtitle: "Finish a task to see it here" },
};

export function TodoList({
  todos,
  filter,
  categoryMap,
  onUpdate,
  onDelete,
  onTogglePin,
  onToggleComplete,
  onClearCompleted,
}: Props) {
  const { pinned, unpinned, completedCount } = useMemo(() => {
    const sort = (a: Todo, b: Todo) => b.createdAt - a.createdAt;

    const applyFilter = (items: Todo[]) => {
      if (filter === "active") return items.filter((t) => !t.completed);
      if (filter === "done")   return items.filter((t) => t.completed);
      return items;
    };

    const pinned        = applyFilter(todos.filter((t) =>  t.pinned)).sort(sort);
    const unpinned      = applyFilter(todos.filter((t) => !t.pinned)).sort(sort);
    const completedCount = todos.filter((t) => t.completed).length;

    return { pinned, unpinned, completedCount };
  }, [todos, filter]);

  if (pinned.length === 0 && unpinned.length === 0) {
    return <TodoEmptyState {...EMPTY_MESSAGES[filter]} />;
  }

  return (
    <div className="flex flex-col gap-8">
      {pinned.length > 0 && (
        <section>
          <p className="text-xs font-semibold text-[#FF9500] uppercase tracking-wider px-4 mb-1">
            Pinned
          </p>
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100 dark:divide-[#38383A]">
              {pinned.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  category={categoryMap[todo.id] ?? null}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </ul>
          </div>
        </section>
      )}

      {unpinned.length > 0 && (
        <section>
          {pinned.length > 0 && (
            <p className="text-xs font-semibold text-gray-400 dark:text-[#636366] uppercase tracking-wider px-4 mb-1">
              Tasks
            </p>
          )}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100 dark:divide-[#38383A]">
              {unpinned.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  category={categoryMap[todo.id] ?? null}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </ul>
          </div>
        </section>
      )}

      {completedCount > 0 && filter !== "active" && (
        <button
          onClick={onClearCompleted}
          className="text-[13px] text-[#FF3B30] font-medium text-center w-full cursor-pointer active:opacity-60 transition-opacity"
        >
          Clear {completedCount} completed
        </button>
      )}
    </div>
  );
}
