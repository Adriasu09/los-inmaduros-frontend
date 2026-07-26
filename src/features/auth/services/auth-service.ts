import apiClient from "@/lib/api/client";
import type { ApiResponse, User } from "@/types";

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return apiClient.get<ApiResponse<User>>("/auth/me");
}