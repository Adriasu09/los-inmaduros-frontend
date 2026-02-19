"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto - Los datos se consideran "frescos" durante este tiempo
            gcTime: 5 * 60 * 1000, // 5 minutos - Tiempo que los datos permanecen en caché
            retry: 1, // Solo reintenta 1 vez si falla
            refetchOnWindowFocus: false, // No refrescar al volver a la ventana
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
