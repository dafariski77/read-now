import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";

export function useProfileQuery(userId?: string) {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      if (!userId) return null;
      return await AuthService.getUserProfile(userId);
    },
    enabled: !!userId,
  });
}
