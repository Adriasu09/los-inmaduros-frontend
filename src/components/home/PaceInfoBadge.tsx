"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";
import { ROUTE_PACES, PACE_ORDER } from "@/constants";
import type { RoutePace } from "@/types";

interface PaceInfoBadgeProps {
  pace: RoutePace;
}

export default function PaceInfoBadge({ pace }: PaceInfoBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentPace = ROUTE_PACES[pace];

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* BADGE: emoji + icono info */}
      <div className="flex items-center gap-1.5">
        <span className="text-caption font-semibold text-primary">Ritmo:</span>
        <span className="text-body" title={currentPace.label}>
          {currentPace.emoji}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label="Ver info de ritmos"
        >
          <Info size={14} />
        </button>
      </div>

      {/* MODAL — renderizado vía portal fuera del DOM de la card */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* MODAL */}
            <div
              className="relative bg-card dark:bg-muted rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6 border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-body font-bold text-foreground">
                  Ritmos de ruta
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* LISTA DE RITMOS */}
              <div className="space-y-3">
                {PACE_ORDER.map((paceKey) => {
                  const p = ROUTE_PACES[paceKey];
                  const isActive = paceKey === pace;
                  return (
                    <div
                      key={paceKey}
                      className={`rounded-xl p-3 transition-colors ${
                        isActive
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-background/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-body">{p.emoji}</span>
                        <span
                          className={`text-body-sm font-bold ${isActive ? "text-primary" : "text-foreground"}`}
                        >
                          {p.label}
                        </span>
                      </div>
                      <p className="text-caption text-muted-foreground leading-relaxed">
                        {ROUTE_PACES[paceKey].description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* PROGRESIÓN */}
              <p className="text-caption text-muted-foreground text-center mt-4">
                🪨🔜🐌🔜🐛🔜🦋🔜🚀🔜☠️🔜🐈🦄
              </p>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
