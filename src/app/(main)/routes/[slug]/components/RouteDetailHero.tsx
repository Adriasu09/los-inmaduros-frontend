"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Star, Route } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import RouteLevelBadge from "../../components/RouteLevelBadge";
import RouteReviews from "./RouteReviews";
import RouteGallery from "./RouteGallery";
import type { RouteDetail } from "@/types";
import { useIsFavorite, useToggleFavorite } from "@/features/favorites";
import { Button } from "@/components/ui/Button";

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
      openSignIn({ forceRedirectUrl: pathname });
      return;
    }

    toggleFavorite(isFavorite);
  };
  return (
    <div className="flex flex-col gap-6">
      {/* Botón volver */}
      <Link
        href="/routes"
        className="flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a rutas
      </Link>

      {/* Título y nivel — encima del layout de dos columnas */}
      <div>
        <h1 className="text-foreground text-title sm:text-4xl">
          {route.name}
        </h1>
      </div>

      {/* Layout de dos columnas: imagen + sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda: imagen + descripción */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Imagen más contenida */}
          <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden max-h-125 bg-muted">
            <Image
              src={route.image}
              alt={route.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-foreground text-subheading mb-2">
              Descripción
            </h3>
            <p className="text-soft-foreground text-body">
              {route.description}
            </p>
          </div>

          {/* Sección de reseñas */}
          <div className="mt-12 flex flex-col gap-6 max-w-2xl">
            <RouteReviews routeSlug={route.slug} routeId={route.id} />
          </div>
        </div>

        {/* Columna derecha: información clave + favorito + mapa */}
        <div className="flex flex-col gap-4 lg:w-72 xl:w-80 shrink-0">
          {/* Tarjeta de información clave */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <h3 className="text-foreground text-subheading px-4 pt-4 pb-2">
              Información Clave
            </h3>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-border px-4 py-3">
              <p className="text-muted-foreground text-body-sm">
                Puntuación
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <p className="text-foreground text-body-sm font-semibold">
                  {route.averageRating > 0
                    ? `${route.averageRating}/5`
                    : "Sin valoraciones"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-border px-4 py-3">
              <p className="text-muted-foreground text-body-sm">
                Distancia
              </p>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-faint-foreground" />
                <p className="text-foreground text-body-sm font-semibold">
                  {route.approximateDistance} aprox.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-border px-4 py-3">
              <p className="text-muted-foreground text-body-sm">
                Dificultad
              </p>
              <div className="flex flex-wrap gap-1">
                {route.level.map((lvl) => (
                  <RouteLevelBadge key={lvl} level={lvl} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[40%_1fr] items-center gap-x-4 border-t border-border px-4 py-3">
              <p className="text-muted-foreground text-body-sm">
                Reseñas
              </p>
              <p className="text-foreground text-body-sm font-semibold">
                {route._count?.reviews ?? 0} valoraciones
              </p>
            </div>
          </div>

          {/* Botón favorito */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            disabled={isPending}
            className="w-full rounded-xl"
            leftIcon={
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? "fill-destructive text-destructive" : ""
                }`}
              />
            }
          >
            {isFavorite ? "Guardado en favoritos" : "Guardar en favoritos"}
          </Button>

          {/* Placeholder del mapa */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <h3 className="text-foreground text-subheading px-4 pt-4 pb-2">
              Mapa Interactivo
            </h3>
            <div className="mx-4 mb-4 aspect-square rounded-lg bg-muted flex flex-col items-center justify-center gap-2">
              <Route className="w-8 h-8 text-faint-foreground" />
              <p className="text-faint-foreground text-body-sm text-center px-4">
                El mapa GPX se cargará aquí
              </p>
            </div>
          </div>

          {/* Galería de fotos — sidebar */}
          <RouteGallery routeSlug={route.slug} routeId={route.id} />
        </div>
      </div>
    </div>
  );
}
