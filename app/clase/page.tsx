import { redirect } from "next/navigation";

import {
  getLesson,
  getUserProgress,
  getUserSubscription,
  getCourseProgress,
} from "@/db/queries";

import { Quiz } from "./quiz";

const LessonPage = async () => {
  const courseProgress = await getCourseProgress();
  console.log(courseProgress?.activeLessonId);
  console.log(courseProgress?.activeLessonId);

  const currentLessonId = courseProgress?.activeLesson?.id;

  const lessonData = getLesson(currentLessonId);
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData,
  ]);

  if (!lesson || !userProgress) {
    return redirect("/medalla");
  }
  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length /
      lesson.challenges.length) *
    100;

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      initialPercentage={initialPercentage}
      userSubscription={userSubscription}
    />
  );
};

export default LessonPage;
