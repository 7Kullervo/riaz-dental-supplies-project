import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC = ["/admin/login", "/admin/forgot-password", "/admin/reset-password", "/admin/auth/callback"];

// Keeps the login session fresh and sends signed-out visitors to the login page.
// Admin pages and actions ALSO check authorization on the server (requireAdmin), so this is not the only guard.
export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  const isPublic = PUBLIC.some((p) => req.nextUrl.pathname.startsWith(p));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return isPublic ? res : NextResponse.redirect(new URL("/admin/login", req.url));
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !isPublic) return NextResponse.redirect(new URL("/admin/login", req.url));
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
