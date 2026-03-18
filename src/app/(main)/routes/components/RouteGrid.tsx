"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { Route, RouteLevel } from "@/types";
import { ROUTE_LEVELS } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import RouteCard from "./RouteCard";

interface RouteGridProps {
  routes: Route[];
}

// Fuera del componente: función pura que no depende del estado
const normalize = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function RouteGrid({ routes }: RouteGridProps) {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<RouteLevel | null>(null);

  // El input actualiza 'search' inmediatamente (UI responsive),
  // pero el filtrado solo se recalcula 300ms después de que el usuario para de escribir
  const debouncedSearch = useDebounce(search, 300);

  const availableLevels = useMemo(() => {
    const levelsInRoutes = new Set(routes.flatMap((r) => r.level));
    return (Object.keys(ROUTE_LEVELS) as RouteLevel[]).filter((lvl) =>
      levelsInRoutes.has(lvl),
    );
  }, [routes]);

  const filtered = useMemo(
    () =>
      routes.filter((route) => {
        const matchesSearch = normalize(route.name).includes(
          normalize(debouncedSearch),
        );
        const matchesLevel =
          selectedLevel === null || route.level.includes(selectedLevel);
        return matchesSearch && matchesLevel;
      }),
    [routes, debouncedSearch, selectedLevel],
  );

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* BARRA DE BÚSQUEDA + FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        {/* Buscador */}
        <div className="relative sm:w-64 shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Buscar rutas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          />
        </div>

        {/* Separador visual solo en desktop */}
        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700" />

        {/* Pills de nivel */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLevel(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              selectedLevel === null
                ? "bg-sky-500 text-white border-sky-500"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400"
            }`}
          >
            Todos
          </button>

          {availableLevels.map((level) => (
            <button
              key={level}
              onClick={() =>
                setSelectedLevel(selectedLevel === level ? null : level)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedLevel === level
                  ? ROUTE_LEVELS[level].activeFilter
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-sky-400"
              }`}
            >
              {ROUTE_LEVELS[level].label}
            </button>
          ))}
        </div>
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
