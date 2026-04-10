import { create } from "zustand";
import type {
  Habit,
  HabitLog,
  HabitWithLogs,
  SleepLog,
  DailyNote,
  DailyGoal,
  Profile,
} from "@/types/habit";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  subDays,
  differenceInCalendarDays,
} from "date-fns";

interface HabitStore {
  // Data
  profile: Profile | null;
  habits: Habit[];
  habitLogs: HabitLog[];
  sleepLogs: SleepLog[];
  notes: DailyNote[];
  dailyGoals: DailyGoal[];

  // UI State
  selectedMonth: Date;
  selectedDate: string;
  activeTab: string;
  isLoading: boolean;

  // Actions - Data fetching
  fetchAllData: (month: Date) => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchHabits: () => Promise<void>;
  fetchHabitLogs: (month: Date) => Promise<void>;
  fetchSleepLogs: (month: Date) => Promise<void>;
  fetchNotes: (month: Date) => Promise<void>;
  fetchDailyGoals: (date: string) => Promise<void>;

  // Actions - Mutations
  updateProfile: (data: { name: string; motivationalText: string }) => Promise<void>;
  addHabit: (data: { name: string; icon: string; color: string; category: string }) => Promise<void>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitLog: (habitId: string, date: string) => Promise<void>;
  logSleep: (date: string, hours: number, quality: number, note?: string) => Promise<void>;
  saveNote: (date: string, content: string) => Promise<void>;
  addGoal: (date: string, text: string, priority?: 'high' | 'medium' | 'low') => Promise<void>;
  toggleGoal: (id: string) => Promise<void>;
  updateGoalText: (id: string, text: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Actions - UI
  setSelectedMonth: (date: Date) => void;
  setSelectedDate: (date: string) => void;
  setActiveTab: (tab: string) => void;

  // Computed
  getHabitWithLogs: (habitId: string) => HabitWithLogs | null;
  getHabitsWithLogs: () => HabitWithLogs[];
  getCompletionRate: (habitId: string) => number;
  getMonthlyCompletionRate: () => number;
  getSleepData: () => SleepLog[];
  getNoteForDate: (date: string) => DailyNote | null;
  getGoalsForDate: (date: string) => DailyGoal[];
  getGoalsCompletionRate: (date: string) => number;
  getOverallStreak: () => number;
}

function calculateStreak(
  logs: HabitLog[],
  habitId: string,
  endDate: Date = new Date()
): { current: number; best: number } {
  const habitLogs = logs
    .filter((l) => l.habitId === habitId && l.completed)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (habitLogs.length === 0) return { current: 0, best: 0 };

  let current = 0;
  let checkDate = format(endDate, "yyyy-MM-dd");
  if (!habitLogs.includes(checkDate)) {
    checkDate = format(subDays(endDate, 1), "yyyy-MM-dd");
  }

  for (let i = 0; i < 365; i++) {
    if (habitLogs.includes(checkDate)) {
      current++;
      checkDate = format(subDays(new Date(checkDate), 1), "yyyy-MM-dd");
    } else {
      break;
    }
  }

  let best = 0;
  let tempBest = 1;
  const sorted = [...habitLogs].sort();
  for (let i = 1; i < sorted.length; i++) {
    const diff = differenceInCalendarDays(
      new Date(sorted[i]),
      new Date(sorted[i - 1])
    );
    if (diff === 1) {
      tempBest++;
    } else {
      best = Math.max(best, tempBest);
      tempBest = 1;
    }
  }
  best = Math.max(best, tempBest);

  return { current, best };
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  profile: null,
  habits: [],
  habitLogs: [],
  sleepLogs: [],
  notes: [],
  dailyGoals: [],
  selectedMonth: new Date(),
  selectedDate: format(new Date(), "yyyy-MM-dd"),
  activeTab: "goals",
  isLoading: false,

  fetchAllData: async (month: Date) => {
    set({ isLoading: true });
    try {
      await Promise.all([
        get().fetchProfile(),
        get().fetchHabits(),
        get().fetchHabitLogs(month),
        get().fetchSleepLogs(month),
        get().fetchNotes(month),
        get().fetchDailyGoals(format(new Date(), "yyyy-MM-dd")),
      ]);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        set({ profile: data });
      }
    } catch {
      try {
        const res = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "User", motivationalText: "BE CONSISTENT" }),
        });
        if (res.ok) {
          const data = await res.json();
          set({ profile: data });
        }
      } catch { /* ignore */ }
    }
  },

  fetchHabits: async () => {
    try {
      const res = await fetch("/api/habits");
      if (res.ok) set({ habits: await res.json() });
    } catch { /* ignore */ }
  },

  fetchHabitLogs: async (month: Date) => {
    try {
      const monthStr = format(month, "yyyy-MM");
      const res = await fetch(`/api/habits/logs?month=${monthStr}`);
      if (res.ok) set({ habitLogs: await res.json() });
    } catch { /* ignore */ }
  },

  fetchSleepLogs: async (month: Date) => {
    try {
      const monthStr = format(month, "yyyy-MM");
      const res = await fetch(`/api/sleep?month=${monthStr}`);
      if (res.ok) set({ sleepLogs: await res.json() });
    } catch { /* ignore */ }
  },

  fetchNotes: async (month: Date) => {
    try {
      const monthStr = format(month, "yyyy-MM");
      const res = await fetch(`/api/notes?month=${monthStr}`);
      if (res.ok) set({ notes: await res.json() });
    } catch { /* ignore */ }
  },

  fetchDailyGoals: async (date: string) => {
    try {
      const res = await fetch(`/api/goals?date=${date}`);
      if (res.ok) set({ dailyGoals: await res.json() });
    } catch { /* ignore */ }
  },

  updateProfile: async (data) => {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) set({ profile: await res.json() });
  },

  addHabit: async (data) => {
    const res = await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const habit = await res.json();
      set((s) => ({ habits: [...s.habits, habit] }));
    }
  },

  updateHabit: async (id, data) => {
    const res = await fetch(`/api/habits/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const habit = await res.json();
      set((s) => ({ habits: s.habits.map((h) => (h.id === id ? habit : h)) }));
    }
  },

  deleteHabit: async (id) => {
    const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
    if (res.ok) set((s) => ({
      habits: s.habits.filter((h) => h.id !== id),
      habitLogs: s.habitLogs.filter((l) => l.habitId !== id),
    }));
  },

  toggleHabitLog: async (habitId, date) => {
    const existing = get().habitLogs.find((l) => l.habitId === habitId && l.date === date);
    const newCompleted = !existing?.completed;

    if (existing) {
      set((s) => ({ habitLogs: s.habitLogs.map((l) =>
        l.habitId === habitId && l.date === date ? { ...l, completed: newCompleted } : l
      )}));
    } else {
      set((s) => ({ habitLogs: [...s.habitLogs, {
        id: `temp-${Date.now()}`, habitId, date, completed: newCompleted, createdAt: new Date().toISOString(),
      }]}));
    }

    try {
      const res = await fetch("/api/habits/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date, completed: newCompleted }),
      });
      if (res.ok) {
        const log = await res.json();
        set((s) => ({ habitLogs: s.habitLogs.map((l) =>
          l.habitId === habitId && l.date === date ? log : l
        )}));
      }
    } catch { /* optimistic update already applied */ }
  },

  logSleep: async (date, hours, quality, note) => {
    const res = await fetch("/api/sleep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, hours, quality, note }),
    });
    if (res.ok) {
      const log = await res.json();
      set((s) => {
        const i = s.sleepLogs.findIndex((l) => l.date === date);
        if (i >= 0) { const n = [...s.sleepLogs]; n[i] = log; return { sleepLogs: n }; }
        return { sleepLogs: [...s.sleepLogs, log] };
      });
    }
  },

  saveNote: async (date, content) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, content }),
    });
    if (res.ok) {
      const note = await res.json();
      set((s) => {
        const i = s.notes.findIndex((n) => n.date === date);
        if (i >= 0) { const n = [...s.notes]; n[i] = note; return { notes: n }; }
        return { notes: [...s.notes, note] };
      });
    }
  },

  addGoal: async (date, text, priority) => {
    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, text, priority: priority || "medium" }),
    });
    if (res.ok) {
      const goal = await res.json();
      set((s) => ({ dailyGoals: [...s.dailyGoals, goal] }));
    }
  },

  toggleGoal: async (id) => {
    const goal = get().dailyGoals.find((g) => g.id === id);
    const newCompleted = !goal?.completed;

    // Optimistic
    set((s) => ({ dailyGoals: s.dailyGoals.map((g) =>
      g.id === id ? { ...g, completed: newCompleted! } : g
    )}));

    try {
      const res = await fetch("/api/goals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed: newCompleted }),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({ dailyGoals: s.dailyGoals.map((g) => g.id === id ? updated : g) }));
      }
    } catch { /* optimistic update already applied */ }
  },

  updateGoalText: async (id, text) => {
    const res = await fetch("/api/goals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text }),
    });
    if (res.ok) {
      const updated = await res.json();
      set((s) => ({ dailyGoals: s.dailyGoals.map((g) => g.id === id ? updated : g) }));
    }
  },

  deleteGoal: async (id) => {
    // Optimistic
    set((s) => ({ dailyGoals: s.dailyGoals.filter((g) => g.id !== id) }));
    try {
      await fetch(`/api/goals?id=${id}`, { method: "DELETE" });
    } catch { /* already removed optimistically */ }
  },

  setSelectedMonth: (date) => {
    set({ selectedMonth: date });
    get().fetchHabitLogs(date);
    get().fetchSleepLogs(date);
    get().fetchNotes(date);
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchDailyGoals(date);
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  getHabitWithLogs: (habitId) => {
    const state = get();
    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return null;

    const { current, best } = calculateStreak(state.habitLogs, habitId, new Date());

    const monthStart = startOfMonth(state.selectedMonth);
    const monthEnd = endOfMonth(state.selectedMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const completedThisMonth = daysInMonth.filter((d) =>
      state.habitLogs.some((l) => l.habitId === habitId && l.date === format(d, "yyyy-MM-dd") && l.completed)
    ).length;

    return {
      ...habit,
      logs: state.habitLogs.filter((l) => l.habitId === habitId),
      currentStreak: current,
      bestStreak: best,
      monthCompletion: daysInMonth.length > 0 ? completedThisMonth / daysInMonth.length : 0,
    };
  },

  getHabitsWithLogs: () => get().habits.map((h) => get().getHabitWithLogs(h.id)!),

  getCompletionRate: (habitId) => get().getHabitWithLogs(habitId)?.monthCompletion || 0,

  getMonthlyCompletionRate: () => {
    const state = get();
    if (state.habits.length === 0) return 0;
    const rates = state.habits.map((h) => get().getCompletionRate(h.id));
    return rates.reduce((a, b) => a + b, 0) / rates.length;
  },

  getSleepData: () => get().sleepLogs,

  getNoteForDate: (date) => get().notes.find((n) => n.date === date) || null,

  getGoalsForDate: (date) => get().dailyGoals.filter((g) => g.date === date),

  getGoalsCompletionRate: (date) => {
    const goals = get().dailyGoals.filter((g) => g.date === date);
    if (goals.length === 0) return 0;
    return goals.filter((g) => g.completed).length / goals.length;
  },

  getOverallStreak: () => {
    const state = get();
    if (state.habits.length === 0) return 0;
    const streaks = state.habits.map((h) => calculateStreak(state.habitLogs, h.id).current);
    return Math.min(...streaks);
  },
}));
