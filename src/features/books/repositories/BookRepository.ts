import { supabase } from "@/core/libs/supabase";
import { ExternalBook, UserBook } from "../hooks/useBookSync";

export const BookRepository = {
  /**
   * Checks if an external book is cached locally in our master books table
   */
  async fetchCachedBookByApiId(apiId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("books")
      .select("id")
      .eq("external_api_id", apiId)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0].id : null;
  },

  /**
   * Caches book metadata in the master books table
   */
  async cacheBookMetadata(book: ExternalBook, genreId: number | null): Promise<string> {
    const { data, error } = await supabase
      .from("books")
      .insert({
        external_api_id: book.id,
        title: book.title,
        author: book.author,
        total_pages: book.totalPages,
        cover_image_url: book.coverImageUrl || null,
        primary_genre_id: genreId,
      })
      .select("id")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Failed to cache book metadata.");
    return data.id;
  },

  /**
   * Checks if the relationship between the user and a book is already established
   */
  async fetchUserBookRelation(userId: string, bookId: string): Promise<{ id: string; status: string } | null> {
    const { data, error } = await supabase
      .from("user_books")
      .select("id, status")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  /**
   * Creates a user book relationship
   */
  async createUserBookRelation(
    userId: string,
    bookId: string,
    status: "WISHLIST" | "READING" | "COMPLETED",
    targetEndDate?: string,
    targetDailyPages?: number
  ): Promise<UserBook> {
    const { data, error } = await supabase
      .from("user_books")
      .insert({
        user_id: userId,
        book_id: bookId,
        status,
        current_page: 0,
        target_end_date: targetEndDate || null,
        target_daily_pages: targetDailyPages || null,
        started_at: status === "READING" ? new Date().toISOString() : null,
      })
      .select(`
        *,
        books (
          id, title, author, total_pages, cover_image_url,
          genres ( name )
        )
      `)
      .single();

    if (error) throw error;
    return data as unknown as UserBook;
  },

  /**
   * Updates an existing user book relationship (e.g. from wishlist to reading)
   */
  async updateUserBookRelation(
    relationId: string,
    data: {
      status?: "WISHLIST" | "READING" | "COMPLETED";
      target_end_date?: string | null;
      target_daily_pages?: number | null;
      started_at?: string | null;
      completed_at?: string | null;
      current_page?: number;
      updated_at?: string;
    }
  ): Promise<UserBook> {
    const { data: updatedRecord, error } = await supabase
      .from("user_books")
      .update(data)
      .eq("id", relationId)
      .select(`
        *,
        books (
          id, title, author, total_pages, cover_image_url,
          genres ( name )
        )
      `)
      .single();

    if (error) throw error;
    return updatedRecord as unknown as UserBook;
  },

  /**
   * Inserts an audit log record inside reading_logs
   */
  async insertReadingLog(userBookId: string, pagesReadToday: number): Promise<void> {
    const { error } = await supabase.from("reading_logs").insert({
      user_book_id: userBookId,
      pages_read_today: pagesReadToday,
    });
    if (error) throw error;
  },

  /**
   * Fetches the user book metadata progress status joined with total pages
   */
  async fetchReadingProgressBase(userBookId: string): Promise<{ currentPage: number; totalPages: number; status: "WISHLIST" | "READING" | "COMPLETED" }> {
    const { data, error } = await supabase
      .from("user_books")
      .select(`
        id, current_page, status,
        books ( total_pages )
      `)
      .eq("id", userBookId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("User book entry not found.");

    return {
      currentPage: data.current_page || 0,
      totalPages: (data.books as any)?.total_pages || 0,
      status: data.status as "WISHLIST" | "READING" | "COMPLETED",
    };
  },

  /**
   * Fetches the user's reading library books joined with metadata
   */
  async fetchUserLibrary(userId: string, status?: "WISHLIST" | "READING" | "COMPLETED"): Promise<UserBook[]> {
    let query = supabase
      .from("user_books")
      .select(`
        id,
        status,
        current_page,
        target_end_date,
        target_daily_pages,
        started_at,
        completed_at,
        created_at,
        updated_at,
        books (
          id,
          title,
          author,
          total_pages,
          cover_image_url,
          genres ( name )
        )
      `)
      .eq("user_id", userId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as unknown as UserBook[];
  },

  /**
   * Sums all pages read today by this user across their reading logs
   */
  async fetchTodayPagesReadLogs(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from("reading_logs")
      .select("pages_read_today, user_books!inner(user_id)")
      .eq("user_books.user_id", userId)
      .gte("logged_at", today.toISOString());

    if (error) throw error;
    return (data || []).reduce((sum, item) => sum + (item.pages_read_today || 0), 0);
  },
};
