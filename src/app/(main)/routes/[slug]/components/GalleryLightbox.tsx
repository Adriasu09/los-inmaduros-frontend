import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
} from "lucide-react";
import type { Photo } from "@/types";
import { ZOOM_LEVELS } from "../hooks/use-lightbox";

interface GalleryLightboxProps {
  photos: Photo[];
  currentPhoto: Photo;
  lightboxIndex: number;
  zoom: number;
  zoomIdx: number;
  panOffset: { x: number; y: number };
  isDragging: boolean;
  isFullscreen: boolean;
  lightboxRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  onGoTo: (index: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

export function GalleryLightbox({
  photos,
  currentPhoto,
  lightboxIndex,
  zoom,
  zoomIdx,
  panOffset,
  isDragging,
  isFullscreen,
  lightboxRef,
  onClose,
  onGoTo,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: GalleryLightboxProps) {
  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-60 flex flex-col bg-black"
      onClick={zoom <= 1 ? onClose : undefined}
    >
      {/* Barra superior */}
      <div
        className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 bg-linear-to-b from-black/70 to-transparent pointer-events-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Contador */}
        <span className="text-white/80 text-body-sm font-medium pointer-events-auto select-none">
          {lightboxIndex + 1} / {photos.length}
        </span>

        {/* Controles */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {/* Zoom + separador + pantalla completa: solo en desktop */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={onZoomOut}
              disabled={zoomIdx === 0}
              title="Alejar (–)"
              aria-label="Alejar"
              className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white/70 text-caption w-10 text-center select-none tabular-nums">
              {zoom === 1 ? "1×" : `${zoom}×`}
            </span>

            <button
              onClick={onZoomIn}
              disabled={zoomIdx === ZOOM_LEVELS.length - 1}
              title="Acercar (+)"
              aria-label="Acercar"
              className="p-2 rounded-full text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            <span className="w-px h-5 bg-white/20 mx-1" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFullscreen();
              }}
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Cerrar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Cerrar (Esc)"
            aria-label="Cerrar lightbox"
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
              onGoTo(lightboxIndex - 1);
            }}
            aria-label="Foto anterior"
            className="cursor-pointer z-10 shrink-0 p-2 m-3 rounded-full bg-black/40 hover:bg-white/20 text-white transition-colors"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Contenedor de imagen con zoom / pan */}
        <div
          className="flex-1 h-full overflow-hidden flex items-center justify-center"
          style={{
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
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
              onGoTo(lightboxIndex + 1);
            }}
            aria-label="Foto siguiente"
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
          <p className="text-white/80 text-body-sm text-center max-w-xl mx-auto">
            {currentPhoto.caption}
          </p>
        </div>
      )}
    </div>
  );
}
