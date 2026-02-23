import apiClient from "@/lib/api/client";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Route, ApiResponse } from "@/types";

// ✅ Para Client Components (React Query hooks)
export async function getRoutes(): Promise<ApiResponse<Route[]>> {
  return apiClient.get<ApiResponse<Route[]>>("/routes");
}

export async function getRouteBySlug(
  slug: string,
): Promise<ApiResponse<Route>> {
  return apiClient.get<ApiResponse<Route>>(`/routes/${slug}`);
}

// ✅ Para Server Components (page.tsx)
export async function getRoutesServer(): Promise<ApiResponse<Route[]>> {
  return serverFetch<ApiResponse<Route[]>>("/routes");
}

export async function getRouteBySlugServer(
  slug: string,
): Promise<ApiResponse<Route>> {
  return serverFetch<ApiResponse<Route>>(`/routes/${slug}`);
}
