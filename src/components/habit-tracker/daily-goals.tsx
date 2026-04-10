"use client";

import { useState } from "react";
import { useHabitStore } from "@/store/habit-store";
import { format, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ListTodo,
  Plus,
  Trash2,
  Calendar,
  Flame,
  Star,
  Target,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Minus,
  ArrowDown,
  CheckCircle2,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { addDays, subDays } from "date-fns";
import { toast } from "sonner";

type Priority = "high" | "medium" | "low";

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; border: string; badge: string; icon: React.ElementType }> = {
  high: {
    label: "High",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/40 dark:to-rose-950/30",
    border: "border-red-300 dark:border-red-700",
    badge: "bg-red-500 text-white",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-yellow-950/30",
    border: "border-amber-300 dark:border-amber-700",
    badge: "bg-amber-500 text-white",
    icon: Minus,
  },
  low: {
    label: "Low",
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-gradient-to-r from-sky-50 to-cyan-50 dark:from-sky-950/40 dark:to-cyan-950/30",
    border: "border-sky-300 dark:border-sky-700",
    badge: "bg-sky-500 text-white",
    icon: ArrowDown,
  },
};

export function DailyGoalsSection() {
  const {
    dailyGoals,
    selectedDate,
    setSelectedDate,
    addGoal,
    toggleGoal,
    deleteGoal,
    getGoalsCompletionRate,
  } = useHabitStore();

  const [newGoalText, setNewGoalText] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const today = format(new Date(), "yyyy-MM-dd");

  const goalsForDate = dailyGoals.filter((g) => g.date === selectedDate);
  const completedCount = goalsForDate.filter((g) => g.completed).length;
  const totalCount = goalsForDate.length;
  const completionRate = getGoalsCompletionRate(selectedDate);

  // Sort goals: incomplete first (high > medium > low), then completed
  const sortedGoals = [...goalsForDate].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aP = (a.priority as Priority) || "medium";
    const bP = (b.priority as Priority) || "medium";
    return priorityOrder[aP] - priorityOrder[bP];
  });

  const handleAddGoal = async () => {
    const text = newGoalText.trim();
    if (!text) {
      toast.error("Please enter a task");
      return;
    }
    await addGoal(selectedDate, text, selectedPriority);
    setNewGoalText("");
    setSelectedPriority("medium");
    toast.success("Task added!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddGoal();
  };

  const navigateDate = (direction: number) => {
    const current = new Date(selectedDate);
    const next = direction > 0 ? addDays(current, 1) : subDays(current, 1);
    setSelectedDate(format(next, "yyyy-MM-dd"));
  };

  const isTodayView = selectedDate === today;

  const getProgressColor = () => {
    if (completionRate >= 1) return "from-emerald-500 to-green-400";
    if (completionRate >= 0.5) return "from-amber-500 to-yellow-400";
    return "from-red-400 to-orange-400";
  };

  return (
    <Card className="overflow-hidden border-2 border-emerald-300 dark:border-emerald-700 shadow-lg">
      {/* Colorful Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white font-bold">To Do List / Daily Goals</CardTitle>
              <p className="text-[10px] text-emerald-100">Plan your day, crush your goals</p>
            </div>
          </div>
          <Badge
            className="text-[10px] px-2.5 py-0.5 font-bold bg-white/20 text-white border border-white/30 backdrop-blur-sm"
          >
            {completedCount}/{totalCount} done
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Date navigation - colorful bar */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-600"
            onClick={() => navigateDate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-teal-500" />
            <span className="font-bold text-teal-700 dark:text-teal-300">
              {format(new Date(selectedDate), "EEEE, MMM d")}
            </span>
            {isTodayView && (
              <span className="px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-[9px] font-bold shadow-sm animate-pulse">
                TODAY
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-teal-100 dark:hover:bg-teal-900 text-teal-600"
            onClick={() => navigateDate(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress bar - colorful */}
        {totalCount > 0 && (
          <div className="space-y-1.5 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex justify-between text-[11px]">
              <span className="text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                {completionRate >= 1 ? "All done! Amazing work!" : `${completedCount} of ${totalCount} completed`}
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">{Math.round(completionRate * 100)}%</span>
            </div>
            <div className="h-3 bg-white dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className={cn("h-full rounded-full bg-gradient-to-r", getProgressColor())}
                initial={{ width: 0 }}
                animate={{ width: `${completionRate * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            {completionRate >= 1 && totalCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">Everything completed!</span>
                <Sparkles className="h-3.5 w-3.5" />
              </motion.div>
            )}
          </div>
        )}

        {/* Goals list */}
        <div className="space-y-2 min-h-[120px]">
          <AnimatePresence mode="popLayout">
            {sortedGoals.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 flex items-center justify-center mb-4 shadow-inner">
                  <Target className="h-8 w-8 text-emerald-500" />
                </div>
                <p className="text-sm font-semibold text-foreground">No tasks yet</p>
                <p className="text-xs text-muted-foreground mt-1.5 max-w-[200px]">
                  Add your daily tasks below to start being productive!
                </p>
              </motion.div>
            ) : (
              sortedGoals.map((goal, idx) => {
                const priority = (goal.priority as Priority) || "medium";
                const config = PRIORITY_CONFIG[priority];
                const PriorityIcon = config.icon;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "group flex items-center gap-3 p-3 rounded-xl border-2 transition-all shadow-sm",
                      goal.completed
                        ? "bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-emerald-300 dark:border-emerald-700"
                        : cn(config.bg, config.border)
                    )}
                  >
                    <Checkbox
                      checked={goal.completed}
                      onCheckedChange={() => toggleGoal(goal.id)}
                      className="h-5 w-5 border-2 border-emerald-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-sm transition-all block",
                          goal.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground font-medium"
                        )}
                      >
                        {goal.text}
                      </span>
                    </div>
                    {!goal.completed && (
                      <Badge
                        className={cn("text-[9px] px-1.5 py-0 h-5 font-semibold flex items-center gap-0.5", config.badge)}
                      >
                        <PriorityIcon className="h-2.5 w-2.5" />
                        {config.label}
                      </Badge>
                    )}
                    {goal.completed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </motion.div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Add goal input - colorful */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-950/50 dark:to-gray-950/50 border-2 border-gray-200 dark:border-gray-700">
          {/* Priority selector */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Priority:</span>
            <div className="flex gap-1.5">
              {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
                const config = PRIORITY_CONFIG[p];
                const Icon = config.icon;
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPriority(p)}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border",
                      selectedPriority === p
                        ? cn(config.bg, config.border, config.color, "shadow-sm")
                        : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-muted-foreground"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <Input
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a new task..."
                className="pl-9 h-10 border-2 border-emerald-200 dark:border-emerald-800 focus:border-emerald-500 dark:focus:border-emerald-500 bg-white dark:bg-gray-900"
              />
            </div>
            <Button
              onClick={handleAddGoal}
              className="h-10 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
