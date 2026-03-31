"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";
import { PREDEFINED_MEETING_POINTS } from "@/constants";
import { cn } from "@/lib/utils";

// Dynamic import for SSR safety
const MapPointPicker = dynamic(
  () => import("@/components/map/MapPointPicker"),
  {
    ssr: false,
    loading: () => (
      <div className="h-50 w-full rounded-lg bg-muted animate-pulse flex items-center justify-center">
        <p className="text-caption text-faint-foreground">Cargando mapa...</p>
      </div>
    ),
  },
);

export interface MeetingPointValue {
  predefinedId: string | null;
  customName: string | null;
  location: string | null;
  time: string | null;
}

interface MeetingPointSelectorProps {
  value: MeetingPointValue;
  onChange: (value: MeetingPointValue) => void;
  showTimeInput: boolean;
  label: string;
  error?: string;
  timeError?: string;
}

export default function MeetingPointSelector({
  value,
  onChange,
  showTimeInput,
  label,
  error,
  timeError,
}: MeetingPointSelectorProps) {
  const [showMap, setShowMap] = useState(false);

  const selectedPredefined = useMemo(
    () =>
      PREDEFINED_MEETING_POINTS.find((mp) => mp.id === value.predefinedId) ??
      null,
    [value.predefinedId],
  );

  const isCustom = value.predefinedId === null && value.customName !== null;

  const handlePredefinedSelect = (pointId: string) => {
    const point = PREDEFINED_MEETING_POINTS.find((mp) => mp.id === pointId);
    if (point) {
      onChange({
        ...value,
        predefinedId: point.id,
        customName: null,
        location: `${point.coordinates[0]},${point.coordinates[1]}`,
      });
      setShowMap(false);
    }
  };

  const handleCustomSelect = () => {
    onChange({
      ...value,
      predefinedId: null,
      customName: value.customName ?? "",
      location: value.location,
    });
    setShowMap(true);
  };

  const handleCustomNameChange = (name: string) => {
    onChange({
      ...value,
      customName: name,
    });
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    onChange({
      ...value,
      location: `${lat.toFixed(6)},${lng.toFixed(6)}`,
    });
  };

  const handleTimeChange = (time: string) => {
    onChange({
      ...value,
      time,
    });
  };

  // Parse location string to coordinates
  const markerPosition = useMemo((): [number, number] | null => {
    if (!value.location) return null;
    const [lat, lng] = value.location.split(",").map(Number);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  }, [value.location]);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-label font-semibold text-foreground">
        {label}
      </label>

      {/* Predefined options */}
      <div className="flex flex-col gap-2">
        {PREDEFINED_MEETING_POINTS.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => handlePredefinedSelect(point.id)}
            className={cn(
              "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border text-body-sm text-left transition-all touch-manipulation",
              value.predefinedId === point.id
                ? "bg-primary/10 border-primary/30 text-foreground"
                : "bg-muted border-border text-muted-foreground hover:border-primary/20",
            )}
          >
            <span className="font-medium">{point.name}</span>
            <a
              href={point.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-primary hover:text-primary-hover shrink-0"
              title="Ver en Google Maps"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </button>
        ))}

        {/* Custom option */}
        <button
          type="button"
          onClick={handleCustomSelect}
          className={cn(
            "px-3 py-2.5 rounded-lg border text-body-sm font-medium text-left transition-all touch-manipulation",
            isCustom
              ? "bg-primary/10 border-primary/30 text-foreground"
              : "bg-muted border-border text-muted-foreground hover:border-primary/20",
          )}
        >
          Otro punto...
        </button>
      </div>

      {/* Custom point details */}
      {isCustom && (
        <div className="flex flex-col gap-3 pl-3 border-l-2 border-primary/20">
          <input
            type="text"
            value={value.customName ?? ""}
            onChange={(e) => handleCustomNameChange(e.target.value)}
            placeholder="Nombre del punto de encuentro"
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground placeholder:text-faint-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="text-caption text-muted-foreground">
            Toca el mapa para marcar la ubicación exacta
          </p>

          <MapPointPicker
            markerPosition={markerPosition}
            onLocationSelect={handleLocationSelect}
            interactive={true}
          />
        </div>
      )}

      {/* Show mini-map for predefined selection */}
      {selectedPredefined && (
        <MapPointPicker
          markerPosition={selectedPredefined.coordinates as unknown as [number, number]}
          onLocationSelect={() => {}}
          center={selectedPredefined.coordinates as unknown as [number, number]}
          interactive={false}
          className="h-37.5 w-full rounded-lg overflow-hidden"
        />
      )}

      {/* Time input for secondary meeting point */}
      {showTimeInput && (
        <div className="flex flex-col gap-1.5">
          <label className="text-caption font-medium text-soft-foreground">
            Hora del punto secundario *
          </label>
          <input
            type="time"
            value={value.time ?? ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-3 py-2.5 text-body-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {timeError && (
            <p className="text-destructive text-caption">{timeError}</p>
          )}
        </div>
      )}

      {error && (
        <p className="text-destructive text-caption">{error}</p>
      )}
    </div>
  );
}
