"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Error no capturado:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl">😵‍💫</span>
        <h1 className="mt-6 text-heading text-2xl text-foreground">
          Algo fue mal
        </h1>
        <p className="mt-3 text-muted-foreground">
          Ha ocurrido un error inesperado. Puedes intentarlo de nuevo o volver
          al inicio.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="sm">
            Reintentar
          </Button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/10 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
