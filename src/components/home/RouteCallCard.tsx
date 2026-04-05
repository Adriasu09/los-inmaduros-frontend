import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Route as RouteIcon, ImageOff } from "lucide-react";
import type { RouteCall } from "@/types";
import { cn } from "@/lib/utils";
import { formatDateBadge, formatTime, isToday } from "@/lib/date-utils";
import PaceInfoBadge from "./PaceInfoBadge";
import RouteCallCardFooter from "./RouteCallCardFooter";

const CANCELLED_STAMP_URL =
  "https://dplwudttrngcnapuurkt.supabase.co/storage/v1/object/public/photos/routes/cancelado.png";

interface RouteCallCardProps {
  routeCall: RouteCall;
  variant?: "upcoming" | "past";
}

export default function RouteCallCard({ routeCall, variant = "upcoming" }: RouteCallCardProps) {
  const isPast = variant === "past";
  const isCancelled = routeCall.status === "CANCELLED";
  const isOngoing = routeCall.status === "ONGOING";
  const imageUrl = routeCall.image;
  const primaryPoint = routeCall.meetingPoints?.find(
    (mp) => mp.type === "PRIMARY",
  );
  const attendees = routeCall._count?.attendances ?? 0;
  const today = isToday(routeCall.dateRoute);
  const organizer = routeCall.organizer;

  const cardClassName = cn(
    "group block bg-card dark:bg-muted rounded-2xl overflow-hidden shadow-md transition-all duration-300 flex flex-col h-full",
    isPast || isCancelled
      ? "opacity-70"
      : "hover:shadow-xl hover:-translate-y-1",
  );

  const content = (
    <article className="flex flex-col flex-1 min-h-0">
      {/* IMAGEN + BADGE FECHA / HOY + SELLO CANCELADA */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={routeCall.title}
            fill
            className={cn(
              "object-cover transition-transform duration-500",
              !isCancelled && "group-hover:scale-105",
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={28} className="text-faint-foreground" />
          </div>
        )}

        {isCancelled ? (
          <>
            <span className="absolute top-3 left-3 bg-muted-foreground/70 text-muted text-caption font-bold px-3 py-1 rounded-full">
              {formatDateBadge(routeCall.dateRoute)}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CANCELLED_STAMP_URL}
              alt="Cancelada"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            />
          </>
        ) : isOngoing ? (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-caption font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
            EN CURSO
          </span>
        ) : isPast ? (
          <span className="absolute top-3 left-3 bg-muted-foreground/70 text-muted text-caption font-bold px-3 py-1 rounded-full">
            {formatDateBadge(routeCall.dateRoute)}
          </span>
        ) : today ? (
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
        <h3
          className={cn(
            "font-bold text-foreground text-body mt-1 line-clamp-1 transition-colors",
            !isCancelled && "group-hover:text-primary",
          )}
        >
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
          <div
            className="text-body-sm text-muted-foreground mt-1 line-clamp-3 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: routeCall.description }}
          />
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
            {isPast ? "Completada" : formatTime(routeCall.dateRoute)}
          </span>
          {routeCall.route?.approximateDistance && (
            <span className="flex items-center gap-1">
              <RouteIcon size={14} className="shrink-0" />
              {routeCall.route.approximateDistance}
            </span>
          )}
        </div>

        {/* FOOTER */}
        <RouteCallCardFooter
          routeCallId={routeCall.id}
          initialCount={attendees}
          variant={variant}
          isCancelled={isCancelled}
        />
      </div>
    </article>
  );

  if (isCancelled) {
    return <div className={cardClassName}>{content}</div>;
  }

  return (
    <Link href={`/events/${routeCall.id}`} className={cardClassName}>
      {content}
    </Link>
  );
}
