"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setClerkTokenGetter } from "@/lib/api/client";

/**
 * Sincroniza el token JWT de Clerk con el apiClient de axios.
 * Debe montarse dentro de ClerkProvider.
 */
export function ClerkAxiosSync() {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      setClerkTokenGetter(getToken);
    } else {
      setClerkTokenGetter(null);
    }

    return () => {
      setClerkTokenGetter(null);
    };
  }, [isSignedIn, getToken]);

  return null;
}
