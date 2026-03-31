"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { ROUTE_PACES, PACE_ORDER } from "@/constants";
import type { RoutePace } from "@/types";
import { cn } from "@/lib/utils";

interface PaceMultiSelectProps {
  selected: RoutePace[];
  onChange: (paces: RoutePace[]) => void;
  error?: string;
}

export default function PaceMultiSelect({
  selected,
  onChange,
  error,
}: PaceMultiSelectProps) {
  const [showInfo, setShowInfo] = useState(false);

  const togglePace = (pace: RoutePace) => {
    if (selected.includes(pace)) {
      onChange(selected.filter((p) => p !== pace));
    } else {
      onChange([...selected, pace]);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <label className="text-label font-semibold text-foreground">
          Ritmo
        </label>
        <button
          type="button"
          onClick={() => setShowInfo(true)}
          className="text-muted-foreground hover:text-primary transition-colors"
          title="Información sobre los ritmos"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Pace grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {PACE_ORDER.map((key) => {
          const pace = ROUTE_PACES[key];
          const isSelected = selected.includes(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => togglePace(key)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg border text-body-sm font-medium transition-all touch-manipulation",
                isSelected
                  ? "bg-primary/10 border-primary/30 text-foreground"
                  : "bg-muted border-border text-muted-foreground hover:border-primary/20 hover:bg-primary/5",
              )}
            >
              <span className="text-base">{pace.emoji}</span>
              <span>{pace.label}</span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-destructive text-caption">{error}</p>
      )}

      {/* Info modal */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="bg-card rounded-2xl shadow-2xl w-full max-w-sm max-h-[80vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-subheading font-bold text-foreground">
                Niveles de ritmo
              </h3>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="text-faint-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center text-body-sm text-muted-foreground mb-4">
              {PACE_ORDER.map((key, i) => (
                <span key={key}>
                  {ROUTE_PACES[key].emoji}
                  {i < PACE_ORDER.length - 1 && (
                    <span className="mx-0.5">{"🔜"}</span>
                  )}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {PACE_ORDER.map((key) => {
                const pace = ROUTE_PACES[key];
                const isActive = selected.includes(key);
                return (
                  <div
                    key={key}
                    className={cn(
                      "p-3 rounded-lg",
                      isActive
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted",
                    )}
                  >
                    <p className="font-semibold text-body-sm text-foreground mb-0.5">
                      {pace.emoji} {pace.label}
                    </p>
                    <p className="text-caption text-muted-foreground">
                      {pace.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
