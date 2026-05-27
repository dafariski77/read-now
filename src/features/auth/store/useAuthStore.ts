import { create } from "zustand";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/core/libs/supabase";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (moniker: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true });

    // 1. Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    set({ session, user: session?.user ?? null, loading: false });

    // 2. Listen to state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null, loading: false });
    });
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }
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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            moniker,
          },
        },
      });
      if (error) {
        set({ error: error.message, loading: false });
        return false;
      }
      set({ loading: false });
      return true;
    } catch (e: any) {
      set({ error: e.message || "An unexpected error occurred.", loading: false });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    await supabase.auth.signOut();
    set({ user: null, session: null, loading: false });
  },
}));
