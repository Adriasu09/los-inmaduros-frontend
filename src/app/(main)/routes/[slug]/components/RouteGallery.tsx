"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  X,
  Upload,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize,
  Minimize2,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useRoute } from "@/features/routes";
import { useUploadPhoto } from "@/features/photos";
import ImageUploadModal from "@/components/ui/ImageUploadModal";
import { Button } from "@/components/ui/Button";
import type { Photo } from "@/types";

interface RouteGalleryProps {
  routeSlug: string;
  routeId: string;
}

const PREVIEW_LIMIT = 5;
const ZOOM_LEVELS = [1, 1.5, 2, 3, 4];

export default function RouteGallery({
  routeSlug,
  routeId,
}: RouteGalleryProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  const { data: response } = useRoute(routeSlug);
  const photos = response?.data?.photos ?? [];

  // ── Upload ────────────────────────────────────────────────────────────────
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const {
    mutate: upload,
    isPending,
    isError,
    reset,
  } = useUploadPhoto(routeSlug);

  // ── Full gallery modal ────────────────────────────────────────────────────
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);

  // ── Lightbox ──────────────────────────────────────────────────────────────
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomIdx, setZoomIdx] = useState(0); // índice en ZOOM_LEVELS
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    sx: number;
    sy: number;
    ox: number;
    oy: number;
  } | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const zoom = ZOOM_LEVELS[zoomIdx];
  const currentPhoto: Photo | null =
    lightboxIndex !== null ? (photos[lightboxIndex] ?? null) : null;

  const resetView = useCallback(() => {
    setZoomIdx(0);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const openLightbox = useCallback(
    (index: number, closeFullGallery = false) => {
      if (closeFullGallery) setIsFullGalleryOpen(false);
      setLightboxIndex(index);
      resetView();
    },
    [resetView],
  );

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    resetView();
  }, [resetView]);

  const goTo = useCallback(
    (index: number) => {
      const total = photos.length;
      if (total === 0) return;
      setLightboxIndex(((index % total) + total) % total);
      resetView();
    },
    [photos.length, resetView],
  );

  const handleZoomIn = useCallback(() => {
    setZoomIdx((prev) => Math.min(prev + 1, ZOOM_LEVELS.length - 1));
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomIdx((prev) => {
      const next = Math.max(prev - 1, 0);
      if (next === 0) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!lightboxRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      lightboxRef.current.requestFullscreen();
    }
  }, []);

  // Teclado: ← → Escape + / -
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(lightboxIndex - 1);
      else if (e.key === "ArrowRight") goTo(lightboxIndex + 1);
      else if (e.key === "Escape") closeLightbox();
      else if (e.key === "+" || e.key === "=") handleZoomIn();
      else if (e.key === "-") handleZoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, goTo, closeLightbox, handleZoomIn, handleZoomOut]);

  // ── Drag / pan ────────────────────────────────────────────────────────────
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    e.preventDefault();
    dragRef.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: panOffset.x,
      oy: panOffset.y,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setPanOffset({
      x: dragRef.current.ox + (e.clientX - dragRef.current.sx),
      y: dragRef.current.oy + (e.clientY - dragRef.current.sy),
    });
  };

  const handleMouseUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  // ── Upload handlers ───────────────────────────────────────────────────────
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

  // ── Preview grid helpers ──────────────────────────────────────────────────
  const previewPhotos = photos.slice(0, PREVIEW_LIMIT);
  const remainingCount = photos.length - PREVIEW_LIMIT;
  const hasMore = remainingCount > 0;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Sección galería ── */}
      <div className="flex flex-col gap-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-foreground text-xl font-bold flex items-center gap-2 min-w-0">
            <span className="truncate">Galería de Fotos</span>
            {photos.length > 0 && (
              <span className="shrink-0 text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
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
                onClick={() => openLightbox(i)}
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
                  <span className="text-white font-bold text-lg leading-none">
                    +{remainingCount}
                  </span>
                  <span className="text-white/80 text-xs">ver todas</span>
                </div>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4 rounded-xl border-2 border-dashed border-border">
            <Camera className="w-10 h-10 text-faint-foreground" />
            <div className="text-center">
              <p className="text-muted-foreground text-sm font-medium">
                Aún no hay fotos de esta ruta
              </p>
              <p className="text-faint-foreground text-xs mt-1">
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
              <h3 className="text-foreground font-bold text-lg flex items-center gap-2">
                Galería de Fotos
                <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
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
                    onClick={() => openLightbox(i, true)}
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

      {/* ── Lightbox full-screen ── */}
      {currentPhoto && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-60 flex flex-col bg-black"
          onClick={zoom <= 1 ? closeLightbox : undefined}
        >
          {/* Barra superior */}
          <div
            className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 bg-linear-to-b from-black/70 to-transparent pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Contador */}
            <span className="text-white/80 text-sm font-medium pointer-events-auto select-none">
              {(lightboxIndex ?? 0) + 1} / {photos.length}
            </span>

            {/* Controles */}
            <div className="flex items-center gap-1 pointer-events-auto">
              {/* Zoom out */}
              <button
                onClick={handleZoomOut}
                disabled={zoomIdx === 0}
                title="Alejar (–)"
                className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ZoomOut className="w-5 h-5" />
              </button>

              {/* Indicador de zoom */}
              <span className="text-white/70 text-xs w-10 text-center select-none tabular-nums">
                {zoom === 1 ? "1×" : `${zoom}×`}
              </span>

              {/* Zoom in */}
              <button
                onClick={handleZoomIn}
                disabled={zoomIdx === ZOOM_LEVELS.length - 1}
                title="Acercar (+)"
                className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Separador */}
              <span className="w-px h-5 bg-white/20 mx-1" />

              {/* Pantalla completa */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullscreen();
                }}
                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>

              {/* Cerrar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                title="Cerrar (Esc)"
                className="p-2 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Zona central: flechas + imagen */}
          <div className="flex flex-1 items-center min-h-0">
            {/* Flecha izquierda */}
            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo((lightboxIndex ?? 0) - 1);
                }}
                className="cursor-pointer z-10 shrink-0 p-2 m-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors "
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Contenedor de imagen con zoom / pan */}
            <div
              className="flex-1 h-full overflow-hidden flex items-center justify-center"
              style={{
                cursor:
                  zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                  transformOrigin: "center",
                  transition: isDragging ? "none" : "transform 0.2s ease",
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPhoto.imageUrl}
                  alt={currentPhoto.caption ?? "Foto de la ruta"}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>

            {/* Flecha derecha */}
            {photos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo((lightboxIndex ?? 0) + 1);
                }}
                className="cursor-pointer z-10 shrink-0 p-2 m-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>

          {/* Barra inferior: caption */}
          {currentPhoto.caption && (
            <div
              className="absolute bottom-0 inset-x-0 px-6 py-4 bg-linear-to-t from-black/70 to-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white/80 text-sm text-center max-w-xl mx-auto">
                {currentPhoto.caption}
              </p>
            </div>
          )}
        </div>
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
