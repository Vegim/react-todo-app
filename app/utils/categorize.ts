export type Category =
  | "Shopping"
  | "Work"
  | "Home"
  | "Health"
  | "Study"
  | "Finance"
  | "Personal"
  | "Travel"
  | "Entertainment"
  | "Errands"
  | "General";

export interface CategoryMeta {
  label: Category;
  emoji: string;
  textClass: string;
  bgClass: string;
  activeBg: string;
}

export const CATEGORIES: Category[] = [
  "Shopping",
  "Work",
  "Home",
  "Health",
  "Study",
  "Finance",
  "Personal",
  "Travel",
  "Entertainment",
  "Errands",
  "General",
];

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Shopping: {
    label: "Shopping",
    emoji: "🛒",
    textClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50 dark:bg-emerald-900/30",
    activeBg: "#10B981",
  },
  Work: {
    label: "Work",
    emoji: "💼",
    textClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50 dark:bg-blue-900/30",
    activeBg: "#3B82F6",
  },
  Home: {
    label: "Home",
    emoji: "🏠",
    textClass: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-50 dark:bg-orange-900/30",
    activeBg: "#F97316",
  },
  Health: {
    label: "Health",
    emoji: "🏃",
    textClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50 dark:bg-red-900/30",
    activeBg: "#EF4444",
  },
  Study: {
    label: "Study",
    emoji: "📚",
    textClass: "text-purple-600 dark:text-purple-400",
    bgClass: "bg-purple-50 dark:bg-purple-900/30",
    activeBg: "#8B5CF6",
  },
  Finance: {
    label: "Finance",
    emoji: "💰",
    textClass: "text-yellow-600 dark:text-yellow-500",
    bgClass: "bg-yellow-50 dark:bg-yellow-900/30",
    activeBg: "#EAB308",
  },
  Personal: {
    label: "Personal",
    emoji: "👤",
    textClass: "text-pink-600 dark:text-pink-400",
    bgClass: "bg-pink-50 dark:bg-pink-900/30",
    activeBg: "#EC4899",
  },
  Travel: {
    label: "Travel",
    emoji: "✈️",
    textClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-50 dark:bg-sky-900/30",
    activeBg: "#0EA5E9",
  },
  Entertainment: {
    label: "Entertainment",
    emoji: "🎬",
    textClass: "text-indigo-600 dark:text-indigo-400",
    bgClass: "bg-indigo-50 dark:bg-indigo-900/30",
    activeBg: "#6366F1",
  },
  Errands: {
    label: "Errands",
    emoji: "📋",
    textClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-50 dark:bg-teal-900/30",
    activeBg: "#14B8A6",
  },
  General: {
    label: "General",
    emoji: "📝",
    textClass: "text-gray-500 dark:text-gray-400",
    bgClass: "bg-gray-100 dark:bg-[#2C2C2E]",
    activeBg: "#6B7280",
  },
};
