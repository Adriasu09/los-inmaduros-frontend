"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Route as RouteIcon,
  ExternalLink,
  Expand,
  ImageOff,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import type { RouteCall, MeetingPoint } from "@/types";
import { CANCELLED_STAMP_URL, PREDEFINED_MEETING_POINTS } from "@/constants";
import { shareRouteCallOnWhatsApp } from "@/lib/share";
import { formatFullDate, formatTime } from "@/lib/date-utils";
import MapModal from "@/components/map/MapModal";
import MapLoadingPlaceholder from "@/components/map/MapLoadingPlaceholder";
import { Button } from "@/components/ui/Button";
import {
  useRouteCallAttendees,
  useIsAttending,
  useToggleAttendance,
} from "@/features/attendances";
import dynamic from "next/dynamic";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  PaceInfoBadge,
  useCancelRouteCall,
  useRouteCallPermissions,
} from "@/features/route-calls";

const RouteMap = dynamic(
  () => import("@/app/(main)/routes/[slug]/components/RouteMap"),
  { ssr: false, loading: () => <MapLoadingPlaceholder /> },
);

interface RouteCallDetailProps {
  routeCall: RouteCall;
}

function getMeetingPointMapUrl(mp: MeetingPoint): string | null {
  if (mp.location?.startsWith("http")) return mp.location;

  const predefined = PREDEFINED_MEETING_POINTS.find((p) => p.name === mp.name);
  if (predefined) return predefined.googleMapsUrl;

  if (mp.location && /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(mp.location)) {
    return `https://www.google.com/maps?q=${mp.location}`;
  }

  return null;
}

export default function RouteCallDetail({ routeCall }: RouteCallDetailProps) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const { data: attendees = [] } = useRouteCallAttendees(routeCall.id);
  const { data: isAttending = false } = useIsAttending(routeCall.id);
  const { mutate: toggleAttendance, isPending: isTogglingAttendance } = useToggleAttendance(
    routeCall.id,
  );

  const { canCancel } = useRouteCallPermissions(routeCall);
  const {
    mutate: cancel,
    isPending: isCancelling,
    error: cancelError,
    reset: resetCancel,
  } = useCancelRouteCall(routeCall.id);

  const handleShareWhatsApp = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;
    await shareRouteCallOnWhatsApp(routeCall, appUrl);
  };

  const handleToggleAttendance = () => {
    if (isTogglingAttendance) return;
    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: pathname });
      return;
    }
    toggleAttendance(isAttending);
  };

  const openCancelDialog = () => {
    resetCancel();
    setIsCancelOpen(true);
  };

  const handleCancel = () => {
    cancel(undefined, {
      onSuccess: () => {
        setIsCancelOpen(false);
        router.refresh();
      },
    });
  };

  const organizer = routeCall.organizer;
  const linkedRoute = routeCall.route;
  const meetingPoints = routeCall.meetingPoints ?? [];
  const primaryPoint = meetingPoints.find((mp) => mp.type === "PRIMARY");
  const secondaryPoint = meetingPoints.find((mp) => mp.type === "SECONDARY");
  const isCancelled = routeCall.status === "CANCELLED";
  const isPast = routeCall.status === "COMPLETED" || isCancelled;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/events"
        className="flex items-center gap-2 text-body-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a eventos
      </Link>

      <div className="flex flex-wrap justify-between gap-4 items-start">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <h1 className="text-foreground text-title sm:text-4xl">
            {routeCall.title}
          </h1>
          <p className="text-muted-foreground text-body-sm capitalize">
            {formatFullDate(routeCall.dateRoute)},{" "}
            {formatTime(routeCall.dateRoute)}
          </p>
        </div>
        {linkedRoute && (
          <Link href={`/routes/${linkedRoute.slug}`}>
            <Button variant="ghost" size="sm">
              Ver Detalles de la Ruta
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-end">
        {canCancel && (
          <Button variant="ghost" size="sm" onClick={openCancelDialog}>
            Cancelar convocatoria
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<FaWhatsapp size={16} />}
          onClick={handleShareWhatsApp}
        >
          Compartir por WhatsApp
        </Button>
        {!isPast && (
          <Button
            variant={isAttending ? "outline" : "solid"}
            size="sm"
            onClick={handleToggleAttendance}
            disabled={isTogglingAttendance}
          >
            {isTogglingAttendance ? "..." : isAttending ? "No voy" : "Apuntarme"}
          </Button>
        )}
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
        {routeCall.image ? (
          <Image
            src={routeCall.image}
            alt={routeCall.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 960px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff size={48} className="text-faint-foreground" />
          </div>
        )}

        {isCancelled && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={CANCELLED_STAMP_URL}
            alt="Convocatoria cancelada"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}
      </div>

      <section>
        <h2 className="text-foreground text-heading mb-3">
          Detalles de la Ruta
        </h2>
        <div className="grid grid-cols-[minmax(120px,30%)_1fr] gap-x-6">
          <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-4">
            <p className="text-muted-foreground text-body-sm">Ritmo</p>
            <div>
              <PaceInfoBadge paces={routeCall.paces} />
            </div>
          </div>

          {linkedRoute?.approximateDistance && (
            <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-4">
              <p className="text-muted-foreground text-body-sm">Distancia</p>
              <p className="text-foreground text-body-sm flex items-center gap-1.5">
                <RouteIcon
                  size={14}
                  className="text-faint-foreground shrink-0"
                />
                {linkedRoute.approximateDistance}
              </p>
            </div>
          )}

          {primaryPoint && (
            <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-4">
              <p className="text-muted-foreground text-body-sm">
                Punto de Encuentro 1
              </p>
              <div className="flex flex-col gap-1">
                <MeetingPointLink meetingPoint={primaryPoint} />
                {primaryPoint.time && (
                  <span className="text-muted-foreground text-caption flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(primaryPoint.time)}
                  </span>
                )}
              </div>
            </div>
          )}

          {secondaryPoint && (
            <div className="col-span-2 grid grid-cols-subgrid border-t border-border py-4">
              <p className="text-muted-foreground text-body-sm">
                Punto de Encuentro 2
              </p>
              <div className="flex flex-col gap-1">
                <MeetingPointLink meetingPoint={secondaryPoint} />
                {secondaryPoint.time && (
                  <span className="text-muted-foreground text-caption flex items-center gap-1">
                    <Clock size={12} />
                    {formatTime(secondaryPoint.time)}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {routeCall.description && (
        <section>
          <h2 className="text-foreground text-heading mb-3">Descripción</h2>
          <div
            className="text-soft-foreground text-body prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: routeCall.description }}
          />
        </section>
      )}

      {linkedRoute?.gpxFileUrl && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-foreground text-heading">Mapa de la Ruta</h2>
            <button
              onClick={() => setIsMapOpen(true)}
              className="text-faint-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Ampliar mapa"
              aria-label="Ampliar mapa"
            >
              <Expand className="w-5 h-5" />
            </button>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden">
            <RouteMap gpxUrl={linkedRoute.gpxFileUrl} />
          </div>
          <MapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            gpxUrl={linkedRoute.gpxFileUrl}
            title={routeCall.title}
          />
        </section>
      )}

      <section>
        <h2 className="text-foreground text-heading mb-3">
          Participantes ({attendees.length})
        </h2>
        {attendees.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {attendees.map((attendance) => (
              <div
                key={attendance.id}
                className="flex items-center gap-2 bg-card dark:bg-muted rounded-full px-3 py-1.5 border border-border"
              >
                {attendance.user?.imageUrl ? (
                  <Image
                    src={attendance.user.imageUrl}
                    alt={attendance.user.name ?? "Asistente"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {attendance.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                )}
                <span className="text-body-sm text-foreground">
                  {attendance.user?.name ?? "Anónimo"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-body-sm">
            Aún no hay participantes. Sé el primero en apuntarte.
          </p>
        )}
      </section>

      {organizer && (
        <section>
          <h2 className="text-foreground text-heading mb-3">Convocada por</h2>
          <div className="flex items-center gap-4">
            {organizer.imageUrl ? (
              <Image
                src={organizer.imageUrl}
                alt={organizer.name ?? "Organizador"}
                width={56}
                height={56}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold text-primary">
                {organizer.name?.charAt(0)?.toUpperCase() ?? "?"}
              </div>
            )}
            <div>
              <p className="text-foreground text-body font-medium">
                {organizer.name ?? "Anónimo"}
              </p>
              <p className="text-muted-foreground text-body-sm">Organizador</p>
            </div>
          </div>
        </section>
      )}

      <ConfirmDialog
        open={isCancelOpen}
        onOpenChange={setIsCancelOpen}
        title="¿Cancelar esta convocatoria?"
        description="Los participantes la verán como cancelada y se anunciará en el canal de Telegram. Si la compartiste por WhatsApp o en otros grupos, avisa también allí: esos mensajes no se actualizan solos. Esta acción no se puede deshacer."
        confirmLabel="Sí, cancelar"
        onConfirm={handleCancel}
        isPending={isCancelling}
        errorMessage={cancelError?.message}
        isDestructive
      />
    </div>
  );
}

function MeetingPointLink({ meetingPoint }: { meetingPoint: MeetingPoint }) {
  const displayName = meetingPoint.customName ?? meetingPoint.name;
  const mapUrl = getMeetingPointMapUrl(meetingPoint);

  if (mapUrl) {
    return (
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:text-primary-hover text-body-sm flex items-center gap-1.5 transition-colors"
      >
        <MapPin size={14} className="shrink-0" />
        {displayName}
        <ExternalLink size={12} className="shrink-0" />
      </a>
    );
  }

  return (
    <p className="text-foreground text-body-sm flex items-center gap-1.5">
      <MapPin size={14} className="text-faint-foreground shrink-0" />
      {displayName}
    </p>
  );
}
