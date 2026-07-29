export interface Todo {
  id: string;
  text: string;
  pinned: boolean;
  completed: boolean;
  createdAt: number;
  category: string | null;
  reminderAt: number | null;
}
