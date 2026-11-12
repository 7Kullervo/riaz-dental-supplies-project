import Link from "next/link";
import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";
import { updateEnquiry } from "../../actions";

export const dynamic = "force-dynamic";
type Enq = { id: string; kind: string; name: string; email: string; phone: string; subject: string | null; message: string | null; product_slug: string | null; quantity: number | null; status: string; internal_notes: string | null; created_at: string };
const STATUSES = ["new", "in-progress", "completed"];

export default async function Enquiries({ searchParams }: { searchParams: { status?: string } }) {
  await requireAdmin();
  const db = getAdmin();
  if (!db) return <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Database not connected: add the Supabase keys to .env.local.</p>;
  let q = db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(100);
  const f = STATUSES.includes(searchParams.status ?? "") ? searchParams.status! : "";
  if (f) q = q.eq("status", f);
  const { data, error } = await q;
  const rows = (data ?? []) as Enq[];
  return (
    <>
      <h1 className="text-3xl font-extrabold">Enquiries</h1>
      <div className="my-5 flex flex-wrap gap-2">
        {[["", "All"], ...STATUSES.map((s) => [s, s])].map(([s, l]) => (
          <Link key={s} href={s ? `/admin/enquiries?status=${s}` : "/admin/enquiries"} className={`rounded-full border px-4 py-1.5 text-sm capitalize ${f === s ? "border-brand bg-brand text-white" : "border-line bg-white"}`}>{l}</Link>))}
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">Could not load enquiries. Check the database setup.</p>}
      {!error && !rows.length && <p className="rounded-card border border-dashed border-line bg-white p-8 text-center text-sm text-muted">No enquiries found.</p>}
      <div className="space-y-3">{rows.map((r) => (
        <details key={r.id} className="rounded-card border border-line bg-white shadow-card">
          <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span><strong>{r.name}</strong> · {r.kind === "quote" ? "Quote request" : "Message"}{r.subject ? `: ${r.subject}` : ""}</span>
            <span className="text-muted">{new Date(r.created_at).toLocaleString("en-GB", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })} · <span className="capitalize">{r.status}</span></span>
          </summary>
          <div className="space-y-3 border-t border-line p-4 text-sm">
            <p>Email: <a className="text-brand" href={`mailto:${r.email}`}>{r.email}</a> · Phone: <a className="text-brand" href={`tel:${r.phone}`}>{r.phone}</a></p>
            {r.product_slug && <p>Product: {r.product_slug} · Quantity: {r.quantity}</p>}
            {r.message && <p className="whitespace-pre-wrap rounded-lg bg-mist p-3">{r.message}</p>}
            <form action={updateEnquiry} className="space-y-3">
              <input type="hidden" name="id" value={r.id} />
              <label className="block font-semibold">Status
                <select name="status" defaultValue={r.status} className="ml-2 rounded-lg border border-line px-2 py-1 font-normal capitalize">{STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
              <label className="block font-semibold">Internal notes (not visible to customers)
                <textarea name="notes" rows={3} defaultValue={r.internal_notes ?? ""} className="mt-1 w-full rounded-lg border border-line p-2 font-normal" /></label>
              <div className="flex gap-2"><button name="intent" value="save" className="btn-primary">Save</button><button name="intent" value="complete" className="btn-outline">Mark completed</button></div>
            </form>
          </div>
        </details>))}</div>
    </>
  );
}
