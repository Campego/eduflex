import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import db from "@/db/drizzle";
import { userAttempts } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      questionId: number;
      isCorrect: boolean;
      answerJson: string;
    };

    const { questionId, isCorrect, answerJson } = body;

    if (!questionId || typeof isCorrect !== "boolean" || !answerJson) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await db.insert(userAttempts).values({
      userId,
      questionId,
      isCorrect,
      answerJson,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUBMIT_ATTEMPT_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
