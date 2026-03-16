import { useState, useMemo, useRef } from "react";
import { useTodos } from "~/hooks/useTodos";
import { TodoInput } from "./TodoInput";
import { TodoList, type Filter } from "./TodoList";
import { CATEGORIES, CATEGORY_META, type Category } from "~/utils/categorize";
import type { Todo } from "~/types/todo";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",    label: "All"    },
  { value: "active", label: "Active" },
  { value: "done",   label: "Done"   },
];

export function TodoApp() {
  const { todos, hydrated, addTodo, updateTodo, deleteTodo, togglePin, toggleComplete, clearCompleted, importTodos } = useTodos();
  const [filter, setFilter] = useState<Filter>("all");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build categoryMap directly from the backend-assigned category on each todo
  const categoryMap = useMemo(() => {
    const map: Record<string, Category> = {};
    for (const todo of todos) {
      if (todo.category) map[todo.id] = todo.category as Category;
    }
    return map;
  }, [todos]);

  // Count total + completed per category
  const categoryBreakdown = useMemo(() => {
    const result: Partial<Record<Category, { total: number; completed: number }>> = {};
    for (const todo of todos) {
      const cat = categoryMap[todo.id];
      if (!cat) continue;
      if (!result[cat]) result[cat] = { total: 0, completed: 0 };
      result[cat]!.total++;
      if (todo.completed) result[cat]!.completed++;
    }
    return result;
  }, [todos, categoryMap]);

  // Only show categories that have at least one classified todo
  const activeCategories = CATEGORIES.filter((cat) => (categoryBreakdown[cat]?.total ?? 0) > 0);

  // Pre-filter by active category before passing to TodoList
  const filteredTodos = useMemo(() => {
    if (activeCategory === "all") return todos;
    return todos.filter((t) => categoryMap[t.id] === activeCategory);
  }, [todos, activeCategory, categoryMap]);

  const remaining = filteredTodos.filter((t) => !t.completed).length;
  const hasTodos = todos.length > 0;

  // Overall progress
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Export current todos as a JSON file download
  function handleExport() {
    const data = todos.map((t) => ({ ...t }));
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as (Todo & { category?: Category })[];
        if (!Array.isArray(data)) throw new Error("Not an array");
        importTodos(data);
        e.target.value = "";
      } catch {
        alert("Could not import: the file is not a valid todos JSON export.");
      }
    };
    reader.readAsText(file);
  }

  return (
    <main className="min-h-screen bg-[#F2F2F7] dark:bg-black px-4 sm:px-6 pt-8 pb-12">
      <div className="mx-auto max-w-2xl w-full">

        {/* Title row + export/import buttons */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-[34px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
              My Todos
            </h1>
            {hydrated && hasTodos && (
              <div className="mt-0.5">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] text-gray-400 dark:text-[#636366]">
                    {remaining === 0
                      ? "All done!"
                      : `${remaining} task${remaining !== 1 ? "s" : ""} remaining`}
                  </p>
                  <span className="text-[13px] font-semibold text-gray-400 dark:text-[#636366]">
                    {overallPct}%
                  </span>
                </div>
                {/* Overall progress bar */}
                <div className="mt-1.5 h-1.5 w-36 bg-gray-200 dark:bg-[#2C2C2E] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${overallPct}%`,
                      backgroundColor: overallPct === 100 ? "#34C759" : "#007AFF",
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Export + Import icon buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleImportClick}
              title="Import JSON"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#2C2C2E] shadow-sm text-gray-400 dark:text-gray-500 hover:text-[#007AFF] dark:hover:text-[#007AFF] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </button>
            <button
              onClick={handleExport}
              title="Export JSON"
              disabled={!hydrated || todos.length === 0}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-[#2C2C2E] shadow-sm text-gray-400 dark:text-gray-500 hover:text-[#007AFF] dark:hover:text-[#007AFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Add input */}
        <TodoInput onAdd={addTodo} />

        {hydrated && hasTodos && (
          <>
            {/* Status filter segmented control */}
            <div className="flex bg-gray-200/70 dark:bg-[#2C2C2E] rounded-xl p-1 mb-3 gap-1">
              {FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`flex-1 py-1.5 text-[13px] font-medium rounded-lg transition-all cursor-pointer ${
                    filter === value
                      ? "bg-white dark:bg-[#3A3A3C] text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-[#636366] hover:text-gray-700 dark:hover:text-gray-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Category chips — shown as soon as there are categories (stored or freshly classified) */}
            {activeCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {/* All chip */}
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer ${
                    activeCategory === "all"
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm"
                      : "bg-white dark:bg-[#2C2C2E] text-gray-500 dark:text-gray-400 shadow-sm"
                  }`}
                >
                  All
                  <span className={`text-[11px] font-semibold px-1.5 h-4 rounded-full flex items-center justify-center whitespace-nowrap ${
                    activeCategory === "all"
                      ? "bg-white/20 dark:bg-black/20"
                      : "bg-gray-100 dark:bg-[#38383A] text-gray-600 dark:text-gray-300"
                  }`}>
                    {completedCount}/{totalCount}
                  </span>
                </button>

                {/* Per-category chips */}
                {activeCategories.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  const stats = categoryBreakdown[cat] ?? { total: 0, completed: 0 };
                  const catPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={isActive ? { backgroundColor: meta.activeBg } : {}}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all cursor-pointer shadow-sm ${
                        isActive
                          ? "text-white"
                          : `bg-white dark:bg-[#2C2C2E] ${meta.textClass}`
                      }`}
                    >
                      <span>{meta.emoji}</span>
                      <span>{cat}</span>
                      <span className={`text-[11px] font-semibold px-1.5 h-4 rounded-full flex items-center justify-center whitespace-nowrap ${
                        isActive
                          ? "bg-white/25"
                          : `${meta.bgClass} ${meta.textClass}`
                      }`}>
                        {stats.completed}/{stats.total} · {catPct}%
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

          </>
        )}

        {/* List */}
        {hydrated ? (
          <TodoList
            todos={filteredTodos}
            filter={filter}
            categoryMap={categoryMap}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onTogglePin={togglePin}
            onToggleComplete={toggleComplete}
            onClearCompleted={clearCompleted}
          />
        ) : (
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-[#38383A]">
            {[1, 2, 3].map((i) => (
              <div key={i} className="px-4 py-3.5 flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-[#38383A] animate-pulse" />
                <div className="flex-1 h-3.5 rounded-full bg-gray-100 dark:bg-[#38383A] animate-pulse" />
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
