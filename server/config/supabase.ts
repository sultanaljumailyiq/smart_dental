import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL as string | undefined;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY as string | undefined;

export const supabaseEnabled = Boolean(
  typeof supabaseUrl === "string" &&
    supabaseUrl &&
    typeof supabaseServiceKey === "string" &&
    supabaseServiceKey
);

let client = null;
if (supabaseEnabled) {
  client = createClient(supabaseUrl as string, supabaseServiceKey as string, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = client;
