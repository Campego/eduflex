import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    // Delete all existing data
    await Promise.all([
      db.delete(schema.userProgress),
      db.delete(schema.challenges),
      db.delete(schema.units),
      db.delete(schema.lessons),
      db.delete(schema.courses),
      db.delete(schema.challengeOptions),
      db.delete(schema.userSubscription),
    ]);

    const courses = await db
      .insert(schema.courses)
      .values([{ title: "Lectura y Escritura Lúdica", imageSrc: "/img/lectura.svg" }])
      .returning();

    for (const course of courses) {
      const units = await db
        .insert(schema.units)
        .values([
          {
            courseId: course.id,
            title: "Unidad 1",
            description: "Comprensión de cuentos cortos",
            order: 1,
          },
        ])
        .returning();

      for (const unit of units) {
        const lessons = await db
          .insert(schema.lessons)
          .values([
            { unitId: unit.id, title: "La carta perdida", order: 1 },
            { unitId: unit.id, title: "El viaje de Sofía", order: 2 },
          ])
          .returning();

        for (const lesson of lessons) {
          const challenges = await db
            .insert(schema.challenges)
            .values([
              {
                lessonId: lesson.id,
                type: "SELECT",
                question: "¿Qué hizo Sofía cuando encontró el mapa?",
                order: 1,
              },
              {
                lessonId: lesson.id,
                type: "ASSIST",
                question: "¿Cómo reaccionó Juan al ver la carta?",
                order: 2,
              },
            ])
            .returning();

          for (const challenge of challenges) {
            if (challenge.order === 1) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "Se preparó para una aventura",
                  imageSrc: "/img/aventura.svg",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "Lo rompió en pedazos",
                  imageSrc: "/img/romper.svg",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "Lo escondió en su mochila",
                  imageSrc: "/img/mochila.svg",
                },
              ]);
            }

            if (challenge.order === 2) {
              await db.insert(schema.challengeOptions).values([
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "Se puso triste",
                  audioSrc: "/audios/triste.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: true,
                  text: "Se sorprendió mucho",
                  audioSrc: "/audios/sorprendido.mp3",
                },
                {
                  challengeId: challenge.id,
                  correct: false,
                  text: "Ignoró la carta",
                  audioSrc: "/audios/ignorar.mp3",
                },
              ]);
            }
          }
        }
      }
    }
    console.log("Database seeded successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

void main();
