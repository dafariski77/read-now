import { useQuery } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";

export function useGenresQuery(userId?: string) {
  return useQuery({
    queryKey: ["userGenres", userId],
    queryFn: async () => {
      if (!userId) return [];
      return await AuthService.getFavoriteGenres(userId);
    },
    enabled: !!userId,
  });
}
