"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient, adminEmails, requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";

type R = { ok: true } | { ok: false; error: string };
const NOT_CONFIGURED = "Admin login is not set up yet. See the README (Admin setup).";
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export async function login(fd: FormData): Promise<R> {
  const sb = createAuthClient();
  if (!sb) return { ok: false, error: NOT_CONFIGURED };
  const email = String(fd.get("email") ?? "").trim().toLowerCase(), password = String(fd.get("password") ?? "");
  if (!emailOk(email) || !password) return { ok: false, error: "Enter your email and password." };
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: "Incorrect email or password." };
  if (!adminEmails().includes(email)) { await sb.auth.signOut(); return { ok: false, error: "This account does not have admin access." }; }
  return { ok: true };
}

export async function logout() {
  const sb = createAuthClient();
  await sb?.auth.signOut();
  redirect("/admin/login");
}

// Always reports the same result so the form cannot be used to discover which emails are admins.
export async function requestReset(fd: FormData): Promise<R> {
  const sb = createAuthClient();
  if (!sb) return { ok: false, error: NOT_CONFIGURED };
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!emailOk(email)) return { ok: false, error: "Enter a valid email address." };
  if (adminEmails().includes(email)) {
    const base = process.env.NEXT_PUBLIC_SITE_URL || headers().get("origin") || "http://localhost:3000";
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: `${base}/admin/auth/callback?next=/admin/reset-password` });
    if (error) console.error("reset email failed", error.message);
  }
  return { ok: true };
}

export async function updatePassword(fd: FormData): Promise<R> {
  const sb = createAuthClient();
  if (!sb) return { ok: false, error: NOT_CONFIGURED };
  const pw = String(fd.get("password") ?? ""), confirm = String(fd.get("confirm") ?? "");
  if (pw.length < 10) return { ok: false, error: "Use at least 10 characters." };
  if (pw !== confirm) return { ok: false, error: "The two passwords do not match." };
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return { ok: false, error: "This reset link has expired. Please request a new one." };
  const { error } = await sb.auth.updateUser({ password: pw });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function updateEnquiry(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(id)) return;
  let status = String(fd.get("status") ?? "");
  if (fd.get("intent") === "complete") status = "completed";
  if (!["new", "in-progress", "completed"].includes(status)) return;
  const notes = String(fd.get("notes") ?? "").slice(0, 3000);
  const db = getAdmin();
  if (!db) return;
  await db.from("enquiries").update({ status, internal_notes: notes || null }).eq("id", id);
  revalidatePath("/admin/enquiries"); revalidatePath("/admin");
}
