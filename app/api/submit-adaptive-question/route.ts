import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import db from "@/db/drizzle";
import { userAttempts } from "@/db/schema";

const bodySchema = z.object({
  questionId: z.number(),
  isCorrect: z.boolean(),
  answerJson: z.string(),
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const { questionId, isCorrect, answerJson } = parsed.data;

    await db.insert(userAttempts).values({
      userId,
      questionId,
      isCorrect,
      answerJson,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUBMIT_ADAPTIVE_QUESTION]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
