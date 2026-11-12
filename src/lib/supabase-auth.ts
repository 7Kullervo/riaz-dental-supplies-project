import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";

export function createAuthClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => { try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a Server Component; middleware refreshes the session */ } },
    },
  });
}
export const adminEmails = () => (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

// Server-side authorization: signed in AND on the ADMIN_EMAILS list.
export async function getAdminUser() {
  const sb = createAuthClient();
  if (!sb) return null;
  const { data: { user } } = await sb.auth.getUser();
  if (!user?.email || !adminEmails().includes(user.email.toLowerCase())) return null;
  return user;
}
export async function requireAdmin() {
  const u = await getAdminUser();
  if (!u) redirect("/admin/login");
  return u;
}
