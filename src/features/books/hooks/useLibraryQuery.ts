import { useQuery } from "@tanstack/react-query";
import { BookService } from "../services/BookService";
import { UserBook } from "./useBookSync";

export function useLibraryQuery(userId?: string, status?: "WISHLIST" | "READING" | "COMPLETED") {
  return useQuery({
    queryKey: ["userLibrary", userId, status],
    queryFn: async (): Promise<UserBook[]> => {
      if (!userId) return [];
      return await BookService.fetchLibrary(userId, status);
    },
    enabled: !!userId,
  });
}
