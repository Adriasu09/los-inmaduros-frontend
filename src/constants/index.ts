export const ROUTE_LEVELS = {
  BEGINNER: {
    label: "Principiante",
    color: "text-green-500",
  },
  INTERMEDIATE: {
    label: "Intermedio",
    color: "text-primary",
  },
  ADVANCED: {
    label: "Avanzado",
    color: "text-red-500",
  },
  EXPERT: {
    label: "Experto",
    color: "text-purple-500",
  },
} as const;

// Route paces con iconos
export const ROUTE_PACES = {
  ROCA: { label: "Roca 🪨", emoji: "🪨" },
  CARACOL: { label: "Caracol 🐌", emoji: "🐌" },
  GUSANO: { label: "Gusano 🐛", emoji: "🐛" },
  MARIPOSA: { label: "Mariposa 🦋", emoji: "🦋" },
  EXPERIMENTADO: { label: "Experimentado 🚀", emoji: "🚀" },
  LOCURA_TOTAL: { label: "Locura Total ☠️", emoji: "☠️" },
  MIAUCORNIA: { label: "Miaucornia 🐈🦄", emoji: "🐈🦄" },
} as const;
