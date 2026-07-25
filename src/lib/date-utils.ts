// Single source of truth for date/time formatting. Locale is hardcoded to
// es-ES: the app is monolingual Spanish, so this isn't a shortcut, it's correct.

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

/** Compact badge label, e.g. "MIÉ 5 ABR". */
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

/** Whether dateString falls on the user's current calendar day. */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
