import { useState, type KeyboardEvent } from "react";
import type { Todo } from "~/types/todo";
import { ConfirmDialog } from "./ConfirmDialog";
import { CATEGORY_META, type Category } from "~/utils/categorize";

interface Props {
  todo: Todo;
  category: Category | null;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onSetReminder: (id: string, reminderAt: number | null) => void;
}

function formatReminderTime(ts: number): string {
  return new Date(ts).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDatetimeLocal(ts: number): string {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function TodoItem({ todo, category, onUpdate, onDelete, onTogglePin, onToggleComplete, onSetReminder }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const [editReminder, setEditReminder] = useState(todo.reminderAt ? toDatetimeLocal(todo.reminderAt) : "");
  const [showConfirm, setShowConfirm] = useState(false);

  function startEdit() {
    setEditValue(todo.text);
    setEditReminder(todo.reminderAt ? toDatetimeLocal(todo.reminderAt) : "");
    setIsEditing(true);
  }

  function saveEdit() {
    if (editValue.trim()) {
      onUpdate(todo.id, editValue);
    }
    const newReminderAt = editReminder ? new Date(editReminder).getTime() : null;
    if (newReminderAt !== todo.reminderAt) {
      onSetReminder(todo.id, newReminderAt);
    }
    setIsEditing(false);
  }

  function cancelEdit() {
    setEditValue(todo.text);
    setEditReminder(todo.reminderAt ? toDatetimeLocal(todo.reminderAt) : "");
    setIsEditing(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") cancelEdit();
  }

  const isOverdue = !!todo.reminderAt && todo.reminderAt < Date.now() && !todo.completed;
  const minDatetime = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  if (isEditing) {
    return (
      <li className="flex flex-col gap-2 px-4 py-3 bg-white dark:bg-[#1C1C1E]">
        <div className="flex items-center gap-3">
          {/* Spacer to align with the checkmark circle */}
          <div className="w-6 h-6 shrink-0" />
          <input
            autoFocus
            className="flex-1 text-[15px] bg-transparent outline-none text-gray-900 dark:text-white"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={cancelEdit}
            className="text-[13px] text-gray-400 dark:text-[#636366] font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            className="text-[13px] text-[#007AFF] font-semibold cursor-pointer"
          >
            Save
          </button>
        </div>

        {/* Reminder picker in edit mode */}
        <div className="flex items-center gap-2 pl-9">
          <svg className="w-3.5 h-3.5 text-[#FF9500] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="text-[12px] text-gray-400 dark:text-[#636366] shrink-0">Remind at</span>
          <input
            type="datetime-local"
            value={editReminder}
            min={minDatetime}
            onChange={(e) => setEditReminder(e.target.value)}
            className="flex-1 text-[12px] text-gray-900 dark:text-white bg-transparent outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
          {editReminder && (
            <button
              type="button"
              onClick={() => setEditReminder("")}
              className="text-[11px] text-[#FF3B30] font-medium cursor-pointer shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      </li>
    );
  }

  return (
    <li className="group flex items-center gap-3 px-4 py-3.5">
      {/* Checkmark circle */}
      <button
        onClick={() => onToggleComplete(todo.id)}
        title={todo.completed ? "Mark incomplete" : "Mark complete"}
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer focus:outline-none"
        style={
          todo.completed
            ? { backgroundColor: "#34C759", border: "2px solid #34C759" }
            : { border: "2px solid #D1D1D6" }
        }
      >
        {todo.completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
      </button>

      {/* Todo text + badges */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span
          className={`text-[15px] leading-snug break-words transition-colors ${
            todo.completed
              ? "line-through text-gray-300 dark:text-[#48484A]"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {todo.text}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {category === null ? (
            <span className="h-4 w-16 rounded-full bg-gray-100 dark:bg-[#2C2C2E] animate-pulse inline-block" />
          ) : (
            <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full w-fit ${CATEGORY_META[category].bgClass} ${CATEGORY_META[category].textClass}`}>
              {CATEGORY_META[category].emoji} {CATEGORY_META[category].label}
            </span>
          )}
          {todo.reminderAt && !todo.completed && (
            <span
              className={`flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
                isOverdue
                  ? "bg-[#FF3B30]/10 text-[#FF3B30]"
                  : "bg-[#FF9500]/10 text-[#FF9500]"
              }`}
            >
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              {isOverdue ? "Overdue · " : ""}{formatReminderTime(todo.reminderAt)}
            </span>
          )}
        </div>
      </div>

      {/* Pin + action buttons — appear on hover */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          onClick={() => onTogglePin(todo.id)}
          title={todo.pinned ? "Unpin" : "Pin"}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            todo.pinned
              ? "text-[#FF9500] bg-[#FF9500]/10"
              : "text-gray-300 dark:text-[#48484A] hover:text-[#FF9500] hover:bg-[#FF9500]/10"
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 3a1 1 0 0 1 .707.293l4 4a1 1 0 0 1-1.414 1.414L18 7.414V13a1 1 0 0 1-.293.707L15 16.414V20a1 1 0 0 1-1.707.707l-3-3-3.586 3.586a1 1 0 0 1-1.414-1.414L9.586 16 6.707 13.121A1 1 0 0 1 7 12V7.414L5.707 8.707A1 1 0 0 1 4.293 7.293l4-4A1 1 0 0 1 9 3h7z" />
          </svg>
        </button>
        <button
          onClick={startEdit}
          title="Edit"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/20 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          title="Delete"
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/20 transition-colors cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Delete Todo"
          message="Are you sure you want to delete this item?"
          onConfirm={() => { setShowConfirm(false); onDelete(todo.id); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </li>
  );
}
