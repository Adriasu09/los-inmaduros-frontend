import type { RouteCall } from "@/types";
import { ROUTE_PACES } from "@/constants";
import { formatFullDate, formatTime } from "@/lib/date-utils";

// ─── Helpers de formato ─────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// ─── Generador del mensaje ───────────────────────────────────────────────────

/**
 * Construye el mensaje de WhatsApp para compartir una convocatoria.
 * Sigue el formato "Rut4!" del grupo para facilitar la búsqueda en el chat.
 */
export function buildWhatsAppMessage(routeCall: RouteCall, appUrl: string): string {
  const paces = routeCall.paces
    .map((p) => `${ROUTE_PACES[p].label} ${ROUTE_PACES[p].emoji}`)
    .join(", ");

  const primary = routeCall.meetingPoints?.find((mp) => mp.type === "PRIMARY");
  const secondary = routeCall.meetingPoints?.find((mp) => mp.type === "SECONDARY");
  const description = routeCall.description ? stripHtml(routeCall.description) : null;

  const lines: string[] = [
    `🛼 ¡Rut4! ${routeCall.title}`,
    ``,
    `🎿 Ritmo: ${paces}`,
    `📅 Fecha: ${formatFullDate(routeCall.dateRoute)}`,
    `⏰ Hora: ${formatTime(routeCall.dateRoute)}`,
  ];

  if (primary) {
    lines.push(`📍 Punto de encuentro: ${primary.customName ?? primary.name}`);
  }

  if (secondary) {
    lines.push(
      `📍 Segundo punto de encuentro: ${secondary.customName ?? secondary.name}`,
    );
    if (secondary.time) {
      lines.push(`⏰ Hora: ${formatTime(secondary.time)}`);
    }
  }

  if (description) {
    lines.push(`📝 Comentarios: ${description}`);
  }

  lines.push(``);
  lines.push(`🔗 Ver más detalles y apuntarse: ${appUrl}/events/${routeCall.id}`);

  return lines.join("\n");
}

// ─── Acción de compartir ─────────────────────────────────────────────────────

/** Detecta si el usuario está en un dispositivo móvil/táctil. */
function isMobileDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

/**
 * Comparte la convocatoria por WhatsApp:
 *
 * - Móvil: usa navigator.share con la imagen adjunta y el texto como caption.
 * - Escritorio: abre wa.me con el mensaje de texto (sin imagen).
 */
export async function shareRouteCallOnWhatsApp(
  routeCall: RouteCall,
  appUrl: string,
): Promise<void> {
  const message = buildWhatsAppMessage(routeCall, appUrl);

  // Móvil con imagen → share nativo (imagen + texto como caption)
  if (isMobileDevice() && navigator.share && routeCall.image) {
    try {
      const response = await fetch(routeCall.image);
      const blob = await response.blob();
      const ext = blob.type.includes("png") ? "png" : "jpg";
      const file = new File([blob], `ruta.${ext}`, { type: blob.type });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: message });
        return;
      }
    } catch {
      // Si falla, cae al fallback de texto
    }
  }

  // Escritorio (o móvil sin soporte de archivos) → WhatsApp Web con texto
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
}
