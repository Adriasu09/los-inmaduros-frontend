"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ApiError } from "@/lib/errors";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              // Única capa de reintentos (la de HttpClient se retiró).
              // Solo errores transitorios (red, timeout, 5xx), reutilizando la
              // misma lógica de ApiError.isRetryable(). Los 4xx (auth,
              // validación, 404) NO se reintentan: no cambiaría el resultado.
              if (error instanceof ApiError) {
                return error.isRetryable() && failureCount < 1;
              }
              return false;
            },
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
