import { BookRepository } from "../repositories/BookRepository";
import { ExternalBook, UserBook } from "../hooks/useBookSync";

// Maps typical API categories/genres to our database seeded genre IDs
const mapGenreNameToId = (genreName?: string): number | null => {
  if (!genreName) return null;
  const name = genreName.toLowerCase();
  if (name.includes("sci-fi") || name.includes("science fiction") || name.includes("fantasy")) return 2;
  if (name.includes("philosophy") || name.includes("philosophical")) return 3;
  if (name.includes("non-fiction") || name.includes("biography") || name.includes("autobiography")) return 4;
  if (name.includes("romance") || name.includes("love")) return 5;
  if (name.includes("biography") || name.includes("memoir")) return 6;
  if (name.includes("poetry") || name.includes("poem")) return 7;
  if (name.includes("self-help") || name.includes("personal growth") || name.includes("psychology")) return 8;
  if (name.includes("mystery") || name.includes("thriller") || name.includes("suspense")) return 9;
  if (name.includes("fiction")) return 1;
  return null;
};

export const BookService = {
  /**
   * Business service adding a book to the library shelf (handling cache checks, conversions, links)
   */
  async addBookToLibrary(
    userId: string,
    book: ExternalBook,
    status: "WISHLIST" | "READING",
    targetEndDate?: string,
    targetDailyPages?: number
  ): Promise<UserBook> {
    if (!userId) throw new Error("User ID is required to shelf books.");

    // 1. Fetch cached book or insert metadata
    let bookId = await BookRepository.fetchCachedBookByApiId(book.id);

    if (!bookId) {
      const genreId = mapGenreNameToId(book.genreName);
      bookId = await BookRepository.cacheBookMetadata(book, genreId);
    }

    // 2. Fetch existing user library shelf relation details
    const existingRelation = await BookRepository.fetchUserBookRelation(userId, bookId);

    if (existingRelation) {
      // If already in library, update its status
      return await BookRepository.updateUserBookRelation(existingRelation.id, {
        status,
        target_end_date: targetEndDate || null,
        target_daily_pages: targetDailyPages || null,
        started_at: status === "READING" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      });
    } else {
      // Create a brand new user book relation link
      return await BookRepository.createUserBookRelation(
        userId,
        bookId,
        status,
        targetEndDate,
        targetDailyPages
      );
    }
  },

  /**
   * Business service handling progress page counts updating, completing logs, milestones
   */
  async updateReadingProgress(userId: string, userBookId: string, newPage: number): Promise<UserBook> {
    if (!userId) throw new Error("User ID is required.");

    // 1. Fetch current status details from database
    const { currentPage, totalPages, status } = await BookRepository.fetchReadingProgressBase(userBookId);
    const delta = newPage - currentPage;

    // 2. Insert incremental page logs today if page increased
    if (delta > 0) {
      await BookRepository.insertReadingLog(userBookId, delta);
    }

    // 3. Determine completed triggers
    const isCompleted = newPage >= totalPages;

    // 4. Update progress and status fields
    return await BookRepository.updateUserBookRelation(userBookId, {
      current_page: newPage,
      status: isCompleted ? "COMPLETED" : status,
      completed_at: isCompleted ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    });
  },

  /**
   * Retrieves books list matching statuses
   */
  async fetchLibrary(userId: string, status?: "WISHLIST" | "READING" | "COMPLETED"): Promise<UserBook[]> {
    if (!userId) return [];
    return await BookRepository.fetchUserLibrary(userId, status);
  },

  /**
   * Evaluates today's estimated minutes read statistics using pages progression logs sum
   */
  async calculateTodayMinutesRead(userId: string, dailyGoal: number): Promise<number> {
    if (!userId) return 0;

    // Fetch daily pages logs
    const pagesToday = await BookRepository.fetchTodayPagesReadLogs(userId);

    // Apply focusing estimation speed multiplier: ~1.5 minutes per page
    return Math.min(dailyGoal, Math.round(pagesToday * 1.5));
  },
};
