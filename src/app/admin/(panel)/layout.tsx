import Link from "next/link";
import { requireAdmin } from "@/lib/supabase-auth";
import { logout } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  const nav = [["Dashboard", "/admin"], ["Enquiries", "/admin/enquiries"], ["Products", "/admin/products"], ["Categories", "/admin/categories"], ["Brands", "/admin/brands"], ["Offers", "/admin/offers"], ["Testimonials", "/admin/testimonials"], ["Website content", "/admin/content"]];
  return (
    <div className="lg:flex">
      <aside className="bg-navy p-4 text-white lg:min-h-screen lg:w-60">
        <p className="font-heading font-extrabold">Admin</p>
        <nav aria-label="Admin" className="mt-4 flex gap-2 overflow-x-auto lg:flex-col">
          {nav.map(([l, h]) => <Link key={h} href={h} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-white/10">{l}</Link>)}
          <Link href="/" target="_blank" className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/10">View website ↗</Link>
        </nav>
        <form action={logout} className="mt-4"><p className="mb-2 truncate text-xs text-slate-400">{user.email}</p><button className="rounded-lg border border-white/30 px-3 py-2 text-sm hover:bg-white/10">Sign out</button></form>
      </aside>
      <div className="flex-1 p-6 lg:p-10">{children}</div>
    </div>
  );
}
