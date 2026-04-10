import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // format: yyyy-MM

    if (!month) {
      return NextResponse.json({ error: "Month parameter required" }, { status: 400 });
    }

    // Get all logs for this month (prefixed with month string)
    const logs = await db.habitLog.findMany({
      where: {
        date: {
          startsWith: month,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching habit logs:", error);
    return NextResponse.json({ error: "Failed to fetch habit logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { habitId, date, completed } = body;

    if (!habitId || !date) {
      return NextResponse.json(
        { error: "habitId and date are required" },
        { status: 400 }
      );
    }

    // Upsert the log
    const log = await db.habitLog.upsert({
      where: {
        habitId_date: { habitId, date },
      },
      update: { completed },
      create: { habitId, date, completed },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error toggling habit log:", error);
    return NextResponse.json({ error: "Failed to toggle habit log" }, { status: 500 });
  }
}
