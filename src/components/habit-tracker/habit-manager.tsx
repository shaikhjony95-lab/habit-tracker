"use client";

import { useState } from "react";
import { useHabitStore } from "@/store/habit-store";
import { HABIT_ICONS, HABIT_COLORS, HABIT_CATEGORIES } from "@/types/habit";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Plus,
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
  PencilLine,
  Trash2,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ICON_MAP: Record<string, React.ElementType> = {
  Dumbbell, BookOpen, Brain, Droplets, Moon, Heart, Pencil, Music,
  Salad, Smile, Code, Camera, Bike, TreePine, Coffee, Clock,
  Target, Sparkles, Palette, Languages, CircleDot,
};

function getIcon(name: string): React.ElementType {
  return ICON_MAP[name] || CircleDot;
}

export function HabitManager() {
  const { habits, addHabit, updateHabit, deleteHabit } = useHabitStore();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Target");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [manageMode, setManageMode] = useState(false);

  const resetForm = () => {
    setName("");
    setSelectedIcon("Target");
    setSelectedColor(HABIT_COLORS[0]);
    setSelectedCategory("General");
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    if (editingId) {
      await updateHabit(editingId, {
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        category: selectedCategory,
      });
      toast.success("Habit updated!");
    } else {
      await addHabit({
        name: name.trim(),
        icon: selectedIcon,
        color: selectedColor,
        category: selectedCategory,
      });
      toast.success("Habit added!");
    }

    resetForm();
  };

  const startEdit = (habit: typeof habits[0]) => {
    setEditingId(habit.id);
    setName(habit.name);
    setSelectedIcon(habit.icon);
    setSelectedColor(habit.color);
    setSelectedCategory(habit.category);
    setManageMode(false);
  };

  const handleDelete = async (id: string) => {
    await deleteHabit(id);
    toast.success("Habit deleted");
  };

  return (
    <>
      {/* Floating Add Button */}
      {!open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <motion.div
              className="fixed bottom-6 right-6 z-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </motion.div>
          </DialogTrigger>
        </Dialog>
      )}

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="sm:max-w-md max-h-[85vh] p-0 gap-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg">
                {editingId ? "Edit Habit" : "New Habit"}
              </DialogTitle>
              {habits.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setManageMode(!manageMode)}
                  className="text-xs"
                >
                  {manageMode ? "Add New" : "Manage"}
                </Button>
              )}
            </div>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {manageMode ? (
              <motion.div
                key="manage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ScrollArea className="max-h-[60vh] px-6">
                  <div className="space-y-2 pb-6">
                    {habits.map((habit) => {
                      const Icon = getIcon(habit.icon);
                      return (
                        <div
                          key={habit.id}
                          className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${habit.color}15` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: habit.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{habit.name}</div>
                            <Badge variant="secondary" className="text-[10px] mt-0.5">
                              {habit.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => startEdit(habit)}
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete habit?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete &quot;{habit.name}&quot; and all its tracking
                                    data. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(habit.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                key="add"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="px-6 pb-6"
              >
                {/* Name input */}
                <div className="space-y-2 mb-5">
                  <Label className="text-sm">Habit Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Exercise"
                    className="h-10"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>

                {/* Icon selection */}
                <div className="space-y-2 mb-5">
                  <Label className="text-sm">Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {HABIT_ICONS.map((icon) => {
                      const Icon = getIcon(icon.name);
                      return (
                        <button
                          key={icon.name}
                          onClick={() => setSelectedIcon(icon.name)}
                          className={cn(
                            "h-10 rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 transition-all",
                            selectedIcon === icon.name
                              ? "border-primary bg-primary/5"
                              : "border-transparent bg-muted/50 hover:bg-muted"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4",
                              selectedIcon === icon.name
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span className="text-[8px] text-muted-foreground truncate max-w-full px-0.5">
                            {icon.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color selection */}
                <div className="space-y-2 mb-5">
                  <Label className="text-sm">Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {HABIT_COLORS.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all",
                          selectedColor === color
                            ? "ring-2 ring-offset-2 ring-offset-background"
                            : "ring-1 ring-transparent"
                        )}
                        style={{
                          backgroundColor: color,
                          ...(selectedColor === color && {
                            ringColor: color,
                          }),
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div className="space-y-2 mb-6">
                  <Label className="text-sm">Category</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {HABIT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-all",
                          selectedCategory === cat
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  onClick={handleSubmit}
                  className="w-full h-11 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-medium"
                >
                  {editingId ? "Update Habit" : "Add Habit"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
