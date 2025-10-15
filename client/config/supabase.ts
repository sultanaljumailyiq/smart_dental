import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const supabaseEnabled: boolean = Boolean(
  typeof supabaseUrl === "string" &&
    supabaseUrl &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey,
);

let client: SupabaseClient | null = null;
if (supabaseEnabled) {
  client = createClient(supabaseUrl as string, supabaseAnonKey as string);
}

export const supabase = client;
