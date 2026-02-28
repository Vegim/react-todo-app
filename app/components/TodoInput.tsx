import { useState, type FormEvent } from "react";

interface Props {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm px-4 py-3 mb-4"
    >
      <input
        type="text"
        placeholder="New Todo"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 text-[15px] text-gray-900 dark:text-white bg-transparent outline-none placeholder:text-gray-400 dark:placeholder:text-[#636366]"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="shrink-0 bg-[#007AFF] disabled:bg-[#007AFF]/40 text-white text-[13px] font-semibold px-4 py-1.5 rounded-full transition-opacity cursor-pointer disabled:cursor-default"
      >
        Add
      </button>
    </form>
  );
}
