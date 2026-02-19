import apiClient from "@/lib/api/client";
import type { Route, ApiResponse } from "@/types";

/**
 * Get all predefined routes
 */
export async function getRoutes(): Promise<ApiResponse<Route[]>> {
  const response = await apiClient.get<ApiResponse<Route[]>>("/routes");
  return response.data;
}

/**
 * Get a route by its slug
 */
export async function getRouteBySlug(
  slug: string,
): Promise<ApiResponse<Route>> {
  const response = await apiClient.get<ApiResponse<Route>>(`/routes/${slug}`);
  return response.data;
}
