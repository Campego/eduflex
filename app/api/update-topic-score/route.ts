import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { sql } from "drizzle-orm";

import { userTopicScores } from "@/db/schema";
import { auth } from "@clerk/nextjs/server"; // ✅ Importa auth para rutas server

type Body = { topicId: number; correct: boolean };

export async function POST(req: Request) {
  try {
    const { topicId, correct } = (await req.json()) as Body;

    const { userId } = auth(); // ✅ Obtiene el userId real desde Clerk

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Upsert sencillo (1 fila por user+topic)
    const [{ id }] = await db
      .insert(userTopicScores)
      .values({
        userId,
        topicId,
        correct: correct ? 1 : 0,
        total: 1,
      })
      .onConflictDoUpdate({
        target: [userTopicScores.userId, userTopicScores.topicId],
        set: {
          correct: sql`${userTopicScores.correct} + ${correct ? 1 : 0}`,
          total: sql`${userTopicScores.total} + 1`,
        },
      })
      .returning({ id: userTopicScores.id })
      .execute();

    return NextResponse.json({ id });
  } catch (err) {
    console.error("update-topic-score error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
