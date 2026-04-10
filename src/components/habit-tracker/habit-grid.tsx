"use client";

import { useHabitStore } from "@/store/habit-store";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay,
  startOfWeek,
  getDay,
} from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dumbbell,
  BookOpen,
  Brain,
  Droplets,
  Moon,
  Heart,
  Pencil,
  Music,
  Salad,
  Smile,
  Code,
  Camera,
  Bike,
  TreePine,
  Coffee,
  Clock,
  Target,
  Sparkles,
  Palette,
  Languages,
  CircleDot,
  Flame,
} from "lucide-react";
import { useState } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  Dumbbell, BookOpen, Brain, Droplets, Moon, Heart, Pencil, Music,
  Salad, Smile, Code, Camera, Bike, TreePine, Coffee, Clock,
  Target, Sparkles, Palette, Languages, CircleDot,
};

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] || CircleDot;
}

function getStreakColor(streak: number): string {
  if (streak >= 30) return "text-orange-500";
  if (streak >= 14) return "text-amber-500";
  if (streak >= 7) return "text-yellow-500";
  if (streak >= 3) return "text-lime-500";
  return "text-muted-foreground";
}

export function HabitGrid() {
  const {
    habits,
    habitLogs,
    selectedMonth,
    selectedDate,
    setSelectedDate,
    toggleHabitLog,
  } = useHabitStore();

  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculate week start offset
  const firstDayOfWeek = getDay(monthStart);
  const weekStart = startOfWeek(monthStart);

  // Get day labels (Mon, Tue, etc.)
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const adjustedFirstDay = (firstDayOfWeek + 6) % 7; // Adjust for Monday start

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-rose-100 dark:from-orange-950 dark:to-rose-950 flex items-center justify-center mb-4"
        >
          <Target className="h-8 w-8 text-orange-500" />
        </motion.div>
        <h3 className="text-lg font-semibold mb-1">No habits yet</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Add your first habit using the + button below to start tracking your progress!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Day labels */}
      <div className="flex items-center gap-1 pl-[140px] sm:pl-[180px]">
        {dayLabels.map((day, i) => (
          <div
            key={day}
            className={cn(
              "text-[10px] font-medium text-muted-foreground flex-shrink-0",
              i === 5 || i === 6 ? "text-orange-400/60" : ""
            )}
            style={{ width: `${100 / 7}%` }}
          >
            <div className="text-center">{day}</div>
          </div>
        ))}
      </div>

      {/* Habit rows */}
      <div className="space-y-1.5">
        {habits.map((habit, habitIndex) => {
          const Icon = getIcon(habit.icon);
          const completedDays = habitLogs.filter(
            (l) => l.habitId === habit.id && l.completed
          ).length;
          const completionRate =
            daysInMonth.length > 0
              ? Math.round((completedDays / daysInMonth.length) * 100)
              : 0;

          return (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: habitIndex * 0.05 }}
              className="group flex items-center gap-1 hover:bg-muted/30 rounded-lg px-1 py-1 transition-colors"
            >
              {/* Habit info */}
              <div className="flex items-center gap-2 flex-shrink-0 w-[136px] sm:w-[176px]">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${habit.color}15` }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: habit.color }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">{habit.name}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">
                      {completionRate}%
                    </span>
                    {completedDays > 0 && (
                      <Flame
                        className={cn("h-2.5 w-2.5", getStreakColor(completedDays))}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Day cells */}
              <div className="flex-1 flex gap-[2px]">
                {/* Empty cells for offset */}
                {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    style={{ width: `${100 / 7}%` }}
                    className="flex-shrink-0"
                  />
                ))}

                {daysInMonth.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const log = habitLogs.find(
                    (l) => l.habitId === habit.id && l.date === dateStr
                  );
                  const isCompleted = log?.completed || false;
                  const isSelected = dateStr === selectedDate;
                  const today = isToday(day);

                  return (
                    <motion.button
                      key={dateStr}
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleHabitLog(habit.id, dateStr)}
                      onMouseEnter={() => setHoveredDay(dateStr)}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={cn(
                        "flex-shrink-0 aspect-square rounded-md transition-all duration-200 flex items-center justify-center",
                        isCompleted
                          ? "shadow-sm"
                          : "hover:bg-muted/50",
                        today && !isCompleted && "ring-1 ring-primary/20",
                        isSelected && "ring-2 ring-primary"
                      )}
                      style={{
                        width: `${100 / 7}%`,
                        backgroundColor: isCompleted ? habit.color : undefined,
                      }}
                    >
                      <span
                        className={cn(
                          "text-[9px] leading-none font-medium",
                          isCompleted ? "text-white" : "text-muted-foreground/40",
                          today && !isCompleted && "text-primary/60"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Date legend */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-primary/10 ring-1 ring-primary/30" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted-foreground/20" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-orange-500" />
            <span>Done</span>
          </div>
        </div>
        <span>{daysInMonth.length} days</span>
      </div>
    </div>
  );
}
