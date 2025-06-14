import { NextResponse } from "next/server";
import { userAttempts } from "@/db/schema";
import db from "@/db/drizzle";

export async function POST(req: Request) {
  try {
    const { questionId, isCorrect, answerJson } = await req.json();

    if (!questionId || typeof isCorrect !== "boolean" || !answerJson) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 🔒 Reemplaza esto con el ID real del usuario si usas Clerk/Auth
    const userId = "demo-user";

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
