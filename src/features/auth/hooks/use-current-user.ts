import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { queryKeys } from "@/lib/api/query-keys";
import { getCurrentUser } from "../services/auth-service";

export function useCurrentUser() {
  const { isSignedIn } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: getCurrentUser,
    select: (res) => res.data,
    enabled: !!isSignedIn,
    staleTime: 5 * 60 * 1000,
  });

  // React Query keeps the cached user for gcTime after sign-out; without this
  // guard the permission hook would still see an identity and offer the
  // organizer/admin actions to a logged-out visitor.
  return {
    ...query,
    data: isSignedIn ? query.data : undefined,
  };
}