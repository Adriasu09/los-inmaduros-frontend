import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUpcomingRouteCalls,
  getAllRouteCalls,
  getRouteCallById,
  createRouteCall,
  getFilteredRouteCalls,
} from "../services/route-calls-service";
import type {
  CreateRouteCallPayload,
  RouteCallFilters,
} from "../services/route-calls-service";
import { queryKeys } from "@/lib/api/query-keys";

export function useUpcomingRouteCalls() {
  return useQuery({
    queryKey: queryKeys.routeCalls.list({ upcoming: true, limit: 3 }),
    queryFn: getUpcomingRouteCalls,
  });
}

export function useRouteCall(id: string) {
  return useQuery({
    queryKey: queryKeys.routeCalls.detail(id),
    queryFn: () => getRouteCallById(id),
    enabled: !!id,
  });
}

export function useAllRouteCalls() {
  return useQuery({
    queryKey: queryKeys.routeCalls.list({ all: true }),
    queryFn: getAllRouteCalls,
  });
}

export function useFilteredRouteCalls(filters: RouteCallFilters) {
  return useQuery({
    queryKey: queryKeys.routeCalls.list(filters),
    queryFn: () => getFilteredRouteCalls(filters),
    select: (res) => res.data,
  });
}

export function useCreateRouteCall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRouteCallPayload) => createRouteCall(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routeCalls.lists(),
      });
    },
  });
}
