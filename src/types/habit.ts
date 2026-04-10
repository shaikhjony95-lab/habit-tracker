export interface Profile {
  id: string;
  name: string;
  motivationalText: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  createdAt: string;
}

export interface SleepLog {
  id: string;
  date: string;
  hours: number;
  quality: number;
  note: string | null;
  createdAt: string;
}

export interface DailyNote {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyGoal {
  id: string;
  date: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
  currentStreak: number;
  bestStreak: number;
  monthCompletion: number;
}

export const HABIT_ICONS = [
  { name: "Dumbbell", label: "Exercise" },
  { name: "BookOpen", label: "Reading" },
  { name: "Brain", label: "Study" },
  { name: "Droplets", label: "Water" },
  { name: "Moon", label: "Sleep Early" },
  { name: "Heart", label: "Health" },
  { name: "Pencil", label: "Journaling" },
  { name: "Music", label: "Music" },
  { name: "Salad", label: "Diet" },
  { name: "Smile", label: "Mindfulness" },
  { name: "Code", label: "Coding" },
  { name: "Camera", label: "Photography" },
  { name: "Bike", label: "Cycling" },
  { name: "TreePine", label: "Nature" },
  { name: "Coffee", label: "No Caffeine" },
  { name: "Clock", label: "Routine" },
  { name: "Target", label: "Goals" },
  { name: "Sparkles", label: "Self Care" },
  { name: "Palette", label: "Art" },
  { name: "Languages", label: "Language" },
] as const;

export const HABIT_COLORS = [
  "#f97316", // orange
  "#ef4444", // red
  "#22c55e", // green
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#ec4899", // pink
  "#eab308", // yellow
  "#14b8a6", // teal
  "#f43f5e", // rose
  "#8b5cf6", // violet
] as const;

export const HABIT_CATEGORIES = [
  "Health",
  "Fitness",
  "Mindfulness",
  "Learning",
  "Productivity",
  "Social",
  "Creative",
  "Finance",
  "General",
] as const;
