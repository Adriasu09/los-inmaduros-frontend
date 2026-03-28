"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, X, Upload } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useRoute } from "@/features/routes";
import { useUploadPhoto } from "@/features/photos";
import ImageUploadModal from "@/components/ui/ImageUploadModal";
import { Button } from "@/components/ui/Button";
import { useLightbox } from "../hooks/use-lightbox";
import { GalleryLightbox } from "./GalleryLightbox";

interface RouteGalleryProps {
  routeSlug: string;
  routeId: string;
}

const PREVIEW_LIMIT = 5;

export default function RouteGallery({
  routeSlug,
  routeId,
}: RouteGalleryProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  const { data: response } = useRoute(routeSlug);
  const photos = response?.data?.photos ?? [];

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const {
    mutate: upload,
    isPending,
    isError,
    reset,
  } = useUploadPhoto(routeSlug);

  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);

  const lightbox = useLightbox(photos);

  const handleUploadClick = () => {
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: pathname });
      return;
    }
    setIsUploadOpen(true);
  };

  const handleUpload = (file: File, caption?: string) => {
    upload(
      { image: file, context: "ROUTE_GALLERY", routeId, caption },
      { onSuccess: () => setIsUploadOpen(false) },
    );
  };

  const handleUploadClose = () => {
    reset();
    setIsUploadOpen(false);
  };

  const previewPhotos = photos.slice(0, PREVIEW_LIMIT);
  const remainingCount = photos.length - PREVIEW_LIMIT;
  const hasMore = remainingCount > 0;

  return (
    <>
      {/* ── Sección galería ── */}
      <div className="flex flex-col gap-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-foreground text-heading flex items-center gap-2 min-w-0">
            <span className="truncate">Galería de Fotos</span>
            {photos.length > 0 && (
              <span className="shrink-0 text-caption font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {photos.length}
              </span>
            )}
          </h2>
          <button
            onClick={handleUploadClick}
            title="Subir foto"
            aria-label="Subir foto"
            className="shrink-0 p-2 rounded-full bg-muted hover:bg-accent text-soft-foreground transition-colors border border-border cursor-pointer"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>

        {/* Grid o empty state */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {previewPhotos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => lightbox.open(i)}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption ?? "Foto de la ruta"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}

            {/* Slot "+N más" */}
            {hasMore && (
              <button
                onClick={() => setIsFullGalleryOpen(true)}
                className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group"
              >
                <Image
                  src={photos[PREVIEW_LIMIT].imageUrl}
                  alt="Ver todas las fotos"
                  fill
                  className="object-cover"
                  sizes="96px"
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors flex flex-col items-center justify-center gap-0.5">
                  <span className="text-white font-bold text-subheading leading-none">
                    +{remainingCount}
                  </span>
                  <span className="text-white/80 text-caption">ver todas</span>
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4 rounded-xl border-2 border-dashed border-border">
            <Camera className="w-10 h-10 text-faint-foreground" />
            <div className="text-center">
              <p className="text-muted-foreground text-body-sm font-medium">
                Aún no hay fotos de esta ruta
              </p>
              <p className="text-faint-foreground text-caption mt-1">
                ¡Sé el primero en compartir una foto!
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleUploadClick}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Subir la primera foto
            </Button>
          </div>
        )}
      </div>

      {/* ── Modal galería completa ── */}
      {isFullGalleryOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setIsFullGalleryOpen(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <h3 className="text-foreground text-subheading flex items-center gap-2">
                Galería de Fotos
                <span className="text-caption font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  {photos.length}
                </span>
              </h3>
              <button
                onClick={() => setIsFullGalleryOpen(false)}
                className="text-faint-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => {
                      setIsFullGalleryOpen(false);
                      lightbox.open(i);
                    }}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-80 transition-opacity cursor-pointer"
                  >
                    <Image
                      src={photo.imageUrl}
                      alt={photo.caption ?? "Foto de la ruta"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 33vw, 25vw"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightbox.currentPhoto && (
        <GalleryLightbox
          photos={photos}
          currentPhoto={lightbox.currentPhoto}
          lightboxIndex={lightbox.lightboxIndex!}
          zoom={lightbox.zoom}
          zoomIdx={lightbox.zoomIdx}
          panOffset={lightbox.panOffset}
          isDragging={lightbox.isDragging}
          isFullscreen={lightbox.isFullscreen}
          lightboxRef={lightbox.lightboxRef}
          onClose={lightbox.close}
          onGoTo={lightbox.goTo}
          onZoomIn={lightbox.zoomIn}
          onZoomOut={lightbox.zoomOut}
          onToggleFullscreen={lightbox.toggleFullscreen}
          onMouseDown={lightbox.onMouseDown}
          onMouseMove={lightbox.onMouseMove}
          onMouseUp={lightbox.onMouseUp}
        />
      )}

      {/* Modal de subida */}
      <ImageUploadModal
        isOpen={isUploadOpen}
        onClose={handleUploadClose}
        onUpload={handleUpload}
        isPending={isPending}
        isError={isError}
        title="Subir foto de la ruta"
      />
    </>
  );
}
