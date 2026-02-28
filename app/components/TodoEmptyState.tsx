interface Props {
  title?: string;
  subtitle?: string;
}

export function TodoEmptyState({
  title = "No todos yet",
  subtitle = "Add one above to get started",
}: Props) {
  return (
    <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-sm flex flex-col items-center gap-3 py-14 text-center select-none">
      <div className="w-14 h-14 rounded-full bg-[#F2F2F7] dark:bg-[#2C2C2E] flex items-center justify-center">
        <svg
          className="w-7 h-7 text-gray-300 dark:text-[#48484A]"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p className="text-[15px] font-medium text-gray-400 dark:text-[#636366]">{title}</p>
        <p className="text-[13px] text-gray-300 dark:text-[#48484A] mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
