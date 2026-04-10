import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    let profile = await db.profile.findFirst();
    if (!profile) {
      profile = await db.profile.create({
        data: {
          name: "User",
          motivationalText: "BE CONSISTENT",
        },
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, motivationalText } = body;

    let profile = await db.profile.findFirst();
    if (!profile) {
      profile = await db.profile.create({
        data: {
          name: name || "User",
          motivationalText: motivationalText || "BE CONSISTENT",
        },
      });
    } else {
      profile = await db.profile.update({
        where: { id: profile.id },
        data: {
          ...(name !== undefined && { name }),
          ...(motivationalText !== undefined && { motivationalText }),
        },
      });
    }
    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
