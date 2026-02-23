"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { Route } from "@/types";
import RouteCard from "./RouteCard";

interface RouteGridProps {
  routes: Route[];
}

export default function RouteGrid({ routes }: RouteGridProps) {
  const [search, setSearch] = useState("");

  const normalize = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filtered = routes.filter((route) =>
    normalize(route.name).includes(normalize(search)),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* BUSCADOR */}
      <div className="relative max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Buscar rutas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
        />
      </div>

      {/* GRID */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🛼</span>
          <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
            No encontramos rutas con ese nombre
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
            Prueba con otro término de búsqueda
          </p>
        </div>
      )}
    </div>
  );
}
