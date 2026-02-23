import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Route } from "@/types";
import RouteLevelBadge from "./RouteLevelBadge";

interface RouteCardProps {
  route: Route;
}

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <Link
      href={`/routes/${route.slug}`}
      className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      {/* IMAGEN */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={route.image}
          alt={route.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />
        {/* BADGES DE NIVEL encima de la imagen */}
        <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
          {route.level.map((lvl) => (
            <span
              key={lvl}
              className="bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              <RouteLevelBadge level={lvl} />
            </span>
          ))}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-sky-400 transition-colors">
          {route.name}
        </h3>
        <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mt-auto">
          <MapPin size={14} className="shrink-0" />
          <span>{route.approximateDistance} km</span>
        </div>
      </div>
    </Link>
  );
}
