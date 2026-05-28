import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { BookService } from "../services/BookService";

export interface ExternalBook {
  id: string; // External API ID (e.g. Google Books ID)
  title: string;
  author: string;
  totalPages: number;
  coverImageUrl?: string;
  genreName?: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: "WISHLIST" | "READING" | "COMPLETED";
  current_page: number;
  target_end_date: string | null;
  target_daily_pages: number | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  books?: {
    id: string;
    title: string;
    author: string;
    total_pages: number;
    cover_image_url: string | null;
    genres?: {
      name: string;
    } | null;
  };
}

export default function useBookSync() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // React Query Mutation to add a book to library
  const addBookMutation = useMutation({
    mutationFn: async ({
      book,
      status,
      targetEndDate,
      targetDailyPages,
    }: {
      book: ExternalBook;
      status: "WISHLIST" | "READING";
      targetEndDate?: string;
      targetDailyPages?: number;
    }): Promise<UserBook | null> => {
      if (!user) throw new Error("User must be authenticated to add books.");
      return await BookService.addBookToLibrary(
        user.id,
        book,
        status,
        targetEndDate,
        targetDailyPages
      );
    },
    onSuccess: () => {
      // Invalidate all library queries to refresh shelves reactively
      queryClient.invalidateQueries({ queryKey: ["userLibrary", user?.id] });
    },
  });

  // React Query Mutation to update progress page
  const updateProgressMutation = useMutation({
    mutationFn: async ({
      userBookId,
      newPage,
    }: {
      userBookId: string;
      newPage: number;
    }): Promise<UserBook | null> => {
      if (!user) throw new Error("User must be authenticated to update progress.");
      return await BookService.updateReadingProgress(user.id, userBookId, newPage);
    },
    onSuccess: () => {
      // Invalidate library shelves, today reading progress, and profile stats query
      queryClient.invalidateQueries({ queryKey: ["userLibrary", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["todayMinutesRead", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", user?.id] });
    },
  });

  const addBookToLibrary = useCallback(
    async (
      book: ExternalBook,
      status: "WISHLIST" | "READING",
      targetEndDate?: string,
      targetDailyPages?: number
    ): Promise<UserBook | null> => {
      try {
        return await addBookMutation.mutateAsync({
          book,
          status,
          targetEndDate,
          targetDailyPages,
        });
      } catch (e) {
        console.warn("useBookSync addBookToLibrary failed:", e);
        return null;
      }
    },
    [addBookMutation]
  );

  const updateReadingProgress = useCallback(
    async (userBookId: string, newPage: number): Promise<UserBook | null> => {
      try {
        return await updateProgressMutation.mutateAsync({ userBookId, newPage });
      } catch (e) {
        console.warn("useBookSync updateReadingProgress failed:", e);
        return null;
      }
    },
    [updateProgressMutation]
  );

  const fetchUserLibrary = useCallback(
    async (status?: "WISHLIST" | "READING" | "COMPLETED"): Promise<UserBook[]> => {
      if (!user) return [];
      try {
        return await BookService.fetchLibrary(user.id, status);
      } catch (e) {
        console.warn("useBookSync fetchUserLibrary error:", e);
        return [];
      }
    },
    [user]
  );

  return {
    loading: addBookMutation.isPending || updateProgressMutation.isPending,
    error: (addBookMutation.error?.message || updateProgressMutation.error?.message) ?? null,
    addBookToLibrary,
    updateReadingProgress,
    fetchUserLibrary,
  };
}
