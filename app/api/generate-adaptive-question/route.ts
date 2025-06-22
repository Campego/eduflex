import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs";

import db from "@/db/drizzle";
import { topics, generatedQuestions } from "@/db/schema";
import crypto from "crypto";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { topicId }: { topicId: number } = await req.json();
    if (!topicId)
      return NextResponse.json({ error: "Missing topicId" }, { status: 400 });

    // Obtener el contenido teórico del tema
    const topic = await db.query.topics.findFirst({
      where: eq(topics.id, topicId),
    });

    if (!topic)
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });

    const prompt = `
        Tu tarea es generar una pregunta de opción múltiple basada en este contenido teórico:

        ${topic.theoryMd}

        Genera una sola pregunta simple y clara con 4 alternativas. La primera debe ser la correcta.

        Formato estricto (en JSON):

        {
          "type": "SELECT",
          "question": "texto de la pregunta",
          "options": [
            { "text": "respuesta correcta", "correct": true },
            { "text": "respuesta falsa 1", "correct": false },
            { "text": "respuesta falsa 2", "correct": false },
            { "text": "respuesta falsa 3", "correct": false }
          ]
        }
        `;
      const promptHash = crypto.createHash("sha256").update(prompt).digest("hex");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "Eres un generador de preguntas tipo test para una app educativa.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(completion.choices[0].message.content ?? "{}");

    // Guardar la pregunta generada en la BD
    const inserted = await db
      .insert(generatedQuestions)
      .values({
        topicId,
        promptHash,  // puedes usar un hash real si deseas evitar repeticione
        contentJson: JSON.stringify(content),
        createdBy: userId, // puedes actualizar con el ID real del usuario si lo deseas
      })
      .returning();

    return NextResponse.json({
      ...inserted[0],
      ...content,
      topicId,
    });
  } catch (error) {
    console.error("[GENERATE_QUESTION_ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
