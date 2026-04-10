"use client";

import { useState } from "react";
import { useHabitStore } from "@/store/habit-store";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { StickyNote, Plus, ChevronRight, Calendar, BookOpen, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function NotesSection() {
  const { notes, selectedMonth, selectedDate, saveNote } = useHabitStore();
  const [showInput, setShowInput] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const currentNote = notes.find((n) => n.date === selectedDate);
  const notesWithContent = notes.filter((n) => n.content && n.content.trim().length > 0);

  const handleSave = async () => {
    await saveNote(selectedDate, noteContent);
    toast.success("Note saved!");
    setShowInput(false);
    setNoteContent("");
  };

  return (
    <Card className="overflow-hidden border-2 border-amber-300 dark:border-amber-700 shadow-lg">
      {/* Colorful Header */}
      <CardHeader className="pb-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-base text-white font-bold">Notes & Reflections</CardTitle>
              <p className="text-[10px] text-amber-100">Journal your thoughts</p>
            </div>
          </div>
          <span className="bg-white/15 px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-white backdrop-blur-sm">
            {notesWithContent.length} entries
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-4">
        {/* Current note - colorful card */}
        <div className="border-2 border-amber-200 dark:border-amber-800 rounded-xl p-3.5 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center">
                <Calendar className="h-3 w-3 text-white" />
              </div>
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                {format(new Date(selectedDate), "MMM d, yyyy")}
              </span>
              {isToday(new Date(selectedDate)) && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[10px] font-bold shadow-sm">
                  Today
                </span>
              )}
            </div>
          </div>

          {showInput ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="What's on your mind today? Reflect on your progress..."
                className="text-sm min-h-[80px] resize-none border-amber-300 dark:border-amber-700 focus:border-amber-500 bg-white dark:bg-gray-900"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setShowInput(false); setNoteContent(""); }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md"
                >
                  Save Note
                </Button>
              </div>
            </motion.div>
          ) : (
            <div
              onClick={() => {
                setNoteContent(currentNote?.content || "");
                setShowInput(true);
              }}
              className="cursor-pointer text-sm text-amber-900/60 dark:text-amber-100/60 hover:text-amber-900 dark:hover:text-amber-100 transition-colors min-h-[40px] rounded-lg p-2 hover:bg-white/50 dark:hover:bg-gray-900/50"
            >
              {currentNote?.content && currentNote.content.trim() ? (
                <p className="line-clamp-3 whitespace-pre-wrap">{currentNote.content}</p>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <p className="italic text-amber-600/70 dark:text-amber-400/70">Click to add a note for this day...</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notes list - colorful */}
        {notesWithContent.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <div className="w-1 h-4 rounded-full bg-gradient-to-b from-amber-400 to-orange-400" />
              This Month
            </h4>
            <ScrollArea className="max-h-52">
              <div className="space-y-1.5">
                {notesWithContent
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl border border-amber-200/60 dark:border-amber-800/60 bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/20 hover:from-amber-50 dark:hover:from-amber-950/40 transition-all cursor-pointer group shadow-sm"
                      onClick={() => {
                        setNoteContent(note.content);
                        setShowInput(true);
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 mt-1.5 flex-shrink-0 shadow-sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mb-0.5">
                          {format(new Date(note.date), "MMM d")}
                        </div>
                        <p className="text-xs line-clamp-2 text-foreground/80 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-amber-400 opacity-0 group-hover:opacity-100 mt-1.5 flex-shrink-0 transition-opacity" />
                    </motion.div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
