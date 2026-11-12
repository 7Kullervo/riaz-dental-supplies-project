"use server";
import { getAdmin } from "@/lib/supabase-server";
import { validate, FIELD_NAMES, type Kind } from "@/lib/validate";

export type Result = { ok: true; ref: string } | { ok: false; error?: string; fieldErrors?: Record<string, string> };

async function handle(kind: Kind, fd: FormData): Promise<Result> {
  const f: Record<string, string> = {};
  for (const k of FIELD_NAMES) f[k] = String(fd.get(k) ?? "").trim();

  // Spam protection 1: hidden honeypot field. Humans never see or fill it.
  if (String(fd.get("website") ?? "")) return { ok: true, ref: "—" };
  // Spam protection 2: forms submitted faster than a person can type are rejected.
  if (Date.now() - Number(fd.get("ts")) < 3000) return { ok: false, error: "Please take a moment to review the form and try again." };

  const fieldErrors = validate(kind, f);
  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };

  const db = getAdmin();
  if (!db) return { ok: false, error: "Our enquiry system is not set up yet, so your message was NOT sent. Please contact the shop directly." };

  // Spam protection 3: at most 3 submissions per email address per 10 minutes.
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db.from("enquiries").select("id", { count: "exact", head: true }).eq("email", f.email.toLowerCase()).gte("created_at", since);
  if ((count ?? 0) >= 3) return { ok: false, error: "You have sent several enquiries recently. Please wait a few minutes and try again." };

  const { data, error } = await db.from("enquiries").insert({
    kind, name: f.name, email: f.email.toLowerCase(), phone: f.phone,
    subject: kind === "contact" ? f.subject : null,
    message: kind === "contact" ? f.message : f.requirements || null,
    product_slug: kind === "quote" ? f.product || null : null,
    quantity: kind === "quote" ? Number(f.quantity) : null,
  }).select("id").single();

  if (error || !data) {
    console.error("enquiry insert failed", error?.message);
    return { ok: false, error: "Something went wrong and your message was NOT saved. Please try again or contact the shop directly." };
  }
  return { ok: true, ref: String(data.id).slice(0, 8).toUpperCase() };
}

export async function submitContact(fd: FormData) { return handle("contact", fd); }
export async function submitQuote(fd: FormData) { return handle("quote", fd); }
