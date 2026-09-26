import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Must match the name the function was deployed under in the Supabase
// dashboard (Edge Functions > your function name).
export const CONTACT_FUNCTION = "rapid-responder";

// Lets the form show a clear "not connected yet" state instead of failing
// silently when the env vars are missing.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
