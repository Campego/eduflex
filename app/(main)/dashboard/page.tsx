import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";


export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return redirect("/");

  const enrolled = await db.query.userProgress.findMany({
    where: eq(userProgress.userId, user.id),
    with: {
      activeCourse: true,
    },
  });

  if (enrolled.length === 0) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No estás inscrito en ningún curso</h1>
        <p>Explora los cursos disponibles en la página principal.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mis cursos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolled.map(({ activeCourse }) => (
          activeCourse && (
            <Link
              key={activeCourse.id}
              href={`/dashboard/${activeCourse.id}`}
              className="border rounded-lg p-4 shadow-sm hover:bg-gray-50 transition"
            >
              <h2 className="text-lg font-semibold mb-2">{activeCourse.title}</h2>
              <Image
                src={activeCourse.imageSrc}
                alt={activeCourse.title}
                width={400}
                height={200}
                className="w-full h-32 object-cover rounded"
              />
            </Link>
          )
        ))}
      </div>
    </div>
  );
}
