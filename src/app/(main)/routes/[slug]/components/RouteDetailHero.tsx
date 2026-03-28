"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Heart, MapPin, Star, Expand } from "lucide-react";
import RouteMap from "./RouteMap";
import MapLoadingPlaceholder from "@/components/map/MapLoadingPlaceholder";
import MapModal from "@/components/map/MapModal";
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
  const [isMapOpen, setIsMapOpen] = useState(false);

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
      <Link
        href="/routes"
        className="flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a rutas
      </Link>

      <div>
        <h1 className="text-foreground text-title sm:text-4xl">
          {route.name}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_18rem] xl:grid-cols-[1fr_20rem]">

        <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden max-h-125 bg-muted lg:col-start-1 lg:row-start-1">
          <Image
            src={route.image}
            alt={route.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <h3 className="text-foreground text-subheading mb-2">
            Descripción
          </h3>
          <p className="text-soft-foreground text-body">
            {route.description}
          </p>
        </div>

        <div className="order-last lg:order-0 lg:col-start-1 lg:row-start-3 flex flex-col gap-6 max-w-2xl">
          <RouteReviews routeSlug={route.slug} routeId={route.id} />
        </div>

        <div className="flex flex-col gap-4 lg:col-start-2 lg:row-start-1 lg:row-span-3">
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

          {/* Mapa interactivo */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h3 className="text-foreground text-subheading">
                Mapa Interactivo
              </h3>
              {(route.gpxFileUrl || true) && (
                <button
                  onClick={() => setIsMapOpen(true)}
                  className="text-faint-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Ampliar mapa"
                >
                  <Expand className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="mx-4 mb-4 aspect-video rounded-lg overflow-hidden">
              {/* TODO: remove test GPX, use route.gpxFileUrl once connected to backend */}
              {route.gpxFileUrl || true ? (
                <RouteMap gpxUrl={route.gpxFileUrl ?? "/gpx/clasica.gpx"} />
              ) : route.mapEmbedUrl ? (
                <iframe
                  src={route.mapEmbedUrl!}
                  className="w-full h-full border-0"
                  title={`Mapa de ${route.name}`}
                  loading="lazy"
                />
              ) : (
                <MapLoadingPlaceholder message="No hay mapa disponible" />
              )}
            </div>
          </div>

          {/* Modal del mapa expandido */}
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            gpxUrl={route.gpxFileUrl ?? "/gpx/clasica.gpx"}
            title={route.name}
          />

          {/* Galería de fotos — sidebar */}
          <RouteGallery routeSlug={route.slug} routeId={route.id} />
        </div>
      </div>
    </div>
  );
}
