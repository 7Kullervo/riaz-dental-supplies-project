import "server-only";
import { createClient } from "@supabase/supabase-js";

// Returns null when Supabase is not configured, so forms can report that honestly.
export function getAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
