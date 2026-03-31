# Los Inmaduros Roller Madrid

> Plataforma social para comunidades de patinaje urbano que conecta a mas de 500 patinadores en Madrid.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Deployed on CubePath](https://img.shields.io/badge/Deployed-CubePath-blueviolet)](https://cubepath.net/)

---

## El Problema

Las convocatorias de rutas de patinaje se pierden en grupos masivos de WhatsApp y Telegram. No hay forma centralizada de organizar quedadas, descubrir rutas o conservar los momentos compartidos de la comunidad.

## La Solucion

**Los Inmaduros Roller** centraliza la organizacion de quedadas y el contenido de la comunidad en un solo lugar: descubrir rutas, coordinar asistencia, compartir fotos y conservar los momentos vividos. Transformamos la desorganizacion en una experiencia conectada y escalable.

---

## Demo

| Servicio | URL |
|----------|-----|
| Backend API | [inmaduros-backend](http://inmaduros-backend-plbyiq-425d14-45-90-237-198.traefik.me/health) |
| n8n Workflows | [vps23790.cubepath.net](https://vps23790.cubepath.net/) |

---

## Funcionalidades Principales

### Rutas Predefinidas
- Catalogo de rutas de patinaje con niveles de dificultad (Principiante a Experto)
- Visualizacion de tracks GPX sobre mapas interactivos con Leaflet
- Distancia, descripcion, galeria de fotos y resenas de usuarios
- Sistema de valoraciones con puntuacion promedio

### Convocatorias de Rutas (Route Calls)
- Creacion de quedadas con editor de texto enriquecido (TipTap)
- Selector de punto de encuentro sobre mapa interactivo
- Multiples ritmos de marcha: Roca, Caracol, Gusano, Mariposa, Experimentado, Locura Total, Miaucornia
- Puntos de encuentro primario y secundario con horarios independientes
- Seguimiento de asistentes en tiempo real con stack de avatares

### Eventos
- Listado de todas las convocatorias (proximas y pasadas)
- Pagina de detalle con informacion completa de la ruta
- Compartir eventos directamente por WhatsApp

### Comunidad
- Sistema de resenas y valoraciones por ruta
- Galerias de fotos por ruta y por convocatoria
- Subida de imagenes con moderacion (activa/marcada/rechazada)
- Perfiles de usuario con imagen

### Autenticacion
- Login con OAuth via Clerk (Google, etc.)
- Rutas protegidas con middleware server-side
- Inyeccion automatica de token en peticiones API

---

## Tech Stack

### Frontend
| Tecnologia | Uso |
|------------|-----|
| **Next.js 16** | Framework full-stack con App Router y SSR |
| **React 19** | Libreria de UI con Server Components |
| **TypeScript 5** | Tipado estatico |
| **Tailwind CSS 4** | Sistema de estilos utility-first |
| **shadcn/ui** | Componentes accesibles basados en Radix UI |
| **React Query 5** | Estado del servidor, cache y sincronizacion |
| **React Hook Form + Zod** | Formularios con validacion type-safe |
| **TipTap** | Editor de texto enriquecido WYSIWYG |
| **Leaflet + React-Leaflet** | Mapas interactivos con soporte GPX |
| **Lucide React** | Iconografia |

### Backend & Infraestructura
| Tecnologia | Uso |
|------------|-----|
| **Clerk** | Autenticacion OAuth y gestion de sesiones |
| **Supabase** | Base de datos PostgreSQL + almacenamiento de archivos |
| **Axios** | Cliente HTTP con interceptores de autenticacion |
| **CubePath (Dokploy)** | Despliegue y gestion de la aplicacion |
| **CubePath (n8n)** | Automatizacion de flujos y notificaciones |

---

## Arquitectura

```
+------------------+       +------------------+       +------------------+
|                  |       |                  |       |                  |
|    Frontend      | <---> |    Backend API   | <---> |    Supabase      |
|    (Next.js)     |       |    (REST)        |       |    (PostgreSQL)  |
|                  |       |                  |       |    + Storage     |
+------------------+       +------------------+       +------------------+
        |                          |
        v                          v
+------------------+       +------------------+
|                  |       |                  |
|    Clerk         |       |    n8n           |
|    (Auth)        |       |    (Workflows)   |
|                  |       |                  |
+------------------+       +------------------+

Desplegado en CubePath via Dokploy
```

---

## Estructura del Proyecto

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Paginas de autenticacion
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (main)/                 # Paginas principales
│   │   ├── routes/             # Catalogo y detalle de rutas
│   │   ├── events/             # Convocatorias y eventos
│   │   │   └── create/         # Crear nueva convocatoria
│   │   └── page.tsx            # Homepage
│   └── layout.tsx              # Layout raiz (Clerk + Theme + React Query)
├── components/
│   ├── home/                   # Hero, rutas destacadas
│   ├── layout/                 # Navbar, Footer
│   ├── map/                    # LeafletMap, GpxTrackLayer, MapModal
│   └── ui/                     # Componentes reutilizables (shadcn/ui)
├── features/                   # Modulos por dominio
│   ├── routes/                 # hooks + services
│   ├── route-calls/            # hooks + services + schemas
│   ├── reviews/                # hooks + services
│   ├── favorites/              # hooks + services
│   ├── attendances/            # hooks + services
│   └── photos/                 # hooks + services
├── lib/
│   ├── api/                    # Cliente HTTP, server fetch, query keys
│   ├── errors/                 # Manejo de errores personalizado
│   ├── providers/              # React Query + Theme providers
│   └── supabase/               # Cliente Supabase
├── types/                      # Interfaces TypeScript
├── hooks/                      # Hooks compartidos
└── constants/                  # Niveles, ritmos, puntos de encuentro
```

---

## Uso de CubePath

Hemos desplegado nuestro proyecto en **CubePath** utilizando dos de sus servicios principales:

- **Dokploy**: Gestion y despliegue de la aplicacion backend, asegurando disponibilidad y escalabilidad con deploys automatizados.
- **n8n**: Automatizacion de flujos clave como la gestion de convocatorias y notificaciones dentro de la plataforma.

Esta combinacion nos ha permitido construir un MVP funcional, integrado y preparado para crecer sin una infraestructura compleja.

---

## Instalacion Local

### Requisitos previos
- Node.js 18+
- npm, yarn, pnpm o bun

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/Adriasu09/los-inmaduros-frontend.git
cd los-inmaduros-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales (ver seccion siguiente)

# 4. Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de Entorno

```env
NEXT_PUBLIC_APP_URL=             # URL del frontend
NEXT_PUBLIC_API_URL=             # URL del backend API

# Clerk (Autenticacion)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Supabase (Base de datos + Storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Repositorios

| Repositorio | Enlace |
|-------------|--------|
| Frontend | [github.com/Adriasu09/los-inmaduros-frontend](https://github.com/Adriasu09/los-inmaduros-frontend) |
| Backend | [github.com/Adriasu09/los-inmaduros-backend](https://github.com/Adriasu09/los-inmaduros-backend) |

---

## Contacto

- **Email**: adsuarez09@gmail.com
- **Hackaton**: [CubePath Hackaton 2026 by midudev](https://github.com/midudev/hackaton-cubepath-2026)

---

<p align="center">
  Hecho con mucho patin por el equipo <strong>Los Inmaduros</strong>
</p>
