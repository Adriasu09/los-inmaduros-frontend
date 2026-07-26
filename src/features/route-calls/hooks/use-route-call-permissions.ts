import { useCurrentUser } from "@/lib/auth";
import type { RouteCall } from "@/types";

export function useRouteCallPermissions(routeCall: RouteCall) {
  const { data: me } = useCurrentUser();

  const isOrganizer = me?.id === routeCall.organizerId;
  const isAdmin = me?.role === "ADMIN";

  return {
    canEdit: isOrganizer && routeCall.status === "SCHEDULED",
    // The backend also allows an ADMIN to cancel, but contract §4 restricts the
    // UI to the organizer. Being stricter than the API is safe; the reverse
    // would offer an action the backend then rejects with a 403.
    canCancel:
      isOrganizer &&
      (routeCall.status === "SCHEDULED" || routeCall.status === "ONGOING"),
    canDelete: isAdmin,
  };
}