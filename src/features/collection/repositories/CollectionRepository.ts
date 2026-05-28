import { supabase } from "@/core/libs/supabase";

export interface DbCharacter {
  id: string;
  name: string;
  description: string | null;
  illustration_url: string;
  condition_type: string;
  condition_value: number;
  condition_genre_id: number | null;
  is_default: boolean;
}

export const CollectionRepository = {
  /**
   * Retrieves all master companion characters ordered by defaults first
   */
  async fetchAllCharacters(): Promise<DbCharacter[]> {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("is_default", { ascending: false });

    if (error) throw error;
    return (data || []) as DbCharacter[];
  },

  /**
   * Retrieves unlocked characters claimed by a user
   */
  async fetchUnlockedCharacters(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_characters")
      .select("character_id")
      .eq("user_id", userId);

    if (error) throw error;
    return (data || []).map((uc) => uc.character_id);
  },
};
