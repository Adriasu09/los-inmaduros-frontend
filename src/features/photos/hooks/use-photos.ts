import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";
import { uploadPhoto } from "../services/photos-service";

export function useUploadPhoto(routeSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.routes.detail(routeSlug),
      });
    },
  });
}
