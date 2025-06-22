import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

import db from "@/db/drizzle";
import { medals } from "@/db/schema";



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
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Tus medallas</h1>
      {userMedals.length === 0 ? (
        <p>Aún no has ganado ninguna medalla.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userMedals.map((medal) => (
            <Link key={medal.id} href={`/medalla/${medal.medalId}`}>
              <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:bg-gray-50">
                {medal.course.medalImageName && (
                  <div className="mb-2 flex justify-center">
                    <Image
                      src={`/medallas/${medal.course.medalImageName}`}
                      alt="Medalla"
                      width={100}
                      height={100}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  Curso: {medal.course.title}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Fecha: {new Date(medal.dateAwarded).toLocaleDateString()}
                </p>
                <p className="mt-2 text-xs text-gray-400">
                  ID: {medal.medalId}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
