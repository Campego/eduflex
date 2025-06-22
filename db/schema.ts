import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  uuid
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";


/*    CURSOS, UNIDADES, LECCIONES */


export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
  medalImageName: text("medal_image_name"), 
});

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").notNull(),
});


   /* TOPICS  (nuevo) */


export const topics = pgTable("topics", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  theoryMd: text("theory_md").notNull(),
  order: integer("order").notNull(),
});


   /* ENUM + CHALLENGES */


export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST", "WRITE"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull(),
  topicId: integer("topic_id").references(() => topics.id, {
    onDelete: "cascade",
  }),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, { onDelete: "cascade" })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});


   /* TRACKING DE DESEMPEÑO POR TEMA   */


export const userTopicScores = pgTable(
  "user_topic_scores",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    topicId: integer("topic_id")
      .references(() => topics.id, { onDelete: "cascade" })
      .notNull(),
    correct: integer("correct").notNull().default(0),
    total: integer("total").notNull().default(0),
  },
  (table) => ({
    userTopicUnique: unique().on(table.userId, table.topicId),
  })
);

export const generatedQuestions = pgTable("generated_questions", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id")
    .references(() => topics.id, { onDelete: "cascade" })
    .notNull(),
  promptHash: text("prompt_hash").notNull(),
  contentJson: text("content_json").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: text("created_by"),
});

export const userAttempts = pgTable("user_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  questionId: integer("question_id")
    .references(() => generatedQuestions.id, { onDelete: "cascade" })
    .notNull(),
  isCorrect: boolean("is_correct").notNull(),
  answerJson: text("answer_json").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  userName: text("user_name").notNull().default("User"),
  userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
  activeCourseId: integer("active_course_id").references(() => courses.id, {
    onDelete: "cascade",
  }),
  hearts: integer("hearts").notNull().default(MAX_HEARTS),
  points: integer("points").notNull().default(0),
});


   /* MEDALLAS  */


export const medals = pgTable("medals", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").defaultRandom().notNull().unique(),
  userId: text("user_id").notNull(),
  courseId: integer("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  medalType: text("medal_type").notNull(),
  dateAwarded: timestamp("date_awarded").defaultNow().notNull(),
  // ID único para verificación externa
  medalId: uuid("medal_id").notNull().defaultRandom().unique(),
  
});
export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});


/*    RELACIONES */


export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const userMedalsRelations = relations(medals, ({ one }) => ({
  user: one(userProgress, {
    fields: [medals.userId],
    references: [userProgress.userId],
  }),
  course: one(courses, {
    fields: [medals.courseId],
    references: [courses.id],
  }),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [topics.lessonId],
    references: [lessons.id],
  }),
  generatedQuestions: many(generatedQuestions),
  topicScores: many(userTopicScores),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  topic: one(topics, {
    fields: [challenges.topicId],
    references: [topics.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

export const userTopicScoresRelations = relations(
  userTopicScores,
  ({ one }) => ({
    topic: one(topics, {
      fields: [userTopicScores.topicId],
      references: [topics.id],
    }),
  })
);

export const generatedQuestionsRelations = relations(
  generatedQuestions,
  ({ one, many }) => ({
    topic: one(topics, {
      fields: [generatedQuestions.topicId],
      references: [topics.id],
    }),
    attempts: many(userAttempts),
  })
);

export const userAttemptsRelations = relations(userAttempts, ({ one }) => ({
  question: one(generatedQuestions, {
    fields: [userAttempts.questionId],
    references: [generatedQuestions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));
