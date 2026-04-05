/**
 * Utilidades de formato de fecha/hora para la UI.
 * Única fuente de verdad: todas las fechas de la app se formatean aquí.
 * Locale fijo a es-ES porque la app es monolingüe en español.
 */

/** "miércoles, 5 de abril de 2026" */
export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "18:30" */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "MIÉ 5 ABR" — etiqueta compacta para badges sobre tarjetas. */
export function formatDateBadge(dateString: string): string {
  const date = new Date(dateString);
  const weekday = date
    .toLocaleDateString("es-ES", { weekday: "short" })
    .toUpperCase()
    .replace(".", "");
  const day = date.getDate();
  const month = date
    .toLocaleDateString("es-ES", { month: "short" })
    .toUpperCase()
    .replace(".", "");
  return `${weekday} ${day} ${month}`;
}

/** True si la fecha cae en el día actual del usuario. */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
