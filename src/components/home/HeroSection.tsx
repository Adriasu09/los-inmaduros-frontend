import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative h-[40vh] min-h-100 flex items-center justify-center text-white overflow-hidden">
      {/* VÍDEO DE FONDO */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/homeBanner.mp4" type="video/mp4" />
      </video>

      {/* OVERLAY OSCURO */}
      <div className="absolute inset-0 bg-black/40" />

      {/* CONTENIDO */}
      <div className="relative z-10 text-left px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight mb-4 max-w-2xl">
          Rueda, Conecta, Disfruta
        </h1>
        <p className="text-base md:text-xl max-w-2xl mb-8 text-gray-200 leading-relaxed">
          La comunidad de patinaje urbano de Madrid que te mueve. Descubre
          nuevas rutas, únete a quedadas y comparte tu pasión sobre ruedas.
        </p>
        <Link href="/rutas">
          <Button size="lg" rightIcon={<ArrowRight size={20} />}>
            Ver Próximas Rutas
          </Button>
        </Link>
      </div>
    </section>
  );
}
