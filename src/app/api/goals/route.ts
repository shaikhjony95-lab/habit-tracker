import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");

    if (!date && !month) {
      return NextResponse.json({ error: "date or month parameter required" }, { status: 400 });
    }

    const goals = await db.dailyGoal.findMany({
      where: date
        ? { date }
        : { date: { startsWith: month! } },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, text, completed } = body;

    if (!date || !text) {
      return NextResponse.json({ error: "date and text are required" }, { status: 400 });
    }

    // Get the highest sortOrder for this date
    const maxOrder = await db.dailyGoal.findFirst({
      where: { date },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const goal = await db.dailyGoal.create({
      data: {
        date,
        text: text.trim(),
        completed: completed ?? false,
        priority: body.priority ?? "medium",
        sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(goal, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, completed, text } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const goal = await db.dailyGoal.update({
      where: { id },
      data: {
        ...(completed !== undefined && { completed }),
        ...(text !== undefined && { text }),
        ...(body.priority !== undefined && { priority: body.priority }),
      },
    });

    return NextResponse.json(goal);
  } catch (error) {
    console.error("Error updating goal:", error);
    return NextResponse.json({ error: "Failed to update goal" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.dailyGoal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting goal:", error);
    return NextResponse.json({ error: "Failed to delete goal" }, { status: 500 });
  }
}
