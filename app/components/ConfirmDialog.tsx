interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: Props) {
  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      {/* Card — stop click from bubbling to backdrop */}
      <div
        className="w-[270px] bg-white/95 dark:bg-[#1C1C1E]/95 rounded-[14px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title + message */}
        <div className="px-4 pt-5 pb-4 text-center">
          <p className="text-[17px] font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </p>
          <p className="text-[13px] text-gray-500 dark:text-[#8E8E93] leading-snug">
            {message}
          </p>
        </div>

        {/* Horizontal divider */}
        <div className="h-px bg-gray-200/80 dark:bg-[#38383A]" />

        {/* Buttons */}
        <div className="flex">
          <button
            onClick={onCancel}
            className="flex-1 h-11 text-[17px] text-[#007AFF] font-normal cursor-pointer hover:bg-gray-100/60 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>

          {/* Vertical divider */}
          <div className="w-px bg-gray-200/80 dark:bg-[#38383A]" />

          <button
            onClick={onConfirm}
            className="flex-1 h-11 text-[17px] text-[#FF3B30] font-semibold cursor-pointer hover:bg-gray-100/60 dark:hover:bg-white/5 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
