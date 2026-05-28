import { supabase } from "@/core/libs/supabase";
import { User, Session } from "@supabase/supabase-js";

export interface UserProfile {
  moniker: string;
  companion: string | null;
  reading_goal: string | null;
  active_character_id: string | null;
  characters?: {
    name: string;
    description: string | null;
    illustration_url: string;
  } | null;
}

export const AuthRepository = {
  /**
   * Gets the currently logged-in user's active session
   */
  async getSession(): Promise<{ session: Session | null }> {
    const { data: { session } } = await supabase.auth.getSession();
    return { session };
  },

  /**
   * Subscribes to changes in authentication state
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
    return subscription;
  },

  /**
   * Signs in user with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Signs up user with email and password, setting up default moniker in user metadata
   */
  async signUp(moniker: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          moniker,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  /**
   * Updates public profiles custom properties
   */
  async updateProfile(
    userId: string,
    data: {
      moniker?: string;
      companion?: string;
      reading_goal?: string;
      active_character_id?: string;
    }
  ) {
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", userId);
    
    if (error) throw error;
  },

  /**
   * Inserts onboarding favorite genres for a registered profile
   */
  async insertFavoriteGenres(userId: string, genreIds: number[]) {
    if (!genreIds || genreIds.length === 0) return;

    const rows = genreIds.map((genreId) => ({
      user_id: userId,
      genre_id: genreId,
    }));

    const { error } = await supabase.from("user_preferences").insert(rows);
    if (error) throw error;
  },

  /**
   * Fetches the user profile linked to a user id
   */
  async fetchUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        moniker,
        companion,
        reading_goal,
        active_character_id,
        characters:active_character_id (
          name,
          description,
          illustration_url
        )
      `)
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data as unknown as UserProfile;
  },

  /**
   * Fetches the list of favorited genres names for a user
   */
  async fetchUserFavoriteGenres(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from("user_preferences")
      .select(`
        genres ( name )
      `)
      .eq("user_id", userId);

    if (error) throw error;
    return (data || [])
      .map((p: any) => p.genres?.name)
      .filter(Boolean) as string[];
  },

  /**
   * Unlocks a companion character for the user
   */
  async unlockCharacter(userId: string, characterId: string) {
    const { error } = await supabase
      .from("user_characters")
      .insert({
        user_id: userId,
        character_id: characterId,
      });
    
    // Catch duplicate key conflicts safely
    if (error && !error.message.includes("duplicate key")) throw error;
  },

  /**
   * Signs out the user session
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
