import db from "@/db/drizzle";
import { medals } from "@/db/schema";
import { eq } from "drizzle-orm";
import DiplomaClient from "@/components/diploma-client";

interface SearchParams {
  searchParams: {
    code?: string;
  };
}

export default async function LookinPage({ searchParams }: SearchParams) {
  const code = searchParams.code;

  // Mostrar el formulario si no hay código
  if (!code) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Buscar Diploma</h1>
        <form method="GET" className="space-y-4">
          <input
            type="text"
            name="code"
            placeholder="Código del diploma"
            className="w-full border rounded-md px-4 py-2 shadow-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Consultar
          </button>
        </form>
      </div>
    );
  }

  // Buscar diploma por código (medalId)
  const medal = await db.query.medals.findFirst({
    where: eq(medals.medalId, code),
    with: {
      course: true,
      user: true,
    },
  });

  // Si no existe, mostrar mensaje de error
  if (!medal) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <h1 className="text-xl font-semibold mb-2">Diploma no encontrado</h1>
        <p>Verifica que el código esté escrito correctamente.</p>
      </div>
    );
  }

  // Convertimos dateAwarded a string para evitar errores en el cliente
  return (
    <DiplomaClient
      medal={{
        ...medal,
        dateAwarded: medal.dateAwarded.toISOString(),
      }}
    />
  );
}
