import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { sql } from "drizzle-orm";

import { userTopicScores } from "@/db/schema";

type Body = { topicId: number; userId?: string; correct: boolean };

export async function POST(req: Request) {
  try {
    const { topicId, correct } = (await req.json()) as Body;
    // 🔒 si usas Clerk, aquí obtén userId desde la sesión
    const userId = "demo-user"; // <-- reemplaza por el real

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
