"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { RouteCall, RoutePace } from "@/types";
import { ROUTE_PACES, PACE_ORDER } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { normalize } from "@/lib/utils";
import RouteCallCard from "@/components/home/RouteCallCard";

interface EventsContentProps {
  routeCalls: RouteCall[];
}

export default function EventsContent({ routeCalls }: EventsContentProps) {
  const [search, setSearch] = useState("");
  const [selectedPace, setSelectedPace] = useState<RoutePace | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const { upcoming, past } = useMemo(() => {
    const filtered = routeCalls.filter((rc) => {
      const matchesSearch = normalize(rc.title).includes(
        normalize(debouncedSearch),
      );
      const matchesPace =
        selectedPace === null || rc.paces.includes(selectedPace);
      return matchesSearch && matchesPace;
    });

    const upcoming = filtered
      .filter((rc) => rc.status === "SCHEDULED" || rc.status === "ONGOING")
      .sort(
        (a, b) =>
          new Date(a.dateRoute).getTime() - new Date(b.dateRoute).getTime(),
      );

    const past = filtered
      .filter((rc) => rc.status === "COMPLETED" || rc.status === "CANCELLED")
      .sort(
        (a, b) =>
          new Date(b.dateRoute).getTime() - new Date(a.dateRoute).getTime(),
      );

    return { upcoming, past };
  }, [routeCalls, debouncedSearch, selectedPace]);

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative sm:w-64 shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint-foreground"
          />
          <input
            type="text"
            placeholder="Buscar convocatorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-card dark:bg-muted border border-border text-foreground placeholder:text-faint-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div className="hidden sm:block h-6 w-px bg-border" />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedPace(null)}
            className={`px-3 py-1.5 rounded-full text-caption font-medium border transition-all ${
              selectedPace === null
                ? "bg-primary-hover text-white border-primary-hover"
                : "bg-card dark:bg-muted text-soft-foreground border-border hover:border-primary"
            }`}
          >
            Todos
          </button>

          {PACE_ORDER.map((pace) => (
            <button
              key={pace}
              onClick={() =>
                setSelectedPace(selectedPace === pace ? null : pace)
              }
              className={`px-3 py-1.5 rounded-full text-caption font-medium border transition-all ${
                selectedPace === pace
                  ? "bg-primary-hover text-white border-primary-hover"
                  : "bg-card dark:bg-muted text-soft-foreground border-border hover:border-primary"
              }`}
            >
              {ROUTE_PACES[pace].emoji} {ROUTE_PACES[pace].label}
            </button>
          ))}
        </div>
      </div>

      {/* PRÓXIMAS RUTAS */}
      {upcoming.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((rc) => (
            <RouteCallCard key={rc.id} routeCall={rc} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🛼</span>
          <p className="text-muted-foreground text-subheading font-medium">
            No hay convocatorias próximas
          </p>
          <p className="text-faint-foreground text-body-sm mt-1">
            {debouncedSearch || selectedPace
              ? "Prueba con otros filtros"
              : "¡Sé el primero en crear una!"}
          </p>
        </div>
      )}

      {/* SEPARADOR RUTAS PASADAS */}
      <div className="border-t border-border pt-8 mt-4">
        <h2 className="text-heading text-muted-foreground text-center">
          Rutas Pasadas
        </h2>
      </div>

      {/* RUTAS PASADAS */}
      {past.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {past.map((rc) => (
            <RouteCallCard key={rc.id} routeCall={rc} variant="past" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-body-sm">
            {debouncedSearch || selectedPace
              ? "No hay rutas pasadas con esos filtros"
              : "Aún no hay rutas pasadas"}
          </p>
        </div>
      )}
    </div>
  );
}
