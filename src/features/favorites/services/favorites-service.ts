import apiClient from "@/lib/api/client";
import type { ApiResponse, Favorite } from "@/types";

export async function addFavorite(
  routeId: string,
): Promise<ApiResponse<Favorite>> {
  return apiClient.post<ApiResponse<Favorite>>(`/routes/${routeId}/favorites`);
}

export async function removeFavorite(
  routeId: string,
): Promise<ApiResponse<void>> {
  return apiClient.delete<ApiResponse<void>>(`/routes/${routeId}/favorites`);
}

export async function checkIsFavorite(
  routeId: string,
): Promise<ApiResponse<{ isFavorite: boolean }>> {
  return apiClient.get<ApiResponse<{ isFavorite: boolean }>>(
    `/favorites/check/${routeId}`,
  );
}

export async function getUserFavorites(): Promise<ApiResponse<Favorite[]>> {
  return apiClient.get<ApiResponse<Favorite[]>>("/favorites");
}
