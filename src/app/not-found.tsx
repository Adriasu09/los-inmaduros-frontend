import Image from "next/image";
import Link from "next/link";
import { SOCIAL_LINKS } from "@/constants";

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-950 text-slate-100"
      style={{
        backgroundImage: `
          radial-gradient(at 0% 0%, rgba(56, 189, 248, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(56, 189, 248, 0.08) 0px, transparent 50%)
        `,
      }}
    >
      {/* Header minimalista con logo */}
      <header className="flex items-center border-b border-sky-400/10 px-6 py-4 md:px-20">
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo_dark.png"
            alt="Los Inmaduros Roller Madrid"
            width={160}
            height={42}
            className="h-auto w-36"
            priority
          />
        </Link>
      </header>

      {/* Contenido principal */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        {/* Emoji con glow */}
        <div className="relative mb-10 group">
          <div className="absolute -inset-6 rounded-full bg-sky-400/20 blur-3xl opacity-60 group-hover:opacity-80 transition-opacity" />
          <span className="relative text-8xl md:text-9xl select-none">🛼</span>
        </div>

        {/* Titular y subtítulo */}
        <div className="max-w-2xl space-y-5">
          <h1 className="text-title md:text-display md:text-6xl">
            ¡Uy! Parece que esta página{" "}
            <span className="text-sky-400">se ha salido del carril</span>
          </h1>
          <p className="text-slate-400 text-subheading md:text-xl max-w-lg mx-auto leading-relaxed font-normal">
            La página que buscas no existe o ha cambiado de camino. Pero no te
            preocupes, ¡hay muchas rutas por descubrir en Madrid!
          </p>
        </div>

        {/* Botones */}
        <div className="mt-10 flex w-full max-w-sm flex-col sm:flex-row gap-4">
          <Link
            href="/routes"
            className="flex-1 flex items-center justify-center h-13 rounded-full bg-sky-400 text-white text-body font-bold hover:bg-sky-500 active:scale-95 transition-all"
          >
            Ver rutas
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center h-13 rounded-full bg-slate-800 text-slate-100 text-body font-bold hover:bg-slate-700 active:scale-95 transition-all"
          >
            Ir al inicio
          </Link>
        </div>

        {/* Redes sociales */}
        <div className="mt-16 w-full max-w-md border-t border-sky-400/10 pt-10">
          <p className="mb-6 text-label tracking-widest text-sky-400">
            Mantente en movimiento
          </p>
          <div className="flex justify-center gap-6">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-400/10 text-sky-400 transition-all group-hover:bg-sky-400 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <span className="text-label tracking-wide text-slate-400 group-hover:text-slate-100 transition-colors">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-body-sm text-slate-500">
        <p>© {new Date().getFullYear()} Los Inmaduros Roller Madrid. Deslizando por la ciudad.</p>
      </footer>
    </div>
  );
}
