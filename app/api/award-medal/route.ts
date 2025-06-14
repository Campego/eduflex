import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { medals } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { courseId, medalType } = await req.json();
    if (!courseId || !medalType) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await db.insert(medals).values({
      userId,
      courseId,
      medalType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AWARD_MEDAL_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
