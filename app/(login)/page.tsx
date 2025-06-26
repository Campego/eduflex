import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f8] font-sans">
      <aside className="group fixed left-0 top-0 z-50 flex h-full w-16 flex-col items-center justify-center gap-6 bg-white shadow-md transition-all duration-300 hover:w-40 hover:items-start">
        <div className="flex items-center gap-2 pl-4">
          <Image src="/facebook.svg" alt="Facebook" width={24} height={24} />
          <span className="hidden text-sm text-gray-700 group-hover:inline">
            Facebook
          </span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          <Image src="/instagram.svg" alt="Instagram" width={24} height={24} />
          <span className="hidden text-sm text-gray-700 group-hover:inline">
            Instagram
          </span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          <Image src="/twitter.svg" alt="Twitter" width={24} height={24} />
          <span className="hidden text-sm text-gray-700 group-hover:inline">
            Twitter
          </span>
        </div>
        <div className="flex items-center gap-2 pl-4">
          <Image src="/tiktok.svg" alt="Tiktok" width={24} height={24} />
          <span className="hidden text-sm text-gray-700 group-hover:inline">
            Tiktok
          </span>
        </div>
      </aside>

      <nav className="group fixed right-0 top-0 z-40 flex h-full w-16 flex-col items-center gap-6 bg-[#fb923c] pt-20 text-sm font-medium text-white transition-all duration-300 hover:w-40 hover:items-start">
        <a href="#" className="hidden pl-4 hover:underline group-hover:inline">
          INICIO
        </a>
        <a
          href="#about"
          className="hidden pl-4 hover:underline group-hover:inline"
        >
          NOSOTROS
        </a>
        <a
          href="#features"
          className="hidden pl-4 hover:underline group-hover:inline"
        >
          CARACTERÍSTICAS
        </a>
        <a
          href="/consulta-medalla"
          className="hidden pl-4 hover:underline group-hover:inline"
        >
          CERTIFICADOS
        </a>
      </nav>

      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <Image
            src="/offer.jpg"
            alt="Fondo"
            fill
            className="object-cover object-center"
            quality={100}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="absolute left-0 top-0 z-10 h-full w-full bg-white/60 backdrop-blur-sm md:w-1/2" />

        <div className="relative z-20 mx-auto flex min-h-[380px] max-w-5xl flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="flex flex-col justify-center lg:w-1/2">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight text-blue-900">
              Aprende donde quieras, <br /> cuando quieras.
            </h1>
            <p className="mb-6 text-gray-700">
              Con EduFlex, tu progreso es continuo y personalizado. Accede a
              recursos interactivos, donde sea que estés.
            </p>
            <div className="flex gap-4">
              <SignUpButton
                mode="modal"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              >
                <Button className="rounded-md bg-[#fb923c] px-6 py-2 text-white hover:bg-[#ff5a4a]">
                  Regístrate
                </Button>
              </SignUpButton>
              <SignInButton
                mode="modal"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
              >
                <Button
                  variant="default"
                  className="rounded-md border border-[#fb923c] px-6 py-2 text-[#fb923c] hover:bg-[#ffe9e7]"
                >
                  ¿Ya tienes cuenta?
                </Button>
              </SignInButton>
            </div>
          </div>
          <div className="lg:w-1/2" />
        </div>
      </section>

      <section className="bg-[#fb923c] px-6 py-16 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold">¡Empieza gratis hoy!</h2>
        <p className="mx-auto mb-6 max-w-2xl">
          Regístrate ahora y accede al primer curso de práctica sin costo. ¡Da
          el primer paso hacia una nueva forma de aprender programación!
        </p>
        <SignUpButton
          mode="modal"
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        >
          <Button className="rounded bg-white px-6 py-3 font-semibold text-[#ff6f61] hover:bg-gray-100">
            Accede gratis al primer curso
          </Button>
        </SignUpButton>
      </section>

      <section id="features" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-12 text-3xl font-bold text-blue-900">
            ¿Por qué elegir EduFlex?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon="/clock.svg"
              title="Acceso 24/7"
              description="Aprende a tu ritmo, sin horarios fijos."
            />
            <FeatureCard
              icon="/book.png"
              title="Contenido práctico"
              description="Ejercicios reales. No solo teoría."
            />
            <FeatureCard
              icon="/chart.avif"
              title="Progreso personalizado"
              description="Tu aprendizaje se adapta a ti."
            />
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#f8f8f8] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <blockquote className="mb-4 text-2xl font-semibold text-blue-900">
            «En <span className="text-[#ff6f61]">EduFlex</span> creemos en la
            educación accesible para todos»
          </blockquote>
          <p className="text-lg text-gray-700">
            Nuestra plataforma está diseñada para que aprendas con libertad, sin
            barreras, desde cualquier dispositivo.
          </p>
        </div>
      </section>

      <section id="faq" className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-blue-900">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-6">
            <FaqItem
              question="¿Necesito experiencia previa?"
              answer="No, los cursos están diseñados desde cero para principiantes."
            />
            <FaqItem
              question="¿Puedo usarlo gratis?"
              answer="Sí, ofrecemos muchas funcionalidades sin costo."
            />
          </div>
        </div>
      </section>

      <footer className="border-t bg-[#f8f8f8] px-6 py-10 text-center text-sm text-gray-500">
        <p>
          © {new Date().getFullYear()} EduFlex. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white p-6 text-center shadow-md transition hover:shadow-lg">
      <Image
        src={icon}
        alt={title}
        width={64}
        height={64}
        className="mx-auto mb-4"
      />
      <h3 className="mb-2 text-xl font-semibold text-blue-900">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h4 className="font-semibold text-blue-900">{question}</h4>
      <p className="text-gray-700">{answer}</p>+
    </div>
  );
}
