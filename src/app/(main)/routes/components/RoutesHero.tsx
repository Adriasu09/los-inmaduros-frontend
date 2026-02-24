import Image from "next/image";

export default function RoutesHero() {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full min-h-75 rounded-lg overflow-hidden">
        <Image
          src="/hero_routes.jpeg"
          alt="Hero rutas de patinaje en Madrid"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <h1 className="text-white text-[32px] font-bold leading-tight tracking-tight">
          Cada ruta, una nueva historia sobre ruedas
        </h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Explora nuestras rutas, donde la diversión, el desafío y la aventura
          se encuentran a cada giro. Ya sea que estés buscando una ruta
          tranquila o un reto emocionante, cada recorrido te invita a descubrir
          Madrid de una forma única.
        </p>
      </div>
    </div>
  );
}
