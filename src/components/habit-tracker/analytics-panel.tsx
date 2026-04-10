"use client";

import { useHabitStore } from "@/store/habit-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "./progress-ring";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import {
  Flame,
  Trophy,
  TrendingUp,
  Target,
  Star,
  Award,
  Zap,
  Crown,
  BarChart3,
  Medal,
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
  unlocked: boolean;
}

export function AnalyticsPanel() {
  const {
    habits,
    habitLogs,
    sleepLogs,
    getHabitsWithLogs,
    getMonthlyCompletionRate,
    getOverallStreak,
  } = useHabitStore();

  const habitsWithLogs = getHabitsWithLogs();
  const completionRate = getMonthlyCompletionRate();
  const overallStreak = getOverallStreak();

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const daysPassed = daysInMonth.filter((d) => d <= new Date()).length;

  // Total completions
  const totalCompletions = habitLogs.filter((l) => l.completed).length;
  const totalPossible = habits.length * daysPassed;
  const overallRate = totalPossible > 0 ? totalCompletions / totalPossible : 0;

  // Best habit this month
  const bestHabit =
    habitsWithLogs.length > 0
      ? [...habitsWithLogs].sort((a, b) => b.monthCompletion - a.monthCompletion)[0]
      : null;

  // Average sleep
  const avgSleep =
    sleepLogs.length > 0
      ? (sleepLogs.reduce((sum, l) => sum + l.hours, 0) / sleepLogs.length).toFixed(1)
      : "—";

  // Achievements
  const achievements: Achievement[] = [
    {
      id: "first",
      title: "First Step",
      description: "Complete your first habit",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      borderColor: "border-amber-300 dark:border-amber-700",
      gradient: "from-amber-500 to-yellow-500",
      unlocked: totalCompletions >= 1,
    },
    {
      id: "week",
      title: "Week Warrior",
      description: "7-day streak on any habit",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/40",
      borderColor: "border-orange-300 dark:border-orange-700",
      gradient: "from-orange-500 to-red-500",
      unlocked: habitsWithLogs.some((h) => h.currentStreak >= 7),
    },
    {
      id: "perfect",
      title: "Perfect Day",
      description: "Complete all habits in a day",
      icon: Trophy,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      borderColor: "border-emerald-300 dark:border-emerald-700",
      gradient: "from-emerald-500 to-green-500",
      unlocked: habits.length > 0 && totalCompletions >= habits.length,
    },
    {
      id: "half",
      title: "Halfway Hero",
      description: "Reach 50% monthly completion",
      icon: Target,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50 dark:bg-cyan-950/40",
      borderColor: "border-cyan-300 dark:border-cyan-700",
      gradient: "from-cyan-500 to-teal-500",
      unlocked: completionRate >= 0.5,
    },
    {
      id: "streaker",
      title: "Streak Master",
      description: "14-day streak on any habit",
      icon: Zap,
      color: "text-rose-600",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
      borderColor: "border-rose-300 dark:border-rose-700",
      gradient: "from-rose-500 to-pink-500",
      unlocked: habitsWithLogs.some((h) => h.currentStreak >= 14),
    },
    {
      id: "legend",
      title: "Legend",
      description: "30-day streak on any habit",
      icon: Crown,
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-950/40",
      borderColor: "border-violet-300 dark:border-violet-700",
      gradient: "from-violet-500 to-purple-500",
      unlocked: habitsWithLogs.some((h) => h.currentStreak >= 30),
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-4">
      {/* Overview Cards - Colorful */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="p-4 text-center border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 shadow-md">
            <ProgressRing
              progress={completionRate}
              size={64}
              strokeWidth={5}
              color="#f97316"
              label="Monthly"
              className="mx-auto mb-2"
            />
            <div className="text-lg font-bold text-orange-700 dark:text-orange-400">{Math.round(completionRate * 100)}%</div>
            <div className="text-[10px] text-orange-600/70 dark:text-orange-500/50 font-semibold">Completion</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 text-center border-2 border-rose-300 dark:border-rose-700 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 shadow-md">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Flame className="h-8 w-8 text-white" />
            </div>
            <div className="text-lg font-bold text-rose-700 dark:text-rose-400">{overallStreak}</div>
            <div className="text-[10px] text-rose-600/70 dark:text-rose-500/50 font-semibold">Day Streak</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 text-center border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 shadow-md">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{totalCompletions}</div>
            <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500/50 font-semibold">Completions</div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 text-center border-2 border-violet-300 dark:border-violet-700 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/30 shadow-md">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="text-lg font-bold text-violet-700 dark:text-violet-400">{avgSleep}h</div>
            <div className="text-[10px] text-violet-600/70 dark:text-violet-500/50 font-semibold">Avg Sleep</div>
          </Card>
        </motion.div>
      </div>

      {/* Habit Breakdown - Colorful */}
      {habitsWithLogs.length > 0 && (
        <Card className="border-2 border-emerald-200 dark:border-emerald-800 overflow-hidden shadow-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-white" />
              </div>
              Habit Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {habitsWithLogs
              .sort((a, b) => b.monthCompletion - a.monthCompletion)
              .map((habit, idx) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-slate-50/80 to-transparent dark:from-slate-900/50"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: `${habit.color}20` }}
                  >
                    <span className="text-xs font-bold" style={{ color: habit.color }}>
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium truncate">{habit.name}</span>
                      <span className="text-xs font-bold ml-2" style={{ color: habit.color }}>
                        {Math.round(habit.monthCompletion * 100)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        className="h-full rounded-full shadow-sm"
                        style={{ backgroundColor: habit.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${habit.monthCompletion * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.05 }}
                      />
                    </div>
                  </div>
                  {habit.currentStreak > 0 && (
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-orange-500 flex-shrink-0 bg-orange-50 dark:bg-orange-950/30 px-1.5 py-0.5 rounded-md">
                      <Flame className="h-3 w-3" />
                      {habit.currentStreak}
                    </div>
                  )}
                </motion.div>
              ))}
          </CardContent>
        </Card>
      )}

      {/* Achievements - Colorful */}
      <Card className="border-2 border-amber-200 dark:border-amber-800 overflow-hidden shadow-md">
        <CardHeader className="pb-3 bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Trophy className="h-3.5 w-3.5 text-white" />
              </div>
              Achievements
            </CardTitle>
            <Badge className="text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
              {unlockedCount}/{achievements.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "flex flex-col items-center gap-1.5 p-3.5 rounded-xl border-2 text-center transition-all",
                    achievement.unlocked
                      ? cn(achievement.bgColor, achievement.borderColor, "shadow-sm")
                      : "bg-muted/20 border-muted/50 opacity-40 grayscale"
                  )}
                >
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shadow-sm",
                      achievement.unlocked
                        ? `bg-gradient-to-br ${achievement.gradient}`
                        : "bg-muted/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        achievement.unlocked ? "text-white" : "text-muted-foreground"
                      )}
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold">{achievement.title}</div>
                    <div className="text-[9px] text-muted-foreground leading-tight">
                      {achievement.description}
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <Badge className="text-[8px] px-1.5 py-0 h-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 font-bold">
                      Unlocked
                    </Badge>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
