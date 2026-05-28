import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { AuthService } from "../services/AuthService";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isProfileSetup: boolean | null;
  onboardingData: {
    readingGoal: string;
    companion: string;
    genres: number[];
  };
  initialize: () => Promise<void>;
  checkProfileSetup: () => Promise<boolean>;
  setProfileSetupComplete: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (moniker: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setOnboardingData: (data: { readingGoal: string; companion: string; genres: number[] }) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  isProfileSetup: null,
  onboardingData: {
    readingGoal: "30 Mins",
    companion: "fennec",
    genres: [],
  },

  setOnboardingData: (data) => {
    set({ onboardingData: data });
  },

  initialize: async () => {
    set({ loading: true });
    try {
      // 1. Get initial session from AuthService
      const { session } = await AuthService.getCurrentSession();
      const user = session?.user ?? null;
      
      let isSetup = false;
      if (user) {
        try {
          const genres = await AuthService.getFavoriteGenres(user.id);
          isSetup = genres && genres.length > 0;
        } catch (err) {
          console.warn("Error checking profile setup in initialize:", err);
        }
      }
      
      set({ 
        session, 
        user, 
        isProfileSetup: user ? isSetup : null, 
        loading: false 
      });

      // 2. Listen to state changes via AuthService state listeners
      AuthService.subscribeToAuthState(async (_event, session) => {
        const newUser = session?.user ?? null;
        let newIsSetup = false;
        if (newUser) {
          try {
            const genres = await AuthService.getFavoriteGenres(newUser.id);
            newIsSetup = genres && genres.length > 0;
          } catch (err) {
            console.warn("Error checking profile setup in auth subscription:", err);
          }
        }
        set({ 
          session, 
          user: newUser, 
          isProfileSetup: newUser ? newIsSetup : null, 
          loading: false 
        });
      });
    } catch (e: any) {
      set({ error: e.message || "Initialization error.", loading: false });
    }
  },

  checkProfileSetup: async () => {
    const { user } = get();
    if (!user) {
      set({ isProfileSetup: false });
      return false;
    }
    try {
      const genres = await AuthService.getFavoriteGenres(user.id);
      const isSetup = genres && genres.length > 0;
      set({ isProfileSetup: isSetup });
      return isSetup;
    } catch (e) {
      console.warn("Failed to check profile setup:", e);
      set({ isProfileSetup: false });
      return false;
    }
  },

  setProfileSetupComplete: () => {
    set({ isProfileSetup: true });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      await AuthService.login(email, password);
      set({ loading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message || "An unexpected error occurred.", loading: false });
      return false;
    }
  },

  register: async (moniker, email, password) => {
    set({ loading: true, error: null });
    try {
      const { onboardingData } = get();
      // 2. Delegate registration orchestration business transaction to AuthService
      await AuthService.register(moniker, email, password, {
        companion: onboardingData.companion,
        readingGoal: onboardingData.readingGoal,
        genres: onboardingData.genres,
      });

      set({ loading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message || "An unexpected error occurred.", loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await AuthService.signOut();
    } catch (e: any) {
      set({ error: e.message || "Log out failed." });
    } finally {
      set({ user: null, session: null, loading: false });
    }
  },
}));
