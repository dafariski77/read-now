import { Session } from "@supabase/supabase-js";
import { AuthRepository, UserProfile } from "../repositories/AuthRepository";

export const AuthService = {
  /**
   * Retrieves active session details
   */
  async getCurrentSession(): Promise<{ session: Session | null }> {
    return await AuthRepository.getSession();
  },

  /**
   * Subscribes to changes in authentication state
   */
  subscribeToAuthState(callback: (event: string, session: Session | null) => void) {
    return AuthRepository.onAuthStateChange(callback);
  },

  /**
   * Signs in user with email and password
   */
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }
    return await AuthRepository.signIn(email, password);
  },

  /**
   * Registers a user and saves their onboarding companion choices & favorite genres
   */
  async register(
    moniker: string,
    email: string,
    password: string,
    onboardingData: { companion: string; readingGoal: string; genres: number[] }
  ): Promise<boolean> {
    if (!moniker || !email || !password) {
      throw new Error("All fields (moniker, email, password) are required.");
    }

    // 1. Sign up user via AuthRepository
    const signUpData = await AuthRepository.signUp(moniker, email, password);
    const signUpUser = signUpData?.user;

    if (signUpUser) {
      // 2. Insert onboarding companion choice and goal
      await AuthRepository.updateProfile(signUpUser.id, {
        companion: onboardingData.companion,
        reading_goal: onboardingData.readingGoal,
      });

      // 3. Seed onboarding selected favorite genres
      if (onboardingData.genres && onboardingData.genres.length > 0) {
        await AuthRepository.insertFavoriteGenres(signUpUser.id, onboardingData.genres);
      }
    }

    return true;
  },

  /**
   * Fetches the user profile details
   */
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    if (!userId) return null;
    return await AuthRepository.fetchUserProfile(userId);
  },

  /**
   * Fetches user favorited genres
   */
  async getFavoriteGenres(userId: string): Promise<string[]> {
    if (!userId) return [];
    return await AuthRepository.fetchUserFavoriteGenres(userId);
  },

  /**
   * Business service finishing setup profile: choosing genres and claiming companion
   */
  async completeProfileSetup(
    userId: string,
    genreIds: number[],
    companionId: string
  ): Promise<boolean> {
    if (!userId) throw new Error("User ID is required to complete profile setup.");

    // 1. Update profiles active companion
    await AuthRepository.updateProfile(userId, {
      active_character_id: companionId,
    });

    // 2. Unlock the chosen character relationship claim
    await AuthRepository.unlockCharacter(userId, companionId);

    // 3. Insert favorite genres preferences
    if (genreIds && genreIds.length > 0) {
      await AuthRepository.insertFavoriteGenres(userId, genreIds);
    }

    return true;
  },

  /**
   * Signs out the current session
   */
  async signOut() {
    await AuthRepository.signOut();
  },
};
