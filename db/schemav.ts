/* import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgress: many(userProgress),
  units: many(units),
}));

export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(), // Unit 1
  description: text("description").notNull(), // Learn the basics of spanish
  courseId: integer("course_id")
    .references(() => courses.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  unitId: integer("unit_id")
    .references(() => units.id, {
      onDelete: "cascade",
    })
    .notNull(),
  order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id],
  }),
  challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST"]);

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id")
    .references(() => lessons.id, {
      onDelete: "cascade",
    })
    .notNull(),
  type: challengesEnum("type").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id],
  }),
  challengeOptions: many(challengeOptions),
  challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  correct: boolean("correct").notNull(),
  imageSrc: text("image_src"),
  audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(
  challengeOptions,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeOptions.challengeId],
      references: [challenges.id],
    }),
  })
);

export const challengeProgress = pgTable("challenge_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id, {
      onDelete: "cascade",
    })
    .notNull(),
  completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
  challengeProgress,
  ({ one }) => ({
    challenge: one(challenges, {
      fields: [challengeProgress.challengeId],
      references: [challenges.id],
    }),
  })
);

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

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgress.activeCourseId],
    references: [courses.id],
  }),
}));

export const userSubscription = pgTable("user_subscription", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  stripeCustomerId: text("stripe_customer_id").notNull().unique(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
  stripePriceId: text("stripe_price_id").notNull(),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
} from "drizzle-orm/pg-core";

// Tabla Cursos
export const cursos = pgTable("cursos", {
  id: serial("id_curso").primaryKey(),
  nombre: text("nombre").notNull(),
  imagen: text("imagen").notNull(),
});

export const cursosRelations = relations(cursos, ({ many }) => ({
  unidades: many(unidades),
  progresoUsuario: many(progresoUsuario),
}));

// Tabla Unidades
export const unidades = pgTable("unidades", {
  id: serial("id_unidad").primaryKey(),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull(),
  idCurso: integer("id_curso")
    .references(() => cursos.id, { onDelete: "cascade" })
    .notNull(),
  orden: integer("orden").notNull(),
});

export const unidadesRelations = relations(unidades, ({ one, many }) => ({
  curso: one(cursos, {
    fields: [unidades.idCurso],
    references: [cursos.id],
  }),
  lecciones: many(lecciones),
  progresoUsuario: many(progresoUsuario),
}));

// Tabla Lecciones
export const lecciones = pgTable("lecciones", {
  id: serial("id_leccion").primaryKey(),
  nombre: text("nombre").notNull(),
  idUnidad: integer("id_unidad")
    .references(() => unidades.id, { onDelete: "cascade" })
    .notNull(),
  orden: integer("orden").notNull(),
});

export const leccionesRelations = relations(lecciones, ({ one, many }) => ({
  unidad: one(unidades, {
    fields: [lecciones.idUnidad],
    references: [unidades.id],
  }),
  ejercicios: many(ejercicios),
  progresoUsuario: many(progresoUsuario),
}));

// Tabla Ejercicios
export const ejercicios = pgTable("ejercicios", {
  id: serial("id_ejercicio").primaryKey(),
  idLeccion: integer("id_leccion")
    .references(() => lecciones.id, { onDelete: "cascade" })
    .notNull(),
  tipo: text("tipo").notNull(),
  pregunta: text("pregunta").notNull(),
  dificultad: text("dificultad").notNull(),
});

export const ejerciciosRelations = relations(ejercicios, ({ one, many }) => ({
  leccion: one(lecciones, {
    fields: [ejercicios.idLeccion],
    references: [lecciones.id],
  }),
  opciones: many(ejerciciosOpciones),
  ejercicioCompleto: many(ejercicioCompleto),
}));

// Tabla Ejercicios_opciones
export const ejerciciosOpciones = pgTable("ejercicios_opciones", {
  id: serial("id_opcion").primaryKey(),
  idEjercicio: integer("id_ejercicio")
    .references(() => ejercicios.id, { onDelete: "cascade" })
    .notNull(),
  texto: text("texto").notNull(),
  correcto: boolean("correcto").notNull(),
  imagen: text("imagen"),
});

export const ejerciciosOpcionesRelations = relations(
  ejerciciosOpciones,
  ({ one }) => ({
    ejercicio: one(ejercicios, {
      fields: [ejerciciosOpciones.idEjercicio],
      references: [ejercicios.id],
    }),
  })
);

// Tabla ejercicio_completo
export const ejercicioCompleto = pgTable("ejercicio_completo", {
  id: serial("id_completo").primaryKey(),
  idUsuario: integer("id_usuario")
    .references(() => usuario.id, { onDelete: "cascade" })
    .notNull(),
  idEjercicio: integer("id_ejercicio")
    .references(() => ejercicios.id, { onDelete: "cascade" })
    .notNull(),
  completado: boolean("completado").notNull(),
});

export const ejercicioCompletoRelations = relations(ejercicioCompleto, ({ one }) => ({
  usuario: one(usuario, {
    fields: [ejercicioCompleto.idUsuario],
    references: [usuario.id],
  }),
  ejercicio: one(ejercicios, {
    fields: [ejercicioCompleto.idEjercicio],
    references: [ejercicios.id],
  }),
}));

// Tabla Usuario
export const usuario = pgTable("usuario", {
  id: serial("id_usuario").primaryKey(),
  nombre: text("nombre").notNull(),
  imagen: text("imagen").notNull(),
  puntos: integer("puntos").notNull(),
  rango: text("rango").notNull(),
});

export const usuarioRelations = relations(usuario, ({ many }) => ({
  progresoUsuario: many(progresoUsuario),
  ejercicioCompleto: many(ejercicioCompleto),
}));

// Tabla progreso_usuario
export const progresoUsuario = pgTable("progreso_usuario", {
  id: serial("id_progreso").primaryKey(),
  idUsuario: integer("id_usuario")
    .references(() => usuario.id, { onDelete: "cascade" })
    .notNull(),
  idCurso: integer("id_curso")
    .references(() => cursos.id, { onDelete: "cascade" })
    .notNull(),
  idUnidad: integer("id_unidad")
    .references(() => unidades.id, { onDelete: "cascade" })
    .notNull(),
  idLeccion: integer("id_leccion")
    .references(() => lecciones.id, { onDelete: "cascade" })
    .notNull(),
  completado: boolean("completado").notNull(),
});

export const progresoUsuarioRelations = relations(progresoUsuario, ({ one }) => ({
  usuario: one(usuario, {
    fields: [progresoUsuario.idUsuario],
    references: [usuario.id],
  }),
  curso: one(cursos, {
    fields: [progresoUsuario.idCurso],
    references: [cursos.id],
  }),
  unidad: one(unidades, {
    fields: [progresoUsuario.idUnidad],
    references: [unidades.id],
  }),
  leccion: one(lecciones, {
    fields: [progresoUsuario.idLeccion],
    references: [lecciones.id],
  }),
}));
