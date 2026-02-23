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
