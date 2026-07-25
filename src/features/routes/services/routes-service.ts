import apiClient from "@/lib/api/client";
import { serverFetch } from "@/lib/api/server-fetch";
import type { Route, ApiResponse, RouteDetail } from "@/types";

// `*Server` functions use serverFetch and run in server components;
// the rest use apiClient (axios) and run in client components.

export async function getRoutes(): Promise<ApiResponse<Route[]>> {
  return apiClient.get<ApiResponse<Route[]>>("/routes");
}

export async function getRouteBySlug(
  slug: string,
): Promise<ApiResponse<RouteDetail>> {
  return apiClient.get<ApiResponse<RouteDetail>>(`/routes/${slug}`);
}

export async function getRoutesServer(): Promise<ApiResponse<Route[]> | null> {
  return serverFetch<ApiResponse<Route[]>>("/routes");
}

export async function getRouteBySlugServer(
  slug: string,
): Promise<ApiResponse<RouteDetail> | null> {
  return serverFetch<ApiResponse<RouteDetail>>(`/routes/${slug}`);
}
