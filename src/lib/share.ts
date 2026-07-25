import type { RouteCall } from "@/types";
import { ROUTE_PACES } from "@/constants";
import { formatFullDate, formatTime } from "@/lib/date-utils";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

// Follows the group's "Rut4!" convention so it's easy to spot in chat.
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

function isMobileDevice(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches
  );
}

// Mobile: native share sheet with the image attached and text as caption.
// Desktop (or mobile without file-sharing support): wa.me with text only.
export async function shareRouteCallOnWhatsApp(
  routeCall: RouteCall,
  appUrl: string,
): Promise<void> {
  const message = buildWhatsAppMessage(routeCall, appUrl);

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
      // Fall through to the text-only fallback below.
    }
  }

  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
}
