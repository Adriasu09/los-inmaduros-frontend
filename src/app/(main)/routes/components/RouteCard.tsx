"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Star } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import type { Route } from "@/types";
import RouteLevelBadge from "./RouteLevelBadge";
import { useIsFavorite, useToggleFavorite } from "@/features/favorites";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const { data: isFavorite = false } = useIsFavorite(route.id);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite(route.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPending) return;

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    toggleFavorite(isFavorite);
  };

  const reviewCount = route._count?.reviews ?? 0;
  const averageRating = (route as any).averageRating ?? 0;

  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* IMAGEN */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={route.image}
          alt={route.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* CORAZÓN */}
        <button
          onClick={handleFavorite}
          aria-label="Añadir a favoritos"
          disabled={isPending}
          className={`absolute top-3 right-3 p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer
    ${isPending ? "opacity-60" : ""}
  `}
        >
          <Heart
            size={18}
            className={`transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "fill-transparent text-white"
            }`}
          />
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-sky-400 transition-colors">
          {route.name}
        </h3>

        {/* BADGES DE NIVEL */}
        <div className="flex gap-1 flex-wrap">
          {route.level.map((lvl) => (
            <span
              key={lvl}
              className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-xs font-semibold"
            >
              <RouteLevelBadge level={lvl} />
            </span>
          ))}
        </div>

        {/* DISTANCIA + RATING */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
            <MapPin size={13} className="shrink-0" />
            <span>{route.approximateDistance}</span>
          </div>

          {reviewCount > 0 ? (
            <div className="flex items-center gap-1 text-sm">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-400">({reviewCount})</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">
              Sin valoraciones
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
