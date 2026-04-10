"use client";

import { useState, useCallback } from "react";
import { useHabitStore } from "@/store/habit-store";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
} from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Moon, BedDouble, Sun, CloudMoon, Zap, Minus, Plus } from "lucide-react";

const SLEEP_ICONS = [BedDouble, CloudMoon, Moon, Sun, Zap];
const QUALITY_LABELS = ["Terrible", "Poor", "Fair", "Good", "Excellent"];
const QUALITY_COLORS = [
  { bg: "bg-red-500", border: "border-red-300", text: "text-red-600", bgLight: "bg-red-50 dark:bg-red-950/40" },
  { bg: "bg-orange-500", border: "border-orange-300", text: "text-orange-600", bgLight: "bg-orange-50 dark:bg-orange-950/40" },
  { bg: "bg-yellow-500", border: "border-yellow-300", text: "text-yellow-600", bgLight: "bg-yellow-50 dark:bg-yellow-950/40" },
  { bg: "bg-lime-500", border: "border-lime-300", text: "text-lime-600", bgLight: "bg-lime-50 dark:bg-lime-950/40" },
  { bg: "bg-emerald-500", border: "border-emerald-300", text: "text-emerald-600", bgLight: "bg-emerald-50 dark:bg-emerald-950/40" },
];

export function SleepTracker() {
  const { sleepLogs, selectedMonth, selectedDate, logSleep } = useHabitStore();
  const [showInput, setShowInput] = useState(false);
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [sleepNote, setSleepNote] = useState("");

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const avgSleep =
    sleepLogs.length > 0
      ? Math.round((sleepLogs.reduce((sum, l) => sum + l.hours, 0) / sleepLogs.length) * 10) / 10
      : 0;

  const avgQuality =
    sleepLogs.length > 0
      ? Math.round((sleepLogs.reduce((sum, l) => sum + l.quality, 0) / sleepLogs.length) * 10) / 10
      : 0;

  const todayLog = sleepLogs.find((l) => l.date === format(new Date(), "yyyy-MM-dd"));

  const handleSave = async () => {
    await logSleep(selectedDate, sleepHours, sleepQuality, sleepNote || undefined);
    setShowInput(false);
  };

  const hoursDistribution = [0, 0, 0, 0, 0]; // 5h, 6h, 7h, 8h, 9h
  sleepLogs.forEach((log) => {
    const idx = Math.min(Math.max(log.hours - 5, 0), 4);
    hoursDistribution[idx]++;
  });
  const maxDist = Math.max(...hoursDistribution, 1);

  return (
    <Card className="overflow-hidden border-2 border-violet-300 dark:border-violet-700 shadow-lg">
      {/* Colorful Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <Moon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white font-bold">Sleep Tracker</CardTitle>
              <p className="text-[10px] text-violet-100">Track your rest quality</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/90">
            <span className="bg-white/15 px-2 py-0.5 rounded-md font-semibold backdrop-blur-sm">Avg: {avgSleep}h</span>
            <span className="bg-white/15 px-2 py-0.5 rounded-md font-semibold backdrop-blur-sm">{sleepLogs.length} logs</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Sleep distribution chart - colorful */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border border-violet-200 dark:border-violet-800">
          <div className="flex items-end gap-2 h-20 px-2">
            {[5, 6, 7, 8, 9].map((h, idx) => (
              <div key={h} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-violet-600 dark:text-violet-400">{hoursDistribution[idx]}</span>
                <motion.div
                  className={cn(
                    "w-full rounded-t-md shadow-sm",
                    h >= 8 ? "bg-gradient-to-t from-violet-600 to-violet-400" : h >= 7 ? "bg-gradient-to-t from-violet-500 to-purple-400" : "bg-gradient-to-t from-violet-300 to-purple-300"
                  )}
                  initial={{ height: 0 }}
                  animate={{
                    height: maxDist > 0 ? `${(hoursDistribution[idx] / maxDist) * 100}%` : "0%",
                  }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  style={{ minHeight: hoursDistribution[idx] > 0 ? "8px" : "2px" }}
                />
                <span className="text-[10px] font-bold text-violet-500">{h}h</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly sleep heatmap - colorful */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 border border-purple-200 dark:border-purple-800">
          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const dateStr = format(day, "yyyy-MM-dd");
              const log = sleepLogs.find((l) => l.date === dateStr);
              const today = isToday(day);

              return (
                <motion.button
                  key={dateStr}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => {
                    if (log) {
                      setSleepHours(log.hours);
                      setSleepQuality(log.quality);
                      setSleepNote(log.note || "");
                    } else {
                      setSleepHours(7);
                      setSleepQuality(3);
                      setSleepNote("");
                    }
                    setShowInput(!showInput);
                  }}
                  className={cn(
                    "aspect-square rounded-md text-[8px] font-bold flex items-center justify-center transition-all shadow-sm",
                    today && "ring-2 ring-violet-400 ring-offset-1",
                    log
                      ? log.hours >= 7
                        ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-md"
                        : log.hours >= 6
                        ? "bg-gradient-to-br from-violet-400 to-purple-400 text-white"
                        : "bg-gradient-to-br from-violet-300 to-purple-300 text-white"
                      : "bg-white/50 dark:bg-gray-800/50 text-muted-foreground/30 border border-violet-100 dark:border-violet-900"
                  )}
                  title={log ? `${log.hours}h - ${QUALITY_LABELS[log.quality - 1]}` : "No data"}
                >
                  {log ? log.hours : format(day, "d")}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Log sleep input - colorful */}
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-2 border-violet-300 dark:border-violet-700 rounded-xl p-4 space-y-4 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 shadow-md"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-violet-700 dark:text-violet-300">Hours of Sleep</span>
                <span className="text-sm font-black bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">{sleepHours}h</span>
              </div>
              <Slider
                value={[sleepHours]}
                onValueChange={(v) => setSleepHours(v[0])}
                min={3}
                max={12}
                step={1}
                className="[&_[role=slider]]:bg-violet-500"
              />
              <div className="flex justify-between text-[9px] text-muted-foreground font-medium">
                <span>3h</span>
                <span>12h</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-bold text-violet-700 dark:text-violet-300">Quality</span>
              <div className="flex gap-1.5">
                {QUALITY_LABELS.map((label, idx) => {
                  const QualityIcon = SLEEP_ICONS[idx];
                  const colors = QUALITY_COLORS[idx];
                  const isSelected = sleepQuality === idx + 1;
                  return (
                    <button
                      key={label}
                      onClick={() => setSleepQuality(idx + 1)}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all text-[9px] shadow-sm",
                        isSelected
                          ? cn(colors.bgLight, colors.border, colors.text)
                          : "border-transparent bg-white/50 dark:bg-gray-800/50 hover:bg-muted"
                      )}
                    >
                      <QualityIcon
                        className={cn(
                          "h-4 w-4",
                          isSelected ? colors.text : "text-muted-foreground"
                        )}
                      />
                      <span className={cn("font-bold", isSelected ? colors.text : "text-muted-foreground")}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Textarea
              value={sleepNote}
              onChange={(e) => setSleepNote(e.target.value)}
              placeholder="How did you sleep? (optional)"
              className="text-sm min-h-[60px] border-violet-200 dark:border-violet-800 focus:border-violet-500"
            />

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInput(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold shadow-md"
              >
                Save Sleep
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
