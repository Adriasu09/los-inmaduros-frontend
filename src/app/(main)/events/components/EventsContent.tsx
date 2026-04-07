"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import type { RouteCall, RoutePace } from "@/types";
import { ROUTE_PACES, PACE_ORDER } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, normalize } from "@/lib/utils";
import { useFilteredRouteCalls } from "@/features/route-calls";
import type { RouteCallFilters } from "@/features/route-calls";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RouteCallCard from "@/components/home/RouteCallCard";
import MonthYearPicker from "./MonthYearPicker";

const PAGE_SIZE = 6;

type Tab = "upcoming" | "past";

interface EventsContentProps {
  initialUpcoming: RouteCall[];
  initialPast: RouteCall[];
}

export default function EventsContent({
  initialUpcoming,
  initialPast,
}: EventsContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [search, setSearch] = useState("");
  const [selectedPace, setSelectedPace] = useState<RoutePace | "all">("all");
  const [selectedMonth, setSelectedMonth] = useState<string | undefined>(
    undefined,
  );
  const [upcomingVisible, setUpcomingVisible] = useState(PAGE_SIZE);
  const [pastVisible, setPastVisible] = useState(PAGE_SIZE);

  const debouncedSearch = useDebounce(search, 300);

  // Filtros para backend
  const upcomingFilters: RouteCallFilters = {
    upcoming: true,
    pace: selectedPace !== "all" ? selectedPace : undefined,
    month: selectedMonth,
  };

  const pastFilters: RouteCallFilters = {
    upcoming: false,
    pace: selectedPace !== "all" ? selectedPace : undefined,
    month: selectedMonth,
  };

  const hasActiveFilters = selectedPace !== "all" || selectedMonth !== undefined;

  const {
    data: upcomingData = initialUpcoming,
    isFetching: isFetchingUpcoming,
  } = useFilteredRouteCalls(upcomingFilters);

  const { data: pastData = initialPast, isFetching: isFetchingPast } =
    useFilteredRouteCalls(pastFilters);

  // Búsqueda client-side sobre resultados del server
  const filteredUpcoming = useMemo(
    () =>
      debouncedSearch
        ? upcomingData.filter((rc) =>
            normalize(rc.title).includes(normalize(debouncedSearch)),
          )
        : upcomingData,
    [upcomingData, debouncedSearch],
  );

  const filteredPast = useMemo(
    () =>
      debouncedSearch
        ? pastData.filter((rc) =>
            normalize(rc.title).includes(normalize(debouncedSearch)),
          )
        : pastData,
    [pastData, debouncedSearch],
  );

  // Reset visible counts when filters change
  useEffect(() => {
    setUpcomingVisible(PAGE_SIZE);
    setPastVisible(PAGE_SIZE);
  }, [debouncedSearch, selectedPace, selectedMonth]);

  const visibleUpcoming = filteredUpcoming.slice(0, upcomingVisible);
  const visiblePast = filteredPast.slice(0, pastVisible);

  const hasMoreUpcoming = upcomingVisible < filteredUpcoming.length;
  const hasMorePast = pastVisible < filteredPast.length;

  const activeList = activeTab === "upcoming" ? visibleUpcoming : visiblePast;
  const filteredActiveTotal =
    activeTab === "upcoming" ? filteredUpcoming.length : filteredPast.length;
  const hasMore = activeTab === "upcoming" ? hasMoreUpcoming : hasMorePast;
  const isFetching =
    activeTab === "upcoming" ? isFetchingUpcoming : isFetchingPast;

  function loadMore() {
    if (activeTab === "upcoming") {
      setUpcomingVisible((v) => v + PAGE_SIZE);
    } else {
      setPastVisible((v) => v + PAGE_SIZE);
    }
  }

  const noResultsMessage =
    debouncedSearch || hasActiveFilters
      ? "Prueba con otros filtros"
      : activeTab === "upcoming"
        ? "¡Sé el primero en crear una!"
        : "Aún no hay rutas pasadas";

  const noResultsTitle =
    activeTab === "upcoming"
      ? "No hay convocatorias próximas"
      : "No hay rutas pasadas";

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* TABS */}
      <div
        role="tablist"
        aria-label="Tipo de convocatorias"
        className="flex border-b border-border"
      >
        <button
          role="tab"
          id="tab-upcoming"
          aria-selected={activeTab === "upcoming"}
          aria-controls="tabpanel-events"
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "relative px-5 py-3 text-body-sm font-semibold transition-colors cursor-pointer",
            activeTab === "upcoming"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Próximas rutas
          {initialUpcoming.length > 0 && (
            <span
              className={cn(
                "ml-2 text-caption font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "upcoming"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {filteredUpcoming.length}
            </span>
          )}
          {activeTab === "upcoming" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>

        <button
          role="tab"
          id="tab-past"
          aria-selected={activeTab === "past"}
          aria-controls="tabpanel-events"
          onClick={() => setActiveTab("past")}
          className={cn(
            "relative px-5 py-3 text-body-sm font-semibold transition-colors cursor-pointer",
            activeTab === "past"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Rutas pasadas
          {initialPast.length > 0 && (
            <span
              className={cn(
                "ml-2 text-caption font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "past"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {filteredPast.length}
            </span>
          )}
          {activeTab === "past" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

      {/* FILTROS — visibles en ambas pestañas */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
        {/* 1. Búsqueda */}
        <div className="relative sm:w-64 shrink-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-faint-foreground"
          />
          <label htmlFor="events-search" className="sr-only">
            Buscar convocatorias
          </label>
          <input
            id="events-search"
            type="text"
            placeholder="Buscar convocatorias..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full bg-card dark:bg-muted border border-border text-foreground placeholder:text-faint-foreground text-body-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div className="hidden sm:block h-6 w-px bg-border" />

        {/* 2. Dropdown Ritmo */}
        <Select
          value={selectedPace}
          onValueChange={(value) =>
            setSelectedPace(value as RoutePace | "all")
          }
        >
          <SelectTrigger
            className="w-full sm:w-52 rounded-full bg-card dark:bg-muted border-border text-body-sm"
            aria-label="Filtrar por ritmo"
          >
            <SelectValue placeholder="Todos los ritmos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los ritmos</SelectItem>
            {PACE_ORDER.map((pace) => (
              <SelectItem key={pace} value={pace}>
                {ROUTE_PACES[pace].emoji} {ROUTE_PACES[pace].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* 3. Picker Mes y Año */}
        <MonthYearPicker value={selectedMonth} onChange={setSelectedMonth} />
      </div>

      {/* GRID */}
      <div
        id="tabpanel-events"
        role="tabpanel"
        aria-labelledby={
          activeTab === "upcoming" ? "tab-upcoming" : "tab-past"
        }
      >
        {isFetching && hasActiveFilters ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeList.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeList.map((rc) => (
                <RouteCallCard
                  key={rc.id}
                  routeCall={rc}
                  variant={activeTab === "past" ? "past" : "upcoming"}
                />
              ))}
            </div>

            {/* CONTADOR + CARGAR MÁS */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <p className="text-caption text-faint-foreground">
                Mostrando {activeList.length} de {filteredActiveTotal}
              </p>
              {hasMore && (
                <button
                  onClick={loadMore}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-card dark:bg-muted text-soft-foreground text-body-sm font-medium hover:border-primary hover:text-primary transition-all cursor-pointer"
                >
                  <ChevronDown size={16} />
                  Cargar más
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            {activeTab === "upcoming" &&
              !hasActiveFilters &&
              !debouncedSearch && (
                <span className="text-5xl mb-4">🛼</span>
              )}
            <p className="text-muted-foreground text-subheading font-medium">
              {noResultsTitle}
            </p>
            <p className="text-faint-foreground text-body-sm mt-1">
              {noResultsMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
