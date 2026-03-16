import { useState, useRef } from "react";
import type { Profile } from "~/hooks/useProfile";

interface Props {
  profile: Profile;
  username: string;
  onSave: (updates: Partial<Profile>) => void;
  onClose: () => void;
}

function resizeImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(); };
    img.src = url;
  });
}

export function ProfileModal({ profile, username, onSave, onClose }: Props) {
  const [displayName, setDisplayName] = useState(profile.displayName || username);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [bio, setBio] = useState(profile.bio);
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(profile.avatarDataUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file, 240);
      setAvatarDataUrl(resized);
    } catch {}
    e.target.value = "";
  }

  function handleSave() {
    onSave({ displayName: displayName.trim() || username, birthday, bio, avatarDataUrl });
    onClose();
  }

  const initial = (displayName || username).charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-[#1C1C1E] sm:rounded-2xl rounded-t-2xl shadow-2xl z-10">
        {/* Pull handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#48484A]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-3 pb-3 border-b border-gray-100 dark:border-[#38383A]">
          <button
            onClick={onClose}
            className="text-[#007AFF] text-[16px] cursor-pointer active:opacity-70"
          >
            Cancel
          </button>
          <span className="text-[17px] font-semibold text-gray-900 dark:text-white">Edit Profile</span>
          <button
            onClick={handleSave}
            className="text-[#007AFF] text-[16px] font-semibold cursor-pointer active:opacity-70"
          >
            Save
          </button>
        </div>

        <div className="px-5 py-6 space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              aria-label="Change profile photo"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-[#007AFF] flex items-center justify-center ring-4 ring-gray-100 dark:ring-[#2C2C2E]">
                {avatarDataUrl ? (
                  <img src={avatarDataUrl} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-[36px] font-bold leading-none">{initial}</span>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[13px] text-[#007AFF] cursor-pointer active:opacity-70"
              >
                Change Photo
              </button>
              {avatarDataUrl && (
                <>
                  <span className="text-gray-300 dark:text-[#48484A]">·</span>
                  <button
                    onClick={() => setAvatarDataUrl(null)}
                    className="text-[13px] text-[#FF3B30] cursor-pointer active:opacity-70"
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Fields */}
          <div className="bg-gray-50 dark:bg-[#2C2C2E] rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-[#38383A]">
            <label className="flex items-center px-4 py-3 gap-3">
              <span className="text-[14px] text-gray-500 dark:text-[#8E8E93] w-20 shrink-0">Name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={username}
                className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-[#48484A] outline-none"
              />
            </label>

            <label className="flex items-center px-4 py-3 gap-3">
              <span className="text-[14px] text-gray-500 dark:text-[#8E8E93] w-20 shrink-0">Birthday</span>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white outline-none [color-scheme:light] dark:[color-scheme:dark]"
              />
            </label>

            <label className="flex items-start px-4 py-3 gap-3">
              <span className="text-[14px] text-gray-500 dark:text-[#8E8E93] w-20 shrink-0 pt-0.5">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself…"
                rows={3}
                className="flex-1 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-[#48484A] outline-none resize-none"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
