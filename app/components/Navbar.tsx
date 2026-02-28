interface Props {
  username: string;
  onLogout: () => void;
}

export function Navbar({ username, onLogout }: Props) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-10 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-[#38383A]/60">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* App title */}
        <span className="text-[17px] font-semibold text-gray-900 dark:text-white tracking-tight">
          My Todos
        </span>

        {/* Profile + logout */}
        <div className="flex items-center gap-3">
          {/* Avatar + name */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#007AFF] flex items-center justify-center shrink-0">
              <span className="text-white text-[12px] font-bold leading-none">{initial}</span>
            </div>
            <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              {username}
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-gray-200 dark:bg-[#38383A]" />

          {/* Sign out */}
          <button
            onClick={onLogout}
            className="text-[14px] font-medium text-[#FF3B30] cursor-pointer active:opacity-70 transition-opacity"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
