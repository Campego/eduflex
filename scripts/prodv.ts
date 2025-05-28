import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("🔄 Limpiando tablas...");

    await Promise.all([
      db.delete(schema.progresoUsuario),
      db.delete(schema.ejercicioCompleto),
      db.delete(schema.ejerciciosOpciones),
      db.delete(schema.ejercicios),
      db.delete(schema.lecciones),
      db.delete(schema.unidades),
      db.delete(schema.cursos),
      db.delete(schema.usuario),
    ]);

    console.log("✅ Tablas vaciadas");

    const [curso] = await db.insert(schema.cursos).values({
      nombre: "Comprensión y Escritura",
      imagen: "/img/comprension.svg",
    }).returning();

    const [unidad] = await db.insert(schema.unidades).values({
      nombre: "Historias breves",
      descripcion: "Lectura y análisis de cuentos cortos",
      idCurso: curso.id,
      orden: 1,
    }).returning();

    const [leccion] = await db.insert(schema.lecciones).values({
      nombre: "La carta de Juan",
      idUnidad: unidad.id,
      orden: 1,
    }).returning();

    const [ejercicioLectura] = await db.insert(schema.ejercicios).values({
      idLeccion: leccion.id,
      tipo: "LECTURA",
      pregunta: "¿Qué hizo Juan después de leer la carta?",
      dificultad: "fácil",
    }).returning();

    await db.insert(schema.ejerciciosOpciones).values([
      {
        idEjercicio: ejercicioLectura.id,
        texto: "La guardó en su mochila",
        correcto: true,
        imagen: "/img/mochila.svg",
      },
      {
        idEjercicio: ejercicioLectura.id,
        texto: "La rompió en pedazos",
        correcto: false,
        imagen: "/img/papel-roto.svg",
      },
      {
        idEjercicio: ejercicioLectura.id,
        texto: "La devolvió sin leerla",
        correcto: false,
        imagen: "/img/devolver.svg",
      },
    ]);

    await db.insert(schema.ejercicios).values({
      idLeccion: leccion.id,
      tipo: "ESCRITURA",
      pregunta: "Escribe una continuación creativa para la historia de Juan y la carta.",
      dificultad: "medio",
    });

    const [user] = await db.insert(schema.usuario).values({
      nombre: "Valeria",
      imagen: "/img/avatar2.png",
      puntos: 0,
      rango: "Explorador",
    }).returning();

    await db.insert(schema.progresoUsuario).values({
      idUsuario: user.id,
      idCurso: curso.id,
      idUnidad: unidad.id,
      idLeccion: leccion.id,
      completado: false,
    });

    await db.insert(schema.ejercicioCompleto).values({
      idUsuario: user.id,
      idEjercicio: ejercicioLectura.id,
      completado: false,
    });

    console.log("✅ Base de datos sembrada correctamente");
  } catch (error) {
    console.error("❌ Error durante el seeding:", error);
    process.exit(1);
  }
};

void main();
