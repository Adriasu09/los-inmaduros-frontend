import Link from "next/link";
import { PlusCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { RouteCall } from "@/types";
import RouteCallCard from "./RouteCallCard";

interface UpcomingRoutesSectionProps {
  routeCalls: RouteCall[];
}

export default function UpcomingRoutesSection({
  routeCalls,
}: UpcomingRoutesSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-heading md:text-title font-bold text-foreground">
              Próximas Rutas
            </h2>
            <p className="mt-2 text-body-sm text-muted-foreground max-w-2xl">
              Estas son las próximas quedadas. ¡Elige la tuya y apúntate!
            </p>
          </div>
          <Link href="/eventos/crear">
            <Button variant="outline" leftIcon={<PlusCircle size={18} />}>
              Crear Ruta/Evento
            </Button>
          </Link>
        </div>

        {/* GRID O EMPTY STATE */}
        {routeCalls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routeCalls.map((rc) => (
              <RouteCallCard key={rc.id} routeCall={rc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-body text-muted-foreground">
              No hay rutas programadas por el momento. ¡Sé el primero en crear
              una!
            </p>
          </div>
        )}

        {/* CTA BOTTOM */}
        <div className="mt-12 text-center">
          <Link href="/eventos">
            <Button size="lg" rightIcon={<Calendar size={20} />}>
              Ver Todas las Rutas{" "}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
