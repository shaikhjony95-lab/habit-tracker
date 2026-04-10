import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // format: yyyy-MM

    if (!month) {
      return NextResponse.json({ error: "Month parameter required" }, { status: 400 });
    }

    const notes = await db.dailyNote.findMany({
      where: {
        date: {
          startsWith: month,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, content } = body;

    if (!date) {
      return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const note = await db.dailyNote.upsert({
      where: { date },
      update: { content: content || "" },
      create: {
        date,
        content: content || "",
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
