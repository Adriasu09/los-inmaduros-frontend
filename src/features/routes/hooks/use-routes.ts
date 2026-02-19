import { useQuery } from "@tanstack/react-query";
import { getRouteBySlug, getRoutes } from "../services/routes-service";
import { queryKeys } from "@/lib/api/query-keys";

/**
 * Hook to get all routes
 */
export function useRoutes() {
  return useQuery({
    queryKey: queryKeys.routes.all,
    queryFn: getRoutes,
  });
}

/**
 * Hook to obtain a specific route by slug
 */
export function useRoute(slug: string) {
  return useQuery({
    queryKey: queryKeys.routes.detail(slug),
    queryFn: () => getRouteBySlug(slug),
    enabled: !!slug,
  });
}
