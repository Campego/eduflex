// ✅ app/medals/[medalId]/page.tsx
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import db from "@/db/drizzle";
import { medals } from "@/db/schema";
import DiplomaClient from "@/components/diploma-client";

interface DiplomaPageProps {
  params: {
    medallaId: string;
  };
}

export default async function DiplomaPage({ params }: DiplomaPageProps) {
  const medal = await db.query.medals.findFirst({
    where: eq(medals.medalId, params.medallaId),
    with: {
      course: true,
      user: true,
    },
  });

  if (!medal) return notFound();

  return (
    <DiplomaClient
      medal={{
        ...medal,
        dateAwarded: medal.dateAwarded.toISOString(), // <- solución clave
      }}
    />
  );
}
