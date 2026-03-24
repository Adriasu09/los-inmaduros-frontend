"use client";

import { useState, useEffect, useRef } from "react";
import { X, ImagePlus, Trash2 } from "lucide-react";
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
const MAX_CAPTION_LENGTH = 500;

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, caption?: string) => void;
  isPending: boolean;
  isError: boolean;
  title?: string;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
  isPending,
  isError,
  title = "Subir foto",
}: ImageUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Resetear estado completo cuando el modal se cierra (tanto por handleClose como por onSuccess externo)
  useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setCaption("");
      setValidationError(null);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev); // Liberar memoria del preview
        return null;
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    if (isPending) return;
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setCaption("");
    setValidationError(null);
    onClose();
  };

  const validateAndSetFile = (selected: File) => {
    setValidationError(null);

    if (!ALLOWED_TYPES.includes(selected.type)) {
      setValidationError("Formato no permitido. Usa JPEG, PNG, GIF o WebP.");
      return;
    }

    if (selected.size > MAX_SIZE_BYTES) {
      setValidationError(`El archivo supera el límite de ${MAX_SIZE_MB}MB.`);
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
    // Resetear el input para permitir seleccionar el mismo archivo otra vez
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const handleSubmit = () => {
    if (!file || isPending) return;
    onUpload(file, caption.trim() || undefined);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="bg-card rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-5 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-subheading">
            {title}
          </h3>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-faint-foreground hover:text-foreground transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área de selección / Preview */}
        {preview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted group">
            <Image
              src={preview}
              alt="Vista previa"
              fill
              className="object-cover"
              unoptimized // Preview local, no necesita optimización de Next.js
            />
            {/* Botón para cambiar la imagen */}
            <button
              onClick={() => inputRef.current?.click()}
              disabled={isPending}
              className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 group-hover:bg-black/40 transition-colors disabled:cursor-not-allowed"
            >
              <Trash2 className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-white text-caption font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Cambiar foto
              </span>
            </button>
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
                JPEG, PNG, GIF, WebP · Máx. {MAX_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}

        {/* Input de archivo oculto */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Error de validación local */}
        {validationError && (
          <p className="text-destructive text-body-sm -mt-2">{validationError}</p>
        )}

        {/* Caption */}
        <div className="flex flex-col gap-1">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={MAX_CAPTION_LENGTH}
            rows={3}
            placeholder="Añade una descripción (opcional)..."
            disabled={isPending}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-body-sm text-foreground placeholder:text-faint-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          />
          <p className="text-faint-foreground text-caption text-right">
            {caption.length}/{MAX_CAPTION_LENGTH}
          </p>
        </div>

        {/* Error de API */}
        {isError && (
          <p className="text-destructive text-body-sm text-center -mt-2">
            Ha ocurrido un error al subir la foto. Inténtalo de nuevo.
          </p>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="flex-1 px-4 py-2.5 rounded-lg text-body-sm font-semibold bg-muted text-soft-foreground hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!file || isPending}
            className="flex-1 px-4 py-2.5 rounded-lg text-body-sm font-semibold bg-primary text-primary-foreground hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Subiendo..." : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
