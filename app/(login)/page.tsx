import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";


export default function MarketingPage() {
  return (
    <>


      <main className="bg-white">

        <section className="mx-auto flex w-full max-w-7xl flex-col-reverse items-center justify-center gap-8 px-6 py-16 lg:flex-row">

          <div className="text-center lg:text-left lg:max-w-xl">
            <h1 className="text-4xl font-extrabold text-blue-700 lg:text-5xl leading-tight">
              Aprende donde quieras, <br className="hidden lg:block" /> cuando quieras.
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Con EduFlex, tu progreso es continuo y personalizado.
              Accede a recursos interactivos, donde sea que estés.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <ClerkLoading>
                <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
              </ClerkLoading>

              <ClerkLoaded>
                <SignedOut>
                  <SignUpButton
                    mode="modal"
                    afterSignInUrl="/dashboard"
                    afterSignUpUrl="/dashboard"
                  >
                    <Button size="lg" className="bg-orange-400 text-white hover:bg-orange-500">
                      Regístrate
                    </Button>
                  </SignUpButton>

                  <SignInButton
                    mode="modal"
                    afterSignInUrl="/dashboard"
                    afterSignUpUrl="/dashboard"
                  >
                    <Button size="lg" variant="ghost" className="border border-orange-400 text-orange-400 hover:bg-orange-50">

                      ¿Ya tienes cuenta?
                    </Button>
                  </SignInButton>
                </SignedOut>

                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-700 text-white hover:bg-blue-800">
                      Ir al Dashboard
                    </Button>
                  </Link>
                </SignedIn>
              </ClerkLoaded>
            </div>
          </div>


          <div className="relative h-[280px] w-[280px] lg:h-[420px] lg:w-[420px]">
            <Image src="/hero.svg" alt="Hero" fill />
          </div>
        </section>


        <section id="features" className="bg-blue-50 py-20 px-6">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-12">
              ¿Por qué elegir EduFlex?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Acceso 24/7"
                description="Aprende a tu ritmo, sin horarios fijos."
              />
              <FeatureCard
                title="Contenido práctico"
                description="Ejercicios reales, no solo teoría."
              />
              <FeatureCard
                title="Progreso personalizado"
                description="Tu aprendizaje se adapta a ti."
              />
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-20 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-orange-400 mb-4">Nuestra misión</h2>
            <p className="text-gray-700 text-lg">
              En <span className="font-semibold text-blue-700">EduFlex</span> creemos en la educación accesible para todos. Nuestra plataforma está diseñada para
              que aprendas con libertad, sin barreras, desde cualquier dispositivo.
            </p>
          </div>
        </section>


        <section id="faq" className="bg-blue-50 py-20 px-6">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-blue-700 text-center mb-10">Preguntas Frecuentes</h2>
            <div className="space-y-6">
              <FaqItem question="¿Necesito experiencia previa?" answer="No, los cursos están diseñados desde cero para principiantes." />
              <FaqItem question="¿Puedo usarlo gratis?" answer="Sí, ofrecemos muchas funcionalidades sin costo." />
              <FaqItem question="¿Funciona en móviles?" answer="Sí, EduFlex es compatible con todos los dispositivos." />
            </div>
          </div>
        </section>

        <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} EduFlex. Todos los derechos reservados.
        </footer>
      </main>
    </>
  );
}

// Componentes auxiliares
function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h4 className="font-semibold text-blue-700">{question}</h4>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
}
