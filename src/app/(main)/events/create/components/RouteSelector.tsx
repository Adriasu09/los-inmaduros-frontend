"use client";

import { useRoutes } from "@/features/routes";
import type { Route } from "@/types";

interface RouteSelectorProps {
  selectedRouteId: string | null;
  onRouteChange: (route: Route | null) => void;
  customTitle: string;
  onCustomTitleChange: (title: string) => void;
  error?: string;
  titleError?: string;
}

export default function RouteSelector({
  selectedRouteId,
  onRouteChange,
  customTitle,
  onCustomTitleChange,
  error,
  titleError,
}: RouteSelectorProps) {
  const { data, isLoading } = useRoutes();
  const routes = data?.data ?? [];
  const isCustomRoute = selectedRouteId === null && customTitle !== undefined;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "") {
      // placeholder, no change
      return;
    }

    if (value === "custom") {
      onRouteChange(null);
      return;
    }

    const route = routes.find((r) => r.id === value);
    if (route) {
      onRouteChange(route);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-label font-semibold text-foreground">
        Ruta
      </label>

      <select
        value={selectedRouteId ?? (isCustomRoute ? "custom" : "")}
        onChange={handleSelectChange}
        disabled={isLoading}
        className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
      >
        <option value="" disabled>
          {isLoading ? "Cargando rutas..." : "Selecciona una ruta"}
        </option>
        <option value="custom">Ruta personalizada</option>
        {routes.map((route) => (
          <option key={route.id} value={route.id}>
            {route.name}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-destructive text-caption">{error}</p>
      )}

      {/* Campo de título para ruta personalizada */}
      {selectedRouteId === null && (
        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-medium text-soft-foreground">
            Nombre de la convocatoria *
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => onCustomTitleChange(e.target.value)}
            placeholder="Ej: Ruta Primavera - Madrid Río"
            maxLength={100}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground placeholder:text-faint-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {titleError && (
            <p className="text-destructive text-caption">{titleError}</p>
          )}
        </div>
      )}
    </div>
  );
}
