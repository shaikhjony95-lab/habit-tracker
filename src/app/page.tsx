"use client";

import { useEffect, useRef, useState } from "react";
import { useHabitStore } from "@/store/habit-store";
import { Header } from "@/components/habit-tracker/header";
import { HabitGrid } from "@/components/habit-tracker/habit-grid";
import { HabitManager } from "@/components/habit-tracker/habit-manager";
import { SleepTracker } from "@/components/habit-tracker/sleep-tracker";
import { NotesSection } from "@/components/habit-tracker/notes-section";
import { DailyGoalsSection } from "@/components/habit-tracker/daily-goals";
import { AnalyticsPanel } from "@/components/habit-tracker/analytics-panel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ProgressRing } from "@/components/habit-tracker/progress-ring";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Grid3X3,
  BarChart3,
  StickyNote,
  Moon,
  Sparkles,
  Flame,
  Target,
  ListTodo,
} from "lucide-react";

export default function HabitTrackerPage() {
  const {
    isLoading,
    fetchAllData,
    selectedMonth,
    getMonthlyCompletionRate,
    habits,
    getOverallStreak,
    activeTab,
    setActiveTab,
    getGoalsCompletionRate,
    selectedDate,
  } = useHabitStore();

  const [mounted, setMounted] = useState(false);
  const initialFetchRef = useRef(false);

  useEffect(() => {
    if (!initialFetchRef.current) {
      initialFetchRef.current = true;
      const timeout = setTimeout(() => setMounted(true), 2000);
      fetchAllData(new Date())
        .catch(() => {})
        .finally(() => {
          clearTimeout(timeout);
          setMounted(true);
        });
    }
  }, [fetchAllData]);

  const completionRate = getMonthlyCompletionRate();
  const streak = getOverallStreak();
  const goalsRate = getGoalsCompletionRate(selectedDate);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50/40 via-background to-rose-50/30 dark:from-gray-950 dark:via-background dark:to-gray-950">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
        {/* Quick Stats Bar — Colorful Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-3 sm:p-4 border-2 border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/30 shadow-sm">
              <div className="flex items-center gap-3">
                <ProgressRing
                  progress={completionRate}
                  size={46}
                  strokeWidth={4}
                  color="#f97316"
                  showLabel={false}
                />
                <div>
                  <div className="text-lg sm:text-xl font-bold text-orange-700 dark:text-orange-400">
                    {Math.round(completionRate * 100)}%
                  </div>
                  <div className="text-[10px] text-orange-600/70 dark:text-orange-500/50 font-medium">Monthly</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-3 sm:p-4 border-2 border-rose-200 dark:border-rose-900 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/30 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-sm">
                  <Flame
                    className={cn(
                      "h-5 w-5",
                      streak >= 3 ? "text-white" : "text-white/30"
                    )}
                  />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-rose-700 dark:text-rose-400">{streak}</div>
                  <div className="text-[10px] text-rose-600/70 dark:text-rose-500/50 font-medium">Day Streak</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-3 sm:p-4 border-2 border-violet-200 dark:border-violet-900 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/30 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-violet-700 dark:text-violet-400">{habits.length}</div>
                  <div className="text-[10px] text-violet-600/70 dark:text-violet-500/50 font-medium">Habits</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-3 sm:p-4 border-2 border-emerald-200 dark:border-emerald-900 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm">
                  <ListTodo className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {Math.round(goalsRate * 100)}%
                  </div>
                  <div className="text-[10px] text-emerald-600/70 dark:text-emerald-500/50 font-medium">Today&apos;s Goals</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs — Colorful */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full h-auto p-1 bg-muted/50 grid grid-cols-5 rounded-xl">
            <TabsTrigger
              value="goals"
              className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white data-[state=active]:shadow-sm h-9 gap-1 rounded-lg font-medium"
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">To Do</span>
            </TabsTrigger>
            <TabsTrigger
              value="grid"
              className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm h-9 gap-1 rounded-lg font-medium"
            >
              <Grid3X3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </TabsTrigger>
            <TabsTrigger
              value="sleep"
              className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-sm h-9 gap-1 rounded-lg font-medium"
            >
              <Moon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-sm h-9 gap-1 rounded-lg font-medium"
            >
              <StickyNote className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-sm h-9 gap-1 rounded-lg font-medium"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stats</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="mt-0">
            <DailyGoalsSection />
          </TabsContent>

          <TabsContent value="grid" className="mt-0">
            <Card className="border-2 border-orange-300 dark:border-orange-700 overflow-hidden shadow-lg">
              <CardContent className="p-3 sm:p-4 overflow-x-auto">
                <HabitGrid />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep" className="mt-0">
            <SleepTracker />
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
            <NotesSection />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 px-4 mt-auto bg-gradient-to-r from-orange-50/50 via-background to-rose-50/50 dark:from-gray-950 dark:via-background dark:to-gray-950">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-medium">Habit Tracker — {format(selectedMonth, "MMMM yyyy")}</span>
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Built with consistency in mind
          </span>
        </div>
      </footer>

      {/* Floating Add Button */}
      <HabitManager />
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50/40 via-background to-rose-50/30">
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Card className="p-6">
            <Skeleton className="h-64 w-full rounded-lg" />
          </Card>
        </div>
      </div>
    </div>
  );
}
