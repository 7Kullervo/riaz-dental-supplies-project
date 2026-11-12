import Link from "next/link";
import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";
import { saveOffer, deleteOffer } from "../../content-actions";
import { Flash, NoDb, Lbl, DeleteForm, inp, card, type SP } from "@/components/AdminUI";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const db = getAdmin(); if (!db) return <NoDb />;
  const [{ data }, { data: prods }] = await Promise.all([db.from("offers").select("*").order("expires_on"), db.from("products").select("slug,name").order("name")]);
  const rows = data ?? []; const cur = rows.find((r) => r.id === searchParams.edit);
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <h1 className="text-3xl font-extrabold">Offers</h1>
      <p className="mt-1 text-sm text-muted">Describe real offers only. Offers disappear from the website automatically after their expiry date.</p>
      <div className="mt-5"><Flash sp={searchParams} /></div>
      <form action={saveOffer} className={`${card} max-w-2xl space-y-4`} key={cur?.id ?? "new"}>
        <h2 className="text-lg font-bold">{cur ? "Edit offer" : "Add offer"}</h2>
        <input type="hidden" name="id" value={cur?.id ?? ""} />
        <Lbl t="Title *"><input name="title" required defaultValue={cur?.title} className={inp} /></Lbl>
        <Lbl t="Description"><textarea name="description" rows={3} defaultValue={cur?.description ?? ""} className={inp} /></Lbl>
        <div className="grid gap-4 sm:grid-cols-2">
          <Lbl t="Valid until *"><input name="expires_on" type="date" required defaultValue={cur?.expires_on} className={inp} /></Lbl>
          <Lbl t="Related product"><select name="product" defaultValue={cur?.product_slug ?? ""} className={inp}><option value="">None</option>{(prods ?? []).map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></Lbl>
        </div>
        <div className="flex gap-2"><button className="btn-primary">Save offer</button>{cur && <Link href="/admin/offers" className="btn-outline">Cancel</Link>}</div>
      </form>
      <h2 className="mb-3 mt-10 text-xl font-bold">All offers</h2>
      {rows.length ? <ul className="divide-y divide-line rounded-card border border-line bg-white">{rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{r.title}</strong> <span className="text-muted">· until {r.expires_on}{r.expires_on < today ? " (expired, hidden)" : ""}</span></span>
          <span className="flex items-center gap-2"><Link href={`/admin/offers?edit=${r.id}`} className="btn-outline !min-h-0 !py-1.5">Edit</Link><DeleteForm action={deleteOffer} id={r.id} /></span></li>))}</ul>
        : <p className="text-sm text-muted">No offers yet.</p>}
    </>
  );
}
