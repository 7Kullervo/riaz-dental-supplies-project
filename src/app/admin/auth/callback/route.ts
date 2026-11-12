import { NextResponse, type NextRequest } from "next/server";
import { createAuthClient } from "@/lib/supabase-auth";

// The password-reset email link lands here; we swap the one-time code for a session.
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const next = req.nextUrl.searchParams.get("next") ?? "/admin";
  const safe = next.startsWith("/admin/") || next === "/admin" ? next : "/admin";
  const sb = createAuthClient();
  if (sb && code) {
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(safe, req.url));
  }
  return NextResponse.redirect(new URL("/admin/forgot-password?expired=1", req.url));
}
