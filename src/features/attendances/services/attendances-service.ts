import apiClient from "@/lib/api/client";
import type { ApiResponse, Attendance } from "@/types";

/**
 * Obtener asistentes de una convocatoria (público, para avatares)
 */
export async function getRouteCallAttendees(
  routeCallId: string,
): Promise<ApiResponse<Attendance[]>> {
  return apiClient.get<ApiResponse<Attendance[]>>(
    `/route-calls/${routeCallId}/attendances`,
  );
}

/**
 * Comprobar si el usuario actual está apuntado a una convocatoria
 */
export async function checkIsAttending(
  routeCallId: string,
): Promise<ApiResponse<{ isAttending: boolean }>> {
  return apiClient.get<ApiResponse<{ isAttending: boolean }>>(
    `/route-calls/${routeCallId}/attendances/check`,
  );
}

/**
 * Apuntarse a una convocatoria
 */
export async function joinRouteCall(
  routeCallId: string,
): Promise<ApiResponse<Attendance>> {
  return apiClient.post<ApiResponse<Attendance>>(
    `/route-calls/${routeCallId}/attendances`,
  );
}

/**
 * Desapuntarse de una convocatoria
 */
export async function leaveRouteCall(
  routeCallId: string,
): Promise<ApiResponse<Attendance>> {
  return apiClient.delete<ApiResponse<Attendance>>(
    `/route-calls/${routeCallId}/attendances`,
  );
}
