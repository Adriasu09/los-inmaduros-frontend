"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setClerkTokenGetter } from "@/lib/api/client";

// Syncs the Clerk JWT into the axios apiClient. Must be mounted inside ClerkProvider.
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
