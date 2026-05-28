import { useQuery } from "@tanstack/react-query";
import { BookService } from "../services/BookService";

export function useTodayMinutesQuery(userId?: string, dailyGoal: number = 45) {
  return useQuery({
    queryKey: ["todayMinutesRead", userId],
    queryFn: async (): Promise<number> => {
      if (!userId) return 0;
      return await BookService.calculateTodayMinutesRead(userId, dailyGoal);
    },
    enabled: !!userId,
  });
}
