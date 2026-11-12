import Link from "next/link";
import { getAdmin } from "@/lib/supabase-server";
import { getProducts, getCategories } from "@/lib/content";

export const dynamic = "force-dynamic";
const when = (s: string) => new Date(s).toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });

export default async function Dashboard() {
  const db = getAdmin();
  let total = 0, pending = 0; let recent: { id: string; kind: string; name: string; status: string; created_at: string }[] = [];
  if (db) {
    total = (await db.from("enquiries").select("id", { count: "exact", head: true })).count ?? 0;
    pending = (await db.from("enquiries").select("id", { count: "exact", head: true }).in("status", ["new", "in-progress"])).count ?? 0;
    recent = (await db.from("enquiries").select("id,kind,name,status,created_at").order("created_at", { ascending: false }).limit(5)).data ?? [];
  }
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const cards = [["Total enquiries", db ? total : "–"], ["Pending quotation requests / enquiries", db ? pending : "–"], [db ? "Products" : "Products (demo data)", products.length], ["Categories", categories.length]];
  return (
    <>
      <h1 className="text-3xl font-extrabold">Dashboard</h1>
      {!db && <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Database not connected: add the Supabase keys to .env.local.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="rounded-card border border-line bg-white p-5 shadow-card"><p className="text-sm text-muted">{l}</p><p className="mt-1 text-3xl font-extrabold text-navy">{v}</p></div>)}
      </div>
      <h2 className="mb-3 mt-10 text-xl font-bold">Recent activity</h2>
      {recent.length ? (
        <ul className="divide-y divide-line rounded-card border border-line bg-white">{recent.map((r) => (
          <li key={r.id}><Link href="/admin/enquiries" className="flex flex-wrap justify-between gap-2 p-4 text-sm hover:bg-mist"><span><strong>{r.name}</strong> sent a {r.kind === "quote" ? "quote request" : "message"}</span><span className="text-muted">{when(r.created_at)} · {r.status}</span></Link></li>))}</ul>
      ) : <p className="rounded-card border border-dashed border-line bg-white p-8 text-center text-sm text-muted">No enquiries yet.</p>}
    </>
  );
}
