"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ImageOff, MapPin, Star } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useState } from "react";
import type { Route } from "@/types";
import RouteLevelBadge from "./RouteLevelBadge";
import { useIsFavorite, useToggleFavorite } from "@/features/favorites";
import { usePathname } from "next/navigation";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const [imgError, setImgError] = useState(false);

  const { data: isFavorite = false } = useIsFavorite(route.id);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite(route.id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: pathname });
      return;
    }

    toggleFavorite(isFavorite);
  };

  const reviewCount = route._count?.reviews ?? 0;
  const averageRating = route.averageRating ?? 0;

  return (
    <div className="group relative bg-card dark:bg-muted rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <Link href={`/routes/${route.slug}`} className="flex flex-col flex-1">
        {/* IMAGEN */}
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff size={28} className="text-faint-foreground" />
            </div>
          ) : (
            <Image
              src={route.image}
              alt={route.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* CONTENIDO */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-bold text-foreground text-body leading-snug group-hover:text-primary transition-colors">
            {route.name}
          </h3>

          {/* BADGES DE NIVEL */}
          <div className="flex gap-1 flex-wrap">
            {route.level.map((lvl) => (
              <span
                key={lvl}
                className="bg-muted px-2 py-0.5 rounded-full text-caption font-semibold"
              >
                <RouteLevelBadge level={lvl} />
              </span>
            ))}
          </div>

          {/* DISTANCIA + RATING */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-muted-foreground text-body-sm">
              <MapPin size={13} className="shrink-0" />
              <span>{route.approximateDistance}</span>
            </div>

            {reviewCount > 0 ? (
              <div className="flex items-center gap-1 text-body-sm">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-foreground">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-faint-foreground">({reviewCount})</span>
              </div>
            ) : (
              <span className="text-caption text-faint-foreground italic">
                Sin valoraciones
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* CORAZÓN — fuera del <Link> para evitar <button> dentro de <a> */}
      <button
        onClick={handleFavorite}
        aria-label="Añadir a favoritos"
        disabled={isPending}
        className={`absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110 cursor-pointer ${isPending ? "opacity-60" : ""}`}
      >
        <Heart
          size={18}
          className={`transition-colors ${
            isFavorite
              ? "fill-destructive text-destructive"
              : "fill-transparent text-white"
          }`}
        />
      </button>
    </div>
  );
}
