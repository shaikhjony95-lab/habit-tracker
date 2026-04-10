import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // format: yyyy-MM

    if (!month) {
      return NextResponse.json({ error: "Month parameter required" }, { status: 400 });
    }

    const logs = await db.sleepLog.findMany({
      where: {
        date: {
          startsWith: month,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching sleep logs:", error);
    return NextResponse.json({ error: "Failed to fetch sleep logs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, hours, quality, note } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const sleepLog = await db.sleepLog.upsert({
      where: { date },
      update: {
        ...(hours !== undefined && { hours }),
        ...(quality !== undefined && { quality }),
        ...(note !== undefined && { note }),
      },
      create: {
        date,
        hours: hours ?? 7,
        quality: quality ?? 3,
        note: note || null,
      },
    });

    return NextResponse.json(sleepLog);
  } catch (error) {
    console.error("Error logging sleep:", error);
    return NextResponse.json({ error: "Failed to log sleep" }, { status: 500 });
  }
}
