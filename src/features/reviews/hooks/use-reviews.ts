import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { createReview } from "../services/reviews-service";

export function useCreateReview(routeId: string, routeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { rating: number; comment?: string }) =>
      createReview(routeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(routeSlug),
      });
    },
  });
}
