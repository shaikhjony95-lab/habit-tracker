"use client";

import { useHabitStore } from "@/store/habit-store";
import { format, addMonths, subMonths } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Settings,
  Flame,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { profile, selectedMonth, setSelectedMonth, updateProfile, habits, getMonthlyCompletionRate } =
    useHabitStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || "User");
  const [editMotivation, setEditMotivation] = useState(
    profile?.motivationalText || "BE CONSISTENT"
  );

  const completionRate = getMonthlyCompletionRate();
  const totalHabits = habits.length;

  const handleSave = async () => {
    await updateProfile({ name: editName, motivationalText: editMotivation });
    setIsEditing(false);
  };

  const monthLabel = format(selectedMonth, "MMMM yyyy").toUpperCase();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-orange-200/50 dark:border-orange-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Top row: Profile & Settings */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm shadow-md"
              whileHover={{ scale: 1.08, rotate: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              {(profile?.name || "U").charAt(0).toUpperCase()}
            </motion.div>
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex flex-col gap-1"
                >
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-7 text-sm font-semibold w-40"
                    placeholder="Your name"
                    autoFocus
                  />
                  <Input
                    value={editMotivation}
                    onChange={(e) => setEditMotivation(e.target.value)}
                    className="h-6 text-xs text-muted-foreground w-48"
                    placeholder="Motivational text"
                  />
                  <div className="flex gap-1">
                    <Button size="sm" onClick={handleSave} className="h-6 text-xs px-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:from-orange-600 hover:to-rose-600">
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="h-6 text-xs px-2"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col"
                >
                  <span className="font-semibold text-sm">
                    {profile?.name || "User"}
                  </span>
                  <span className="text-xs font-bold tracking-widest bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {profile?.motivationalText || "BE CONSISTENT"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-3 mr-4">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="font-medium text-orange-600 dark:text-orange-400">{Math.round(completionRate * 100)}%</span>
                <span>done</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-medium text-amber-600 dark:text-amber-400">{totalHabits}</span>
                <span>habits</span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-orange-100 dark:hover:bg-orange-950"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-orange-100 dark:hover:bg-orange-950"
            onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-rose-500 to-violet-500 bg-clip-text text-transparent">
            {monthLabel}
          </h1>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-orange-100 dark:hover:bg-orange-950"
            onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
