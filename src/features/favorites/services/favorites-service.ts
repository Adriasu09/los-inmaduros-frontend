import apiClient from "@/lib/api/client";
import type { ApiResponse, Favorite } from "@/types";

/**
 * Añadir ruta a favoritos
 */
export async function addFavorite(
  routeId: string,
): Promise<ApiResponse<Favorite>> {
  return apiClient.post<ApiResponse<Favorite>>(`/routes/${routeId}/favorites`);
}

/**
 * Eliminar ruta de favoritos
 */
export async function removeFavorite(
  routeId: string,
): Promise<ApiResponse<void>> {
  return apiClient.delete<ApiResponse<void>>(`/routes/${routeId}/favorites`);
}

/**
 * Comprobar si una ruta está en favoritos
 */
export async function checkIsFavorite(
  routeId: string,
): Promise<ApiResponse<{ isFavorite: boolean }>> {
  return apiClient.get<ApiResponse<{ isFavorite: boolean }>>(
    `/favorites/check/${routeId}`,
  );
}

/**
 * Obtener todos los favoritos del usuario
 */
export async function getUserFavorites(): Promise<ApiResponse<Favorite[]>> {
  return apiClient.get<ApiResponse<Favorite[]>>("/favorites");
}
