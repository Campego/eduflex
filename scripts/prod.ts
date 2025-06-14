import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database");

    await Promise.all([
      db.delete(schema.userAttempts),
      db.delete(schema.userTopicScores),
      db.delete(schema.challengeProgress),
      db.delete(schema.challengeOptions),
      db.delete(schema.challenges),
      db.delete(schema.topics),
      db.delete(schema.lessons),
      db.delete(schema.units),
      db.delete(schema.courses),
      db.delete(schema.userProgress),
      db.delete(schema.userSubscription),
    ]);

    const [course] = await db
      .insert(schema.courses)
      .values([{ title: "Curso básico de SCRUM", imageSrc: "/scrum.svg" }])
      .returning();

    const [unit] = await db
      .insert(schema.units)
      .values([
        {
          courseId: course.id,
          title: "Fundamentos de SCRUM",
          description: "Aprende qué es SCRUM y cómo se aplica",
          order: 1,
        },
      ])
      .returning();

    const lessons = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit.id, title: "Introducción a SCRUM", order: 1 },
        { unitId: unit.id, title: "Eventos en SCRUM", order: 2 },
        { unitId: unit.id, title: "Artefactos en SCRUM", order: 3 },
        { unitId: unit.id, title: "Planificación en SCRUM", order: 4 },
      ])
      .returning();

    // Lección 1: Introducción
    const [topic1] = await db
      .insert(schema.topics)
      .values([
        {
          lessonId: lessons[0].id,
          slug: "que-es-scrum",
          title: "¿Qué es SCRUM?",
          theoryMd:
            "SCRUM es un marco de trabajo ágil usado para desarrollar productos complejos.",
          order: 1,
        },
      ])
      .returning();

    const [challenge1] = await db
      .insert(schema.challenges)
      .values([
        {
          lessonId: lessons[0].id,
          topicId: topic1.id,
          type: "SELECT",
          question: "¿Qué es SCRUM?",
          order: 1,
        },
      ])
      .returning();

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challenge1.id,
        correct: true,
        text: "Un marco ágil para desarrollar productos",
      },
      {
        challengeId: challenge1.id,
        correct: false,
        text: "Un lenguaje de programación",
      },
      {
        challengeId: challenge1.id,
        correct: false,
        text: "Una herramienta de diseño gráfico",
      },
    ]);

    // Lección 2: Eventos
    const topics2 = await db
      .insert(schema.topics)
      .values([
        {
          lessonId: lessons[1].id,
          slug: "sprint",
          title: "¿Qué es un Sprint?",
          theoryMd:
            "Un Sprint es un período de tiempo en el que se crea un incremento utilizable del producto.",
          order: 1,
        },
        {
          lessonId: lessons[1].id,
          slug: "daily-scrum",
          title: "Daily Scrum",
          theoryMd:
            "El Daily Scrum es una reunión diaria de 15 minutos para sincronizar actividades.",
          order: 2,
        },
      ])
      .returning();

    const challenges2 = await db
      .insert(schema.challenges)
      .values([
        {
          lessonId: lessons[1].id,
          topicId: topics2[0].id,
          type: "SELECT",
          question: "¿Qué es un Sprint en SCRUM?",
          order: 1,
        },
        {
          lessonId: lessons[1].id,
          topicId: topics2[1].id,
          type: "SELECT",
          question: "¿Cuál es la duración recomendada del Daily Scrum?",
          order: 2,
        },
      ])
      .returning();

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challenges2[0].id,
        correct: true,
        text: "Un período en el que se crea un incremento del producto",
      },
      {
        challengeId: challenges2[0].id,
        correct: false,
        text: "Una reunión para planificación financiera",
      },
      {
        challengeId: challenges2[0].id,
        correct: false,
        text: "Una fase de prueba del software",
      },

      { challengeId: challenges2[1].id, correct: true, text: "15 minutos" },
      { challengeId: challenges2[1].id, correct: false, text: "1 hora" },
      { challengeId: challenges2[1].id, correct: false, text: "30 minutos" },
    ]);

    // Lección 3: Artefactos
    const topics3 = await db
      .insert(schema.topics)
      .values([
        {
          lessonId: lessons[2].id,
          slug: "sprint-backlog",
          title: "Sprint Backlog",
          theoryMd:
            "El Sprint Backlog es un conjunto de elementos del Product Backlog seleccionados para el Sprint.",
          order: 1,
        },
        {
          lessonId: lessons[2].id,
          slug: "incremento",
          title: "El Incremento",
          theoryMd:
            "El Incremento es la suma de todos los elementos completados durante un Sprint.",
          order: 2,
        },
      ])
      .returning();

    const challenges3 = await db
      .insert(schema.challenges)
      .values([
        {
          lessonId: lessons[2].id,
          topicId: topics3[0].id,
          type: "SELECT",
          question: "¿Qué contiene el Sprint Backlog?",
          order: 1,
        },
        {
          lessonId: lessons[2].id,
          topicId: topics3[1].id,
          type: "SELECT",
          question: "¿Qué representa el Incremento en SCRUM?",
          order: 2,
        },
      ])
      .returning();

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challenges3[0].id,
        correct: true,
        text: "Tareas seleccionadas del Product Backlog",
      },
      {
        challengeId: challenges3[0].id,
        correct: false,
        text: "Recursos humanos asignados",
      },
      {
        challengeId: challenges3[0].id,
        correct: false,
        text: "Lista de errores del sistema",
      },

      {
        challengeId: challenges3[1].id,
        correct: true,
        text: "El resultado funcional del Sprint",
      },
      {
        challengeId: challenges3[1].id,
        correct: false,
        text: "La planificación del Sprint siguiente",
      },
      {
        challengeId: challenges3[1].id,
        correct: false,
        text: "El análisis de stakeholders",
      },
    ]);

    // Lección 4: Planificación
    const topics4 = await db
      .insert(schema.topics)
      .values([
        {
          lessonId: lessons[3].id,
          slug: "product-backlog",
          title: "Product Backlog",
          theoryMd:
            "El Product Backlog es una lista ordenada de todo lo que se necesita en el producto.",
          order: 1,
        },
        {
          lessonId: lessons[3].id,
          slug: "sprint-planning",
          title: "Sprint Planning",
          theoryMd:
            "La Sprint Planning define qué se va a entregar en el próximo Sprint y cómo se logrará.",
          order: 2,
        },
      ])
      .returning();

    const challenges4 = await db
      .insert(schema.challenges)
      .values([
        {
          lessonId: lessons[3].id,
          topicId: topics4[0].id,
          type: "SELECT",
          question: "¿Qué contiene el Product Backlog?",
          order: 1,
        },
        {
          lessonId: lessons[3].id,
          topicId: topics4[1].id,
          type: "SELECT",
          question: "¿Qué se hace en la Sprint Planning?",
          order: 2,
        },
      ])
      .returning();

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: challenges4[0].id,
        correct: true,
        text: "Lista ordenada de todo lo que se necesita en el producto",
      },
      {
        challengeId: challenges4[0].id,
        correct: false,
        text: "El presupuesto del proyecto",
      },
      {
        challengeId: challenges4[0].id,
        correct: false,
        text: "Los miembros del equipo de desarrollo",
      },

      {
        challengeId: challenges4[1].id,
        correct: true,
        text: "Se define qué se va a entregar en el Sprint y cómo se logrará",
      },
      {
        challengeId: challenges4[1].id,
        correct: false,
        text: "Se revisan las métricas del proyecto",
      },
      {
        challengeId: challenges4[1].id,
        correct: false,
        text: "Se capacita al equipo en nuevas herramientas",
      },
    ]);

    console.log("✅ Database seeded successfully");
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    throw error;
  }
};

void main();
