import { useQuery } from "@tanstack/react-query";
import { getRoutes, getRouteBySlug } from "@/lib/api/routes";

/**
 * Hook to get all routes
 */
export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: getRoutes,
  });
}

/**
 * Hook to obtain a specific route by slug
 */
export function useRoute(slug: string) {
  return useQuery({
    queryKey: ["route", slug],
    queryFn: () => getRouteBySlug(slug),
    enabled: !!slug,
  });
}
