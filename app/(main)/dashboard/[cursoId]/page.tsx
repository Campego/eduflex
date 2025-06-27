import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";

import db from "@/db/drizzle";
import { getUserProgress, getCourseById, getUnits } from "@/db/queries";
import {
  medals,
  userTopicScores,
  userAttempts,
} from "@/db/schema";

interface CourseDashboardPageProps {
  params: {
    cursoId: string;
  };
}

export default async function CourseDashboardPage({
  params,
}: CourseDashboardPageProps) {
  const userProgress = await getUserProgress();
  const course = await getCourseById(Number(params.cursoId));

  if (!userProgress || !course) return notFound();

  const allUnits = await getUnits();
  const courseUnits = allUnits.filter((unit) => unit.courseId === course.id);

  const totalLessons = courseUnits.flatMap((u) => u.lessons).length;
  const completedLessons = courseUnits
    .flatMap((u) => u.lessons)
    .filter((l) => l.completed).length;

  const completedPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  const totalChallenges = courseUnits.flatMap((u) =>
    u.lessons.flatMap((l) => l.challenges)
  ).length;

  const completedChallenges = courseUnits.flatMap((u) =>
    u.lessons.flatMap((l) =>
      l.challenges.filter(
        (challenge) =>
          challenge.challengeProgress?.length > 0 &&
          challenge.challengeProgress.every((p) => p.completed)
      )
    )
  ).length;

  const latestLesson = courseUnits
    .flatMap((u) => u.lessons)
    .findLast((l) => l.completed);
  const medal = await db.query.medals.findFirst({
    where: and(
      eq(medals.userId, userProgress.userId),
      eq(medals.courseId, course.id)
    ),
  });
  const earnedMedal = !!medal;

  const topicScores = await db.query.userTopicScores.findMany({
    where: eq(userTopicScores.userId, userProgress.userId),
    with: {
      topic: true,
    },
  });
  const weakestTopic = topicScores
    .filter((t) => t.total > 0)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];

  const courseTopicIds = new Set<number>();
  for (const unit of courseUnits) {
    for (const lesson of unit.lessons) {
      for (const challenge of lesson.challenges) {
        if (challenge.topicId != null) {
          courseTopicIds.add(challenge.topicId);
        }
      }
    }
  }

  const coveredTopics = topicScores.filter((score) =>
    courseTopicIds.has(score.topicId)
  );
  const totalCoveredTopics = coveredTopics.length;

  const adaptiveAttempts = await db.query.userAttempts.findMany({
    where: eq(userAttempts.userId, userProgress.userId),
    with: {
      question: true, // trae el generatedQuestion para filtrar por topicId
    },
  });

  // Filtrar solo los intentos de preguntas cuyos topics están en el curso actual
  const courseAdaptiveAttempts = adaptiveAttempts.filter((attempt) =>
    courseTopicIds.has(attempt.question.topicId)
  );

  const correctAdaptiveAttempts = courseAdaptiveAttempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  const adaptiveAccuracy =
    courseAdaptiveAttempts.length > 0
      ? Math.round(
          (correctAdaptiveAttempts / courseAdaptiveAttempts.length) * 100
        )
      : 0;

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Dashboard de {course.title}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded border p-4 shadow">
          <h2 className="mb-2 font-semibold">Lecciones completadas</h2>
          <p>
            {completedLessons} / {totalLessons} ({completedPercentage}%)
          </p>
        </div>

        <div className="rounded border p-4 shadow">
          <h2 className="mb-2 font-semibold">Medalla obtenida</h2>
          <p>{earnedMedal ? "Sí" : "No"}</p>
        </div>

        <div className="rounded border p-4 shadow">
          <h2 className="mb-2 font-semibold">Última lección activa</h2>
          <p>{latestLesson ? latestLesson.title : "Ninguna"}</p>
        </div>
        <div className="rounded border p-4 shadow">
          <h2 className="mb-2 font-semibold">Retos completados</h2>
          <p>
            {completedChallenges} / {totalChallenges}
          </p>
        </div>
        <div className="rounded border p-4 shadow">
          <h2 className="mb-2 font-semibold">Temas cubiertos</h2>
          <p>{totalCoveredTopics}</p>
        </div>
        <div className="rounded border p-4 shadow">
          <h2 className="mb-2 font-semibold">
            Tasa de aciertos (preguntas adaptativas)
          </h2>
          <p>{adaptiveAccuracy}%</p>
        </div>
        {weakestTopic && (
          <div className="rounded border bg-yellow-50 p-4 shadow">
            <h2 className="mb-2 font-semibold text-yellow-800">
              Tema más débil
            </h2>
            <p className="text-yellow-900">
              {weakestTopic.topic.title} (
              {Math.round((weakestTopic.correct / weakestTopic.total) * 100)}%
              de aciertos)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
