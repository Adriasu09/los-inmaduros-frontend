import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza un string para búsquedas: elimina tildes y convierte a minúsculas.
 * Útil para comparar texto ignorando acentos (ej: "ruta" === "Rúta").
 */
export function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

/**
 * Placeholder base64 (PNG 1×1 slate-700) para usar como blurDataURL en
 * next/image. Se muestra como fondo difuminado mientras carga la imagen real.
 */
export const BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
