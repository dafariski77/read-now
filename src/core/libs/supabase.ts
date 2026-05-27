import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";
import { SupabaseConfigs } from "../constants";

const supabaseUrl = SupabaseConfigs.url;
const supabasePublishableKey = SupabaseConfigs.publishableKey;

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: localStorage,
  },
});
