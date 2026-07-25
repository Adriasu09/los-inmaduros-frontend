import apiClient from "@/lib/api/client";
import { serverFetch } from "@/lib/api/server-fetch";
import type {
  RouteCall,
  ApiResponse,
  RoutePace,
  MeetingPointType,
} from "@/types";

// Uses optional (not null) to match backend Zod .optional() validation.
export interface CreateRouteCallMeetingPoint {
  type: MeetingPointType;
  name: string;
  customName?: string;
  location?: string;
  time?: string;
}

export interface CreateRouteCallPayload {
  routeId?: string;
  title?: string;
  description?: string;
  dateRoute: string;
  paces: RoutePace[];
  meetingPoints: CreateRouteCallMeetingPoint[];
}

export interface UpdateRouteCallPayload {
  title?: string;
  description?: string | null;
  image?: string;
  dateRoute?: string;
  paces?: RoutePace[];
}

export interface RouteCallFilters {
  upcoming: boolean;
  pace?: RoutePace;
  month?: string; // "YYYY-MM"
  limit?: number;
}

// `*Server` functions use serverFetch and run in server components;
// the rest use apiClient (axios) and run in client components.

export async function getFilteredRouteCalls(
  filters: RouteCallFilters,
): Promise<ApiResponse<RouteCall[]>> {
  const params = new URLSearchParams();
  params.set("upcoming", String(filters.upcoming));
  params.set("limit", String(filters.limit ?? 100));
  if (filters.pace) params.set("pace", filters.pace);
  if (filters.month) params.set("month", filters.month);
  return apiClient.get<ApiResponse<RouteCall[]>>(`/route-calls?${params}`);
}

export async function getUpcomingRouteCalls(): Promise<
  ApiResponse<RouteCall[]>
> {
  return apiClient.get<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=true&limit=3",
  );
}

export async function getUpcomingRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=true&limit=3",
  );
}

// Despite the name, the backend still applies its default page size (20)
// when no `limit` is sent — this is NOT an unpaginated "get everything".
export async function getAllRouteCalls(): Promise<ApiResponse<RouteCall[]>> {
  return apiClient.get<ApiResponse<RouteCall[]>>("/route-calls?limit=100");
}

export async function getAllRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>("/route-calls?limit=100");
}

// Upcoming: SCHEDULED + ONGOING + recently CANCELLED.
export async function getAllUpcomingRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=true&limit=100",
  );
}

// Past: COMPLETED + older CANCELLED.
export async function getPastRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=false&limit=100",
  );
}

export async function getRouteCallById(
  id: string,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.get<ApiResponse<RouteCall>>(`/route-calls/${id}`);
}

export async function getRouteCallByIdServer(
  id: string,
): Promise<ApiResponse<RouteCall> | null> {
  return serverFetch<ApiResponse<RouteCall>>(`/route-calls/${id}`);
}

export async function createRouteCall(
  data: CreateRouteCallPayload,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.post<ApiResponse<RouteCall>>("/route-calls", data);
}

export async function updateRouteCall(
  id: string,
  data: UpdateRouteCallPayload,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.patch<ApiResponse<RouteCall>>(`/route-calls/${id}`, data);
}

export async function cancelRouteCall(
  id: string,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.patch<ApiResponse<RouteCall>>(`/route-calls/${id}/cancel`);
}

export async function deleteRouteCall(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  return apiClient.delete<{ success: boolean; message?: string }>(
    `/route-calls/${id}`,
  );
}