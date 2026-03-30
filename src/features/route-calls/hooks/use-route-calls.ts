import { useQuery } from "@tanstack/react-query";
import { getUpcomingRouteCalls } from "../services/route-calls-service";
import { queryKeys } from "@/lib/api/query-keys";

export function useUpcomingRouteCalls() {
  return useQuery({
    queryKey: queryKeys.routeCalls.list({ upcoming: true, limit: 3 }),
    queryFn: getUpcomingRouteCalls,
  });
}
