"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import type { RouteCall, RoutePace } from "@/types";
import { ROUTE_PACES, PACE_ORDER } from "@/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { cn, normalize } from "@/lib/utils";
import RouteCallCard from "@/components/home/RouteCallCard";

const PAGE_SIZE = 6;

type Tab = "upcoming" | "past";

interface EventsContentProps {
  upcoming: RouteCall[];
  past: RouteCall[];
}

export default function EventsContent({
  upcoming: upcomingAll,
  past: pastAll,
}: EventsContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [search, setSearch] = useState("");
  const [selectedPace, setSelectedPace] = useState<RoutePace | null>(null);
  const [upcomingVisible, setUpcomingVisible] = useState(PAGE_SIZE);
  const [pastVisible, setPastVisible] = useState(PAGE_SIZE);

  const debouncedSearch = useDebounce(search, 300);

  // Reset visible counts when filters change so results start from the top
  useEffect(() => {
    setUpcomingVisible(PAGE_SIZE);
    setPastVisible(PAGE_SIZE);
  }, [debouncedSearch, selectedPace]);

  const filterList = useCallback(
    (list: RouteCall[]) =>
      list.filter((rc) => {
        const matchesSearch = normalize(rc.title).includes(
          normalize(debouncedSearch),
        );
        const matchesPace =
          selectedPace === null || rc.paces.includes(selectedPace);
        return matchesSearch && matchesPace;
      }),
    [debouncedSearch, selectedPace],
  );

  const filteredUpcoming = useMemo(
    () => filterList(upcomingAll),
    [filterList, upcomingAll],
  );

  const filteredPast = useMemo(
    () => filterList(pastAll),
    [filterList, pastAll],
  );

  const visibleUpcoming = filteredUpcoming.slice(0, upcomingVisible);
  const visiblePast = filteredPast.slice(0, pastVisible);

  const hasMoreUpcoming = upcomingVisible < filteredUpcoming.length;
  const hasMorePast = pastVisible < filteredPast.length;

  const activeList = activeTab === "upcoming" ? visibleUpcoming : visiblePast;
  const filteredActiveTotal =
    activeTab === "upcoming" ? filteredUpcoming.length : filteredPast.length;
  const hasMore = activeTab === "upcoming" ? hasMoreUpcoming : hasMorePast;

  function loadMore() {
    if (activeTab === "upcoming") {
      setUpcomingVisible((v) => v + PAGE_SIZE);
    } else {
      setPastVisible((v) => v + PAGE_SIZE);
    }
  }

  const noResultsMessage =
    debouncedSearch || selectedPace
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
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={cn(
            "relative px-5 py-3 text-body-sm font-semibold transition-colors",
            activeTab === "upcoming"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Próximas rutas
          {upcomingAll.length > 0 && (
            <span
              className={cn(
                "ml-2 text-caption font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "upcoming"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {upcomingAll.length}
            </span>
          )}
          {activeTab === "upcoming" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab("past")}
          className={cn(
            "relative px-5 py-3 text-body-sm font-semibold transition-colors",
            activeTab === "past"
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Rutas pasadas
          {pastAll.length > 0 && (
            <span
              className={cn(
                "ml-2 text-caption font-bold px-1.5 py-0.5 rounded-full",
                activeTab === "past"
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {pastAll.length}
            </span>
          )}
          {activeTab === "past" && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
          )}
        </button>
      </div>

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
            className={cn(
              "px-3 py-1.5 rounded-full text-caption font-medium border transition-all",
              selectedPace === null
                ? "bg-primary-hover text-white border-primary-hover"
                : "bg-card dark:bg-muted text-soft-foreground border-border hover:border-primary",
            )}
          >
            Todos
          </button>

          {PACE_ORDER.map((pace) => (
            <button
              key={pace}
              onClick={() =>
                setSelectedPace(selectedPace === pace ? null : pace)
              }
              className={cn(
                "px-3 py-1.5 rounded-full text-caption font-medium border transition-all",
                selectedPace === pace
                  ? "bg-primary-hover text-white border-primary-hover"
                  : "bg-card dark:bg-muted text-soft-foreground border-border hover:border-primary",
              )}
            >
              {ROUTE_PACES[pace].emoji} {ROUTE_PACES[pace].label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      {activeList.length > 0 ? (
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
                className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-card dark:bg-muted text-soft-foreground text-body-sm font-medium hover:border-primary hover:text-primary transition-all"
              >
                <ChevronDown size={16} />
                Cargar más
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          {activeTab === "upcoming" && (
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
  );
}
