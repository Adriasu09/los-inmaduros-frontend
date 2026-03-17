import apiClient from "@/lib/api/client";
import type { Review, ApiResponse } from "@/types";

export async function createReview(
  routeId: string,
  data: { rating: number; comment?: string },
): Promise<ApiResponse<Review>> {
  return apiClient.post<ApiResponse<Review>>(
    `/routes/${routeId}/reviews`,
    data,
  );
}
