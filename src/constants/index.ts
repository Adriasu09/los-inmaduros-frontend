import {
  FaFacebook,
  FaInstagram,
  FaTelegram,
  FaWhatsapp,
} from "react-icons/fa";

export const ROUTE_LEVELS = {
  BEGINNER: {
    label: "Principiante",
    color: "text-green-500",
    activeFilter:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 border-green-300 dark:border-green-700",
  },
  INTERMEDIATE: {
    label: "Intermedio",
    color: "text-primary",
    activeFilter:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
  },
  ADVANCED: {
    label: "Avanzado",
    color: "text-red-500",
    activeFilter:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-700",
  },
  EXPERT: {
    label: "Experto",
    color: "text-purple-500",
    activeFilter:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  },
} as const;

// Route paces con iconos y descripciones
export const ROUTE_PACES = {
  ROCA: {
    label: "Roca",
    emoji: "🪨",
    description:
      "Aún no te ves seguro sobre los patines y evitas las cuestas a toda costa. No sabes frenar.",
  },
  CARACOL: {
    label: "Caracol",
    emoji: "🐌",
    description:
      "Eres autónomo en rectas y cuesta arriba, pero necesitas ayuda todavía para frenar, aunque lo intentes solo.",
  },
  GUSANO: {
    label: "Gusano",
    emoji: "🐛",
    description:
      "Eres autónomo 100% y te gusta ir a las caracoleras, pero te gusta salir por la calle, ritmo disfrutón.",
  },
  MARIPOSA: {
    label: "Mariposa",
    emoji: "🦋",
    description:
      "Te gusta la calle, bajar cuestas infinitas sin frenar, pasar por túneles, ritmo avanzado.",
  },
  EXPERIMENTADO: {
    label: "Experimentado",
    emoji: "🚀",
    description: "Rutas X, Galáctica, 7 picos...",
  },
  LOCURA_TOTAL: {
    label: "Locura Total",
    emoji: "☠️",
    description:
      "Te pasas los semáforos, esquivas coches, descensos a toda hostia y alcohol en las venas.",
  },
  MIAUCORNIA: {
    label: "Miaucornia",
    emoji: "🐈🦄",
    description:
      "Siempre cerveza en mano, nadie te gana a patinar pedo. Coges la ruta a mitad de camino para evitar las cuestas. Llegas tarde y persigues la ruta.",
  },
} as const;

export const PACE_ORDER: (keyof typeof ROUTE_PACES)[] = [
  "ROCA",
  "CARACOL",
  "GUSANO",
  "MARIPOSA",
  "EXPERIMENTADO",
  "LOCURA_TOTAL",
  "MIAUCORNIA",
];

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Eventos", href: "/events" },
  { label: "Rutas", href: "/routes" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

export const FOOTER_EXPLORE_LINKS = [
  { label: "Próximos Eventos", href: "/events" },
  { label: "Rutas Populares", href: "/routes" },
  { label: "Niveles de Dificultad", href: "/routes#niveles" },
  { label: "Galería de Fotos", href: "/galeria" },
];

export const FOOTER_COMMUNITY_LINKS = [
  { label: "Sobre Nosotros", href: "/nosotros" },
  { label: "Normas del Grupo", href: "/normas" },
  { label: "Contacto", href: "mailto:losinmadurosrollermadrid@gmail.com" },
];

// Puntos de encuentro predeterminados para convocatorias
export const PREDEFINED_MEETING_POINTS = [
  {
    id: "explanada",
    name: "Explanada del Banco de Madera (Madrid Río)",
    coordinates: [40.3922, -3.7103] as [number, number],
    googleMapsUrl: "https://maps.app.goo.gl/gCJfpLSoy3D454Y19",
  },
  {
    id: "puerta-alcala",
    name: "Puerta de Alcalá (salida del Retiro)",
    coordinates: [40.4201, -3.6886] as [number, number],
    googleMapsUrl: "https://maps.app.goo.gl/3kjrtMz9BtQ39BJYA",
  },
  {
    id: "plaza-cibeles",
    name: "Plaza de Cibeles",
    coordinates: [40.4194, -3.6931] as [number, number],
    googleMapsUrl: "https://maps.app.goo.gl/LuE7bF56QJgBtLbRA",
  },
] as const;

export type PredefinedMeetingPointId =
  (typeof PREDEFINED_MEETING_POINTS)[number]["id"];

export const SOCIAL_LINKS = [
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/los_inmadurosrollers/",
    label: "Instagram",
  },
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/groups/227134327307651/",
    label: "Facebook",
  },
  {
    icon: FaWhatsapp,
    href: "https://chat.whatsapp.com/DZBoC7M8jtc0YMLpOGIwlo",
    label: "WhatsApp",
  },
  { icon: FaTelegram, href: "https://t.me/PatinarEnMadrid", label: "Telegram" },
];
