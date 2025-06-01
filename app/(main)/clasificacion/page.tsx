import { SignedIn, SignedOut } from "@clerk/nextjs";

import Link from "next/link";

import { Button } from "@/components/ui/button";




export default function DashboardPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">¡Bienvenido a la tabla de clasificacion!</h1>
        <SignedIn>
          <p className="mt-4">¡Hola Mundo!</p>
        </SignedIn>
        <SignedOut>
          <p className="mt-4">Por favor, inicia sesión para acceder a los cursos</p>
          <Link href="/sign-in">
            <Button className="mt-4">Iniciar sesión</Button>
          </Link>
        </SignedOut>
      </div>
    </div>
  );
}
