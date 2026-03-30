import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { queryKeys } from "@/lib/api/query-keys";
import {
  getRouteCallAttendees,
  checkIsAttending,
  joinRouteCall,
  leaveRouteCall,
} from "../services/attendances-service";

/**
 * Obtener la lista de asistentes de una convocatoria (público, para avatares)
 */
export function useRouteCallAttendees(routeCallId: string) {
  return useQuery({
    queryKey: queryKeys.attendances.byRouteCall(routeCallId),
    queryFn: () => getRouteCallAttendees(routeCallId),
    select: (res) => res.data,
  });
}

/**
 * Comprobar si el usuario actual está apuntado a una convocatoria
 */
export function useIsAttending(routeCallId: string) {
  const { isSignedIn } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.attendances.check(routeCallId),
    queryFn: () => checkIsAttending(routeCallId),
    select: (res) => res.data.isAttending,
    enabled: !!isSignedIn,
  });

  return {
    ...query,
    data: isSignedIn ? query.data : false,
  };
}

/**
 * Mutación para apuntarse/desapuntarse de una convocatoria
 */
export function useToggleAttendance(routeCallId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isAttending: boolean) => {
      if (isAttending) {
        return leaveRouteCall(routeCallId);
      } else {
        return joinRouteCall(routeCallId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendances.check(routeCallId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attendances.byRouteCall(routeCallId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.routeCalls.lists(),
      });
    },
  });
}
