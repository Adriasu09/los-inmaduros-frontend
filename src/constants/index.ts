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

export const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Rutas", href: "/routes" },
  { label: "Eventos", href: "/eventos" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

export const FOOTER_EXPLORE_LINKS = [
  { label: "Rutas Populares", href: "/rutas" },
  { label: "Próximos Eventos", href: "/eventos" },
  { label: "Niveles de Dificultad", href: "/rutas#niveles" },
  { label: "Galería de Fotos", href: "/galeria" },
];

export const FOOTER_COMMUNITY_LINKS = [
  { label: "Sobre Nosotros", href: "/nosotros" },
  { label: "Normas del Grupo", href: "/normas" },
  { label: "Contacto", href: "mailto:losinmadurosrollermadrid@gmail.com" },
];

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
