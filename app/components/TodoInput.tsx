import { useState } from "react";

interface Props {
  onAdd: (text: string, reminderAt?: number | null) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderValue, setReminderValue] = useState("");

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!value.trim()) return;
    const reminderAt = reminderValue ? new Date(reminderValue).getTime() : null;
    onAdd(value, reminderAt);
    setValue("");
    setReminderValue("");
    setShowReminder(false);
  }

  // Minimum datetime is 1 minute from now
  const minDatetime = new Date(Date.now() + 60_000).toISOString().slice(0, 16);

  return (
    <div className="mb-4">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm px-4 py-3"
      >
        <input
          type="text"
          placeholder="New Todo"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 text-[15px] text-gray-900 dark:text-white bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-[#636366]"
        />
        {/* Bell toggle button */}
        <button
          type="button"
          onClick={() => setShowReminder((s) => !s)}
          title="Set reminder"
          className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            showReminder || reminderValue
              ? "bg-[#FF9500]/15 text-[#FF9500]"
              : "text-gray-300 dark:text-[#48484A] hover:text-[#FF9500] hover:bg-[#FF9500]/10"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={!value.trim()}
          className="shrink-0 bg-[#007AFF] disabled:bg-[#007AFF]/40 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-opacity cursor-pointer disabled:cursor-default"
        >
          Add
        </button>
      </form>

      {showReminder && (
        <div className="flex items-center gap-2 mt-2 px-4 py-2.5 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm">
          <svg className="w-3.5 h-3.5 text-[#FF9500] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="text-[13px] text-gray-500 dark:text-[#636366] shrink-0">Remind me at</span>
          <input
            type="datetime-local"
            value={reminderValue}
            min={minDatetime}
            onChange={(e) => setReminderValue(e.target.value)}
            className="flex-1 text-[13px] text-gray-900 dark:text-white bg-transparent outline-none [color-scheme:light] dark:[color-scheme:dark]"
          />
          {reminderValue && (
            <button
              type="button"
              onClick={() => setReminderValue("")}
              className="text-[12px] text-[#FF3B30] font-medium cursor-pointer shrink-0"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
