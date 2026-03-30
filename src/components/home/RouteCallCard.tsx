import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Route as RouteIcon, ImageOff, Users } from "lucide-react";
import type { RouteCall } from "@/types";
import PaceInfoBadge from "./PaceInfoBadge";

interface RouteCallCardProps {
  routeCall: RouteCall;
}

function formatDateBadge(dateString: string): string {
  const date = new Date(dateString);
  const weekday = date
    .toLocaleDateString("es-ES", { weekday: "short" })
    .toUpperCase()
    .replace(".", "");
  const day = date.getDate();
  const month = date
    .toLocaleDateString("es-ES", { month: "short" })
    .toUpperCase()
    .replace(".", "");
  return `${weekday} ${day} ${month}`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function RouteCallCard({ routeCall }: RouteCallCardProps) {
  const imageUrl = routeCall.image ?? routeCall.route?.image;
  const primaryPoint = routeCall.meetingPoints?.find(
    (mp) => mp.type === "PRIMARY",
  );
  const attendees = routeCall._count?.attendances ?? 0;
  const today = isToday(routeCall.dateRoute);
  const organizer = routeCall.organizer;

  return (
    <article className="group bg-card dark:bg-muted rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* IMAGEN + BADGE FECHA / HOY */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={routeCall.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={28} className="text-faint-foreground" />
          </div>
        )}
        {today ? (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-caption font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
            HOY
          </span>
        ) : (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-caption font-bold px-3 py-1 rounded-full">
            {formatDateBadge(routeCall.dateRoute)}
          </span>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-5 flex flex-col flex-1">
        {/* RITMO */}
        <PaceInfoBadge paces={routeCall.paces} />

        {/* TÍTULO */}
        <h3 className="font-bold text-foreground text-body mt-1 line-clamp-1 group-hover:text-primary transition-colors">
          {routeCall.title}
        </h3>

        {/* ORGANIZADOR */}
        {organizer && (
          <div className="flex items-center gap-1.5 mt-1">
            {organizer.imageUrl ? (
              <Image
                src={organizer.imageUrl}
                alt={organizer.name ?? "Organizador"}
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                {organizer.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
            <span className="text-caption text-muted-foreground">
              por {organizer.name ?? "Anónimo"}
            </span>
          </div>
        )}

        {/* DESCRIPCIÓN */}
        {routeCall.description && (
          <p className="text-body-sm text-muted-foreground mt-1 line-clamp-3">
            {routeCall.description}
          </p>
        )}

        {/* METADATA */}
        <div className="flex items-center gap-4 mt-4 mb-2 text-caption text-muted-foreground flex-wrap">
          {primaryPoint && (
            <span className="flex items-center gap-1">
              <MapPin size={14} className="shrink-0" />
              {primaryPoint.customName ?? primaryPoint.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={14} className="shrink-0" />
            {formatTime(routeCall.dateRoute)}
          </span>
          {routeCall.route?.approximateDistance && (
            <span className="flex items-center gap-1">
              <RouteIcon size={14} className="shrink-0" />
              {routeCall.route.approximateDistance}
            </span>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-caption text-muted-foreground">
            <Users size={14} />
            <span>{attendees} apuntados</span>
          </div>
          <Link
            href={`/eventos/${routeCall.id}`}
            className="text-body-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            Apuntarme
          </Link>
        </div>
      </div>
    </article>
  );
}
