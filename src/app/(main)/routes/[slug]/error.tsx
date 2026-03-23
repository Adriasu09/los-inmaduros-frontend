"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RouteDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error al cargar el detalle de la ruta:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl">🗺️</span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">
          No pudimos cargar esta ruta
        </h1>
        <p className="mt-3 text-muted-foreground">
          Hubo un problema al obtener los datos de esta ruta. Puedes intentarlo
          de nuevo o explorar otras rutas.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="sm">
            Reintentar
          </Button>
          <Link
            href="/routes"
            className="px-6 py-2.5 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
          >
            Ver todas las rutas
          </Link>
        </div>
      </div>
    </div>
  );
}
