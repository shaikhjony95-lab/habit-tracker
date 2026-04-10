import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const habits = await db.habit.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(habits);
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, icon, color, category } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Habit name is required" }, { status: 400 });
    }

    // Get the highest sortOrder
    const maxOrder = await db.habit.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const habit = await db.habit.create({
      data: {
        name: name.trim(),
        icon: icon || "CircleDot",
        color: color || "#f97316",
        category: category || "General",
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error("Error creating habit:", error);
    return NextResponse.json({ error: "Failed to create habit" }, { status: 500 });
  }
}
