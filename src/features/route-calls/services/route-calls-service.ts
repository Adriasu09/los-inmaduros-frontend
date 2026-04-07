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

// Filtros para obtener convocatorias desde el backend
export interface RouteCallFilters {
  upcoming: boolean;
  pace?: RoutePace;
  month?: string; // "YYYY-MM"
  limit?: number;
}

// Para Client Components — convocatorias filtradas desde el backend
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

// Para Server Components — convocatorias próximas (SCHEDULED + ONGOING + CANCELLED recientes)
export async function getAllUpcomingRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=true&limit=100",
  );
}

// Para Server Components — convocatorias pasadas (COMPLETED + CANCELLED antiguas)
export async function getPastRouteCallsServer(): Promise<ApiResponse<
  RouteCall[]
> | null> {
  return serverFetch<ApiResponse<RouteCall[]>>(
    "/route-calls?upcoming=false&limit=100",
  );
}

// Para Client Components — una convocatoria por ID
export async function getRouteCallById(
  id: string,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.get<ApiResponse<RouteCall>>(`/route-calls/${id}`);
}

// Para Server Components — una convocatoria por ID
export async function getRouteCallByIdServer(
  id: string,
): Promise<ApiResponse<RouteCall> | null> {
  return serverFetch<ApiResponse<RouteCall>>(`/route-calls/${id}`);
}

// Crear una nueva convocatoria
export async function createRouteCall(
  data: CreateRouteCallPayload,
): Promise<ApiResponse<RouteCall>> {
  return apiClient.post<ApiResponse<RouteCall>>("/route-calls", data);
}
