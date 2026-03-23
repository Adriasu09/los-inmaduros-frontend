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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <span className="text-6xl">😵‍💫</span>
        <h1 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          Algo fue mal
        </h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">
          Ha ocurrido un error inesperado. Puedes intentarlo de nuevo o volver
          al inicio.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="sm">
            Reintentar
          </Button>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full border-2 border-sky-400 text-sky-400 font-semibold hover:bg-sky-400/10 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
