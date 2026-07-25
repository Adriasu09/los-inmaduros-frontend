import apiClient from "@/lib/api/client";
import type { ApiResponse, Attendance } from "@/types";

export async function getRouteCallAttendees(
  routeCallId: string,
): Promise<ApiResponse<Attendance[]>> {
  return apiClient.get<ApiResponse<Attendance[]>>(
    `/route-calls/${routeCallId}/attendances`,
  );
}

export async function checkIsAttending(
  routeCallId: string,
): Promise<ApiResponse<{ isAttending: boolean }>> {
  return apiClient.get<ApiResponse<{ isAttending: boolean }>>(
    `/route-calls/${routeCallId}/attendances/check`,
  );
}

export async function joinRouteCall(
  routeCallId: string,
): Promise<ApiResponse<Attendance>> {
  return apiClient.post<ApiResponse<Attendance>>(
    `/route-calls/${routeCallId}/attendances`,
  );
}

export async function leaveRouteCall(
  routeCallId: string,
): Promise<ApiResponse<Attendance>> {
  return apiClient.delete<ApiResponse<Attendance>>(
    `/route-calls/${routeCallId}/attendances`,
  );
}
