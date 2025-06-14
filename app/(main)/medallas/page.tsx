import { currentUser } from "@clerk/nextjs/server";
import db from "@/db/drizzle";
import { medals, courses } from "@/db/schema";
import { eq } from "drizzle-orm";
import Image from "next/image";

export default async function MedalsPage() {
  const user = await currentUser();
  if (!user) return <p>Unauthorized</p>;

  const userMedals = await db.query.medals.findMany({
    where: eq(medals.userId, user.id),
    with: {
      course: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tus medallas</h1>
      {userMedals.length === 0 ? (
        <p>Aún no has ganado ninguna medalla.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userMedals.map((medal) => (
            <div
              key={medal.id}
              className="rounded-xl border p-4 shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold mb-2">{medal.medalType}</h2>
              <p className="text-sm text-gray-600">
                Curso: {medal.course.title}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Fecha: {new Date(medal.dateAwarded).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
