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

  const query = useQuery({
    queryKey: queryKeys.favorites.check(routeId),
    queryFn: () => checkIsFavorite(routeId),
    select: (res) => res.data.isFavorite,
    enabled: !!isSignedIn,
  });

  // Cuando el usuario cierra sesión, ignoramos la caché y devolvemos false
  // inmediatamente. Sin esto, React Query mantiene el último valor cacheado
  // (gcTime: 5min) y los corazones quedan rojos aunque no haya sesión activa.
  return {
    ...query,
    data: isSignedIn ? query.data : false,
  };
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
