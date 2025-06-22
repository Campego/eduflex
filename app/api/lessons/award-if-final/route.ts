import { randomUUID } from "crypto";

import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

import db from "@/db/drizzle";
import { lessons, units, courses, medals } from "@/db/schema";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { lessonId: number };
    const lessonId = body.lessonId;
    if (!lessonId) {
      return NextResponse.json({ error: "Missing lessonId" }, { status: 400 });
    }

    const lesson = await db.query.lessons.findFirst({
      where: eq(lessons.id, lessonId),
    });
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    const unit = await db.query.units.findFirst({
      where: eq(units.id, lesson.unitId),
    });
    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    const course = await db.query.courses.findFirst({
      where: eq(courses.id, unit.courseId),
    });
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const allUnits = await db.query.units.findMany({
      where: eq(units.courseId, course.id),
      with: {
        lessons: true,
      },
    });

    const allLessons = allUnits.flatMap((u) => u.lessons);
    const sortedLessons = allLessons.sort((a, b) => {
      const unitA = allUnits.find((u) => u.id === a.unitId)?.order ?? 0;
      const unitB = allUnits.find((u) => u.id === b.unitId)?.order ?? 0;

      return unitA !== unitB ? unitA - unitB : a.order - b.order;
    });

    const lastLesson = sortedLessons[sortedLessons.length - 1];

    if (lastLesson?.id !== lesson.id) {
      return NextResponse.json({ awarded: false });
    }

    const existing = await db.query.medals.findFirst({
      where: (m) => eq(m.userId, userId) && eq(m.courseId, course.id),
    });

    if (existing) {
      return NextResponse.json({ awarded: false });
    }

    await db.insert(medals).values({
      userId,
      courseId: course.id,
      medalType: course.title,
      medalId: randomUUID(),
    });

    return NextResponse.json({ awarded: true });
  } catch (err) {
    console.error("[AWARD_IF_FINAL_ERROR]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
};
