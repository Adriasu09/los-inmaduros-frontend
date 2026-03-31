"use client";

import { useState, useRef, useEffect } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface CoverImageSectionProps {
  routeImageUrl?: string | null;
  coverImage: File | null;
  onImageChange: (file: File | null) => void;
}

export default function CoverImageSection({
  routeImageUrl,
  coverImage,
  onImageChange,
}: CoverImageSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate preview for selected file
  useEffect(() => {
    if (coverImage) {
      const url = URL.createObjectURL(coverImage);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [coverImage]);

  const displayImage = preview || routeImageUrl;

  const validateAndSetFile = (file: File) => {
    setValidationError(null);

    if (!ALLOWED_TYPES.includes(file.type)) {
      setValidationError("Formato no permitido. Usa JPEG, PNG, GIF o WebP.");
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setValidationError(`El archivo supera el límite de ${MAX_SIZE_MB}MB.`);
      return;
    }

    onImageChange(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const handleRemove = () => {
    onImageChange(null);
    setValidationError(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-label font-semibold text-foreground">
        Imagen de portada
      </label>

      {displayImage ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted group">
          <Image
            src={displayImage}
            alt="Portada de la ruta"
            fill
            className="object-cover"
            unoptimized={!!preview}
          />
          {/* Overlay buttons */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 group-hover:bg-black/40 transition-colors">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              title="Cambiar imagen"
            >
              <ImagePlus className="w-5 h-5" />
            </button>
            {coverImage && (
              <button
                type="button"
                onClick={handleRemove}
                className="p-2.5 rounded-full bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                title="Eliminar imagen"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors",
            validationError
              ? "border-destructive/60 bg-destructive/5"
              : "border-border hover:border-primary hover:bg-primary/5 bg-muted",
          )}
        >
          <ImagePlus className="w-8 h-8 text-faint-foreground" />
          <div className="text-center">
            <p className="text-body-sm font-medium text-soft-foreground">
              Haz clic o arrastra una foto
            </p>
            <p className="text-caption text-faint-foreground mt-1">
              JPEG, PNG, GIF, WebP - Máx. {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {validationError && (
        <p className="text-destructive text-caption">{validationError}</p>
      )}

      <p className="text-caption text-faint-foreground">
        {routeImageUrl && !coverImage
          ? "Se usará la imagen de la ruta. Puedes cambiarla si lo deseas. Toca sobre la imagen para editarla."
          : "Opcional. Añade una imagen para tu convocatoria."}
      </p>
    </div>
  );
}
