"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Star, Route } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import RouteLevelBadge from "../../components/RouteLevelBadge";
import type { RouteDetail } from "@/types";
import { useIsFavorite, useToggleFavorite } from "@/features/favorites";
import { BLUR_DATA_URL } from "@/lib/utils";

interface RouteDetailHeroProps {
  route: RouteDetail;
}

export default function RouteDetailHero({ route }: RouteDetailHeroProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  const { data: isFavorite = false } = useIsFavorite(route.id);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite(route.id);

  const handleFavorite = () => {
    if (isPending) return;

    if (!isSignedIn) {
      openSignIn({ redirectUrl: pathname, afterSignInUrl: pathname });
      return;
    }

    toggleFavorite(isFavorite);
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Botón volver */}
      <Link
        href="/routes"
        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a rutas
      </Link>

      {/* Título y nivel — encima del layout de dos columnas */}
      <div>
        <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-bold leading-tight">
          {route.name}
        </h1>
      </div>

      {/* Layout de dos columnas: imagen + sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna izquierda: imagen + descripción */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Imagen más contenida */}
          <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden max-h-125 bg-slate-100 dark:bg-slate-700">
            <Image
              src={route.image}
              alt={route.name}
              fill
              className="object-cover"
              priority
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-slate-900 dark:text-white text-lg font-bold mb-2">
              Descripción
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
              {route.description}
            </p>
          </div>
        </div>

        {/* Columna derecha: información clave + favorito + mapa */}
        <div className="flex flex-col gap-4 lg:w-72 xl:w-80 shrink-0">
          {/* Tarjeta de información clave */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold px-4 pt-4 pb-2">
              Información Clave
            </h3>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-slate-200 dark:border-slate-700 px-4 py-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Puntuación
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <p className="text-slate-900 dark:text-white text-sm font-semibold">
                  {route.averageRating > 0
                    ? `${route.averageRating}/5`
                    : "Sin valoraciones"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-slate-200 dark:border-slate-700 px-4 py-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Distancia
              </p>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                <p className="text-slate-900 dark:text-white text-sm font-semibold">
                  {route.approximateDistance} aprox.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-slate-200 dark:border-slate-700 px-4 py-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Dificultad
              </p>
              <div className="flex flex-wrap gap-1">
                {route.level.map((lvl) => (
                  <RouteLevelBadge key={lvl} level={lvl} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-slate-200 dark:border-slate-700 px-4 py-3">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Reseñas
              </p>
              <p className="text-slate-900 dark:text-white text-sm font-semibold">
                {route._count?.reviews ?? 0} valoraciones
              </p>
            </div>
          </div>

          {/* Botón favorito */}
          <button
            onClick={handleFavorite}
            disabled={isPending}
            className={`flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700 ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? "fill-red-500 text-red-500" : ""
              }`}
            />
            {isFavorite ? "Guardado en favoritos" : "Guardar en favoritos"}
          </button>

          {/* Placeholder del mapa */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold px-4 pt-4 pb-2">
              Mapa Interactivo
            </h3>
            <div className="mx-4 mb-4 aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center gap-2">
              <Route className="w-8 h-8 text-slate-400" />
              <p className="text-slate-400 text-sm text-center px-4">
                El mapa GPX se cargará aquí
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
