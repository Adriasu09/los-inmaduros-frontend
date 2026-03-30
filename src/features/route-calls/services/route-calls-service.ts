import apiClient from "@/lib/api/client";
import { serverFetch } from "@/lib/api/server-fetch";
import type { RouteCall, ApiResponse } from "@/types";

// Para Client Components (React Query hooks)
export async function getUpcomingRouteCalls(): Promise<
  ApiResponse<RouteCall[]>
> {
  return apiClient.get<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=true&limit=3",
  );
}

// Para Server Components (page.tsx)
export async function getUpcomingRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=true&limit=3",
  );
}
