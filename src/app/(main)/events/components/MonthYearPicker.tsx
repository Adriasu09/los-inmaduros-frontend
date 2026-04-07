"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MONTH_NAMES_SHORT = [
  "Ene", "Feb", "Mar", "Abr",
  "May", "Jun", "Jul", "Ago",
  "Sep", "Oct", "Nov", "Dic",
];

const MONTH_NAMES_FULL = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

// Rango de años: desde 2025 (inicio del club) hasta el año siguiente al actual
const START_YEAR = 2025;

interface MonthYearPickerProps {
  value: string | undefined; // "YYYY-MM" o undefined
  onChange: (value: string | undefined) => void;
}

export default function MonthYearPicker({
  value,
  onChange,
}: MonthYearPickerProps) {
  const today = new Date();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    value ? parseInt(value.split("-")[0]) : today.getFullYear(),
  );

  const endYear = today.getFullYear() + 1;

  const selectedYear = value ? parseInt(value.split("-")[0]) : null;
  const selectedMonth = value ? parseInt(value.split("-")[1]) - 1 : null; // 0-indexed

  const label =
    value && selectedYear !== null && selectedMonth !== null
      ? `${MONTH_NAMES_SHORT[selectedMonth]} ${selectedYear}`
      : "Mes y año";

  function selectMonth(monthIndex: number) {
    const mm = String(monthIndex + 1).padStart(2, "0");
    onChange(`${viewYear}-${mm}`);
    setOpen(false);
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange(undefined);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={value ? `Filtro de fecha: ${label}` : "Filtrar por mes y año"}
          className={cn(
            "flex items-center gap-2 w-full sm:w-auto min-w-40 px-4 py-2 rounded-full border text-body-sm transition-all",
            "bg-card dark:bg-muted focus:outline-none focus:ring-2 focus:ring-primary",
            value
              ? "border-primary text-primary"
              : "border-border text-soft-foreground hover:border-primary hover:text-primary",
          )}
        >
          <CalendarDays size={15} className="shrink-0" />
          <span className="flex-1 text-left">{label}</span>
          {value ? (
            <X
              size={14}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
              onClick={clear}
              aria-label="Quitar filtro de fecha"
            />
          ) : (
            <ChevronRight size={14} className="shrink-0 opacity-40" />
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-64 p-3"
        align="start"
        role="dialog"
        aria-label="Seleccionar mes y año"
      >
        {/* Navegación de año */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            aria-label="Año anterior"
            disabled={viewYear <= START_YEAR}
            onClick={() => setViewYear((y) => y - 1)}
            className="p-1 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-body-sm font-semibold text-foreground">
            {viewYear}
          </span>

          <button
            type="button"
            aria-label="Año siguiente"
            disabled={viewYear >= endYear}
            onClick={() => setViewYear((y) => y + 1)}
            className="p-1 rounded-md hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Rejilla de meses */}
        <div
          className="grid grid-cols-3 gap-1"
          role="grid"
          aria-label={`Meses de ${viewYear}`}
        >
          {MONTH_NAMES_SHORT.map((name, i) => {
            const isSelected = selectedYear === viewYear && selectedMonth === i;
            return (
              <button
                key={i}
                type="button"
                role="gridcell"
                aria-label={`${MONTH_NAMES_FULL[i]} ${viewYear}`}
                aria-pressed={isSelected}
                onClick={() => selectMonth(i)}
                className={cn(
                  "py-1.5 rounded-md text-caption font-medium transition-all",
                  isSelected
                    ? "bg-primary text-white"
                    : "hover:bg-muted text-soft-foreground",
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
