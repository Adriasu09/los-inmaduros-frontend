// Single source of truth for date/time formatting. Locale is hardcoded to
// es-ES: the app is monolingual Spanish, so this isn't a shortcut, it's correct.
//
// The time zone is pinned for the same reason: without it these formatters use
// the zone of whatever runs them, which is Madrid in the browser but UTC on
// Vercel. The same route call then rendered 12:50 client-side and 10:50 from a
// server component. The app is Madrid-local by nature, so pinning is the fix.
const MADRID_TIME_ZONE = "Europe/Madrid";

/** "miércoles, 5 de abril de 2026" */
export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: MADRID_TIME_ZONE,
  });
}

/** "18:30" */
export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: MADRID_TIME_ZONE,
  });
}

/** Compact badge label, e.g. "MIÉ 5 ABR". */
export function formatDateBadge(dateString: string): string {
  const date = new Date(dateString);
  const weekday = date
    .toLocaleDateString("es-ES", {
      weekday: "short",
      timeZone: MADRID_TIME_ZONE,
    })
    .toUpperCase()
    .replace(".", "");
  const day = date.toLocaleDateString("es-ES", {
    day: "numeric",
    timeZone: MADRID_TIME_ZONE,
  });
  const month = date
    .toLocaleDateString("es-ES", { month: "short", timeZone: MADRID_TIME_ZONE })
    .toUpperCase()
    .replace(".", "");
  return `${weekday} ${day} ${month}`;
}

/**
 * Splits an ISO instant into the `YYYY-MM-DD` / `HH:mm` pair that native
 * date and time inputs expect, read in Madrid time.
 *
 * Never derive these from `toISOString()`: that yields UTC parts, so an 20:30
 * Madrid meetup would pre-fill as 18:30 and be saved back shifted.
 */
export function getMadridDateTimeParts(dateString: string): {
  date: string;
  time: string;
} {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MADRID_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    // h23 keeps midnight as "00" — h24 would render it "24" and break the input.
    hourCycle: "h23",
  }).formatToParts(new Date(dateString));

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

/** How far ahead of UTC Madrid is at a given instant, in ms (DST-aware). */
function madridOffsetMs(instant: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MADRID_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);

  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  const wallClockAsUtc = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  );

  return wallClockAsUtc - instant.getTime();
}

/**
 * Inverse of getMadridDateTimeParts: turns the `YYYY-MM-DD` / `HH:mm` a user
 * typed (understood as Madrid wall-clock time) into the UTC ISO instant the API
 * stores.
 *
 * `new Date("2026-07-27T18:30")` would resolve against the *device's* zone, so a
 * user abroad would schedule the meetup at the wrong moment.
 */
export function madridDateTimeToIso(date: string, time: string): string {
  const wallClock = new Date(`${date}T${time}:00Z`);

  // Two passes: the offset is looked up again at the corrected instant, which
  // matters on the two DST changeover days, when it differs by an hour.
  const firstGuess = new Date(wallClock.getTime() - madridOffsetMs(wallClock));
  return new Date(
    wallClock.getTime() - madridOffsetMs(firstGuess),
  ).toISOString();
}

/** Whether dateString falls on the current calendar day in Madrid. */
export function isToday(dateString: string): boolean {
  return (
    getMadridDateTimeParts(dateString).date ===
    getMadridDateTimeParts(new Date().toISOString()).date
  );
}
