import { useState, useRef, useEffect } from "react";
import type { Profile } from "~/hooks/useProfile";

interface Props {
  username: string;
  profile: Profile;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function Navbar({ username, profile, onLogout, onEditProfile }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = profile.displayName || username;
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md border-b border-gray-200/60 dark:border-[#38383A]/60">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* App title */}
        <span className="text-[17px] font-semibold text-gray-900 dark:text-white tracking-tight">
          My Todos
        </span>

        {/* Profile button + dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity"
          >
            {/* Avatar */}
            <div className="w-7 h-7 rounded-full overflow-hidden bg-[#007AFF] flex items-center justify-center shrink-0">
              {profile.avatarDataUrl ? (
                <img src={profile.avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[12px] font-bold leading-none">{initial}</span>
              )}
            </div>
            <span className="text-[14px] font-medium text-gray-700 dark:text-gray-300">
              {displayName}
            </span>
            {/* Chevron */}
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#2C2C2E] rounded-2xl shadow-xl border border-gray-100 dark:border-[#38383A] overflow-hidden z-50">
              {/* Profile summary */}
              <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 dark:border-[#38383A]">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#007AFF] flex items-center justify-center shrink-0">
                  {profile.avatarDataUrl ? (
                    <img src={profile.avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-[18px] font-bold leading-none">{initial}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">
                    {displayName}
                  </p>
                  {profile.bio ? (
                    <p className="text-[12px] text-gray-400 dark:text-[#8E8E93] truncate">{profile.bio}</p>
                  ) : profile.birthday ? (
                    <p className="text-[12px] text-gray-400 dark:text-[#8E8E93]">
                      🎂 {new Date(profile.birthday + "T00:00:00").toLocaleDateString(undefined, { month: "long", day: "numeric" })}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Edit Profile */}
              <button
                onClick={() => { setOpen(false); onEditProfile(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Profile
              </button>

              {/* Divider */}
              <div className="h-px bg-gray-100 dark:bg-[#38383A]" />

              {/* Sign Out */}
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-[#FF3B30] hover:bg-gray-50 dark:hover:bg-[#3A3A3C] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
