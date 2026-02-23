"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";
import apiClient from "@/lib/api/client";

/**
 * Configura el token de Clerk en el apiClient antes de cada petición.
 * Usar este hook en cualquier componente que necesite llamadas autenticadas.
 */
export function useApiClient() {
  const { getToken } = useAuth();

  const setAuthToken = useCallback(async () => {
    const token = await getToken();
    if (token) {
      apiClient.setAuthToken(token);
    } else {
      apiClient.clearAuthToken();
    }
  }, [getToken]);

  return { setAuthToken };
}
