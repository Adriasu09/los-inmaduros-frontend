import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { queryKeys } from "@/lib/api/query-keys";
import {
  addFavorite,
  removeFavorite,
  checkIsFavorite,
  getUserFavorites,
} from "../services/favorites-service";

export function useIsFavorite(routeId: string) {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.favorites.check(routeId),
    queryFn: () => checkIsFavorite(routeId),
    select: (res) => res.data.isFavorite,
    enabled: !!isSignedIn,
  });
}

export function useUserFavorites() {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: queryKeys.favorites.my(),
    queryFn: getUserFavorites,
    select: (res) => res.data,
    enabled: !!isSignedIn,
  });
}

export function useToggleFavorite(routeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) {
        return removeFavorite(routeId);
      } else {
        return addFavorite(routeId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.favorites.check(routeId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.favorites.my() });
    },
  });
}
