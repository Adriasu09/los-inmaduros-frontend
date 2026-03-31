"use client";

import Image from "next/image";
import { useClerk, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
  useRouteCallAttendees,
  useIsAttending,
  useToggleAttendance,
} from "@/features/attendances";

interface RouteCallCardFooterProps {
  routeCallId: string;
  initialCount: number;
  variant?: "upcoming" | "past";
}

export default function RouteCallCardFooter({
  routeCallId,
  initialCount,
  variant = "upcoming",
}: RouteCallCardFooterProps) {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const pathname = usePathname();

  const { data: attendees = [], isFetched } = useRouteCallAttendees(routeCallId);
  const { data: isAttending = false } = useIsAttending(routeCallId);
  const { mutate: toggle, isPending } = useToggleAttendance(routeCallId);

  const totalCount = isFetched ? attendees.length : initialCount;
  const visibleAttendees = attendees.slice(0, 3);  

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;

    if (!isSignedIn) {
      openSignIn({ forceRedirectUrl: pathname });
      return;
    }

    toggle(isAttending);
  };

  return (
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
      {/* AVATARES / ESTADO VACÍO */}
      <div className="flex items-center gap-2">
        {totalCount > 0 ? (
          <div className="flex -space-x-2">
            {visibleAttendees.map((attendance) => (
              <div key={attendance.id} className="relative">
                {attendance.user?.imageUrl ? (
                  <Image
                    src={attendance.user.imageUrl}
                    alt={attendance.user.name ?? "Asistente"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover ring-2 ring-card dark:ring-muted"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/20 ring-2 ring-card dark:ring-muted flex items-center justify-center text-[10px] font-bold text-primary">
                    {attendance.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                )}
              </div>
            ))}
            {totalCount > 3 && (
              <div className="relative w-7 h-7 rounded-full bg-muted-foreground ring-2 ring-card dark:ring-muted flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                +{totalCount - 3}
              </div>
            )}
          </div>
        ) : (
          <span className="text-caption text-muted-foreground">
            Sé el primero
          </span>
        )}
      </div>

      {/* BOTÓN APUNTARME / NO VOY */}
      {variant !== "past" && (
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`text-body-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 ${
            isAttending
              ? "text-red-400 hover:text-red-300"
              : "text-primary hover:text-primary-hover"
          }`}
        >
          {isPending ? "..." : isAttending ? "No voy" : "Apuntarme"}
        </button>
      )}
    </div>
  );
}
