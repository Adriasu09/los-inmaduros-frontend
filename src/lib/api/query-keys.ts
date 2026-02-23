/**
 * Query Keys Factory
 * Centralized and type-safe query keys for React Query
 *
 * Inspired by TanStack Query best practices
 */

export const queryKeys = {
  // Routes (rutas predefinidas)
  routes: {
    all: ["routes"] as const,
    lists: () => [...queryKeys.routes.all, "list"] as const,
    list: <T = unknown>(filters?: T) =>
      [...queryKeys.routes.lists(), filters] as const,
    details: () => [...queryKeys.routes.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.routes.details(), slug] as const,
  },

  // Route Calls (convocatorias)
  routeCalls: {
    all: ["route-calls"] as const,
    lists: () => [...queryKeys.routeCalls.all, "list"] as const,
    list: <T = unknown>(filters?: T) =>
      [...queryKeys.routeCalls.lists(), filters] as const,
    details: () => [...queryKeys.routeCalls.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.routeCalls.details(), id] as const,
  },

  // Reviews
  reviews: {
    all: ["reviews"] as const,
    lists: () => [...queryKeys.reviews.all, "list"] as const,
    byRoute: (routeId: string) =>
      [...queryKeys.reviews.lists(), routeId] as const,
  },

  // Favorites
  favorites: {
    all: ["favorites"] as const,
    lists: () => [...queryKeys.favorites.all, "list"] as const,
    my: () => [...queryKeys.favorites.lists(), "my"] as const,
    check: (routeId: string) =>
      [...queryKeys.favorites.all, "check", routeId] as const,
  },

  // Photos
  photos: {
    all: ["photos"] as const,
    lists: () => [...queryKeys.photos.all, "list"] as const,
    list: <T = unknown>(filters?: T) =>
      [...queryKeys.photos.lists(), filters] as const,
    byRoute: (routeId: string) =>
      [...queryKeys.photos.lists(), routeId] as const,
    byRouteCall: (routeCallId: string) =>
      [...queryKeys.photos.lists(), routeCallId] as const,
  },
} as const;
