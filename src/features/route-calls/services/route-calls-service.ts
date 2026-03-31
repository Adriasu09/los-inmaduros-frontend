import apiClient from "@/lib/api/client";
import { serverFetch } from "@/lib/api/server-fetch";
import type {
  RouteCall,
  ApiResponse,
  RoutePace,
  MeetingPointType,
} from "@/types";

// Payload para crear una convocatoria
// Uses optional (not null) to match backend Zod .optional() validation
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

// Para Client Components — todas las convocatorias (sin filtro)
export async function getAllRouteCalls(): Promise<ApiResponse<RouteCall[]>> {
  return apiClient.get<ApiResponse<RouteCall[]>>("/route-calls");
}

// Para Server Components — todas las convocatorias (sin filtro)
export async function getAllRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>("/route-calls");
}

// Crear una nueva convocatoria
export async function createRouteCall(
  data: CreateRouteCallPayload,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.post<ApiResponse<RouteCall>>("/route-calls", data);
}
