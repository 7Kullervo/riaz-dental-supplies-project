import Link from "next/link";
import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";
import { saveBrand, deleteBrand } from "../../content-actions";
import { Flash, NoDb, Lbl, DeleteForm, inp, card, type SP } from "@/components/AdminUI";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const db = getAdmin(); if (!db) return <NoDb />;
  const { data } = await db.from("brands").select("*").order("name");
  const rows = data ?? []; const cur = rows.find((r) => r.id === searchParams.edit);
  return (
    <>
      <h1 className="text-3xl font-extrabold">Brands</h1>
      <p className="mt-1 text-sm text-muted">Only add manufacturers you have confirmed. Listing a brand does not claim an authorized partnership.</p>
      <div className="mt-5"><Flash sp={searchParams} /></div>
      <form action={saveBrand} className={`${card} max-w-2xl space-y-4`} key={cur?.id ?? "new"}>
        <h2 className="text-lg font-bold">{cur ? "Edit brand" : "Add brand"}</h2>
        <input type="hidden" name="id" value={cur?.id ?? ""} />
        <Lbl t="Brand name *"><input name="name" required defaultValue={cur?.name} className={inp} /></Lbl>
        <Lbl t="URL name (slug)" hint="Optional. Created from the name if left empty."><input name="slug" defaultValue={cur?.slug} className={inp} /></Lbl>
        <Lbl t="Description"><textarea name="description" rows={3} defaultValue={cur?.description ?? ""} className={inp} /></Lbl>
        <Lbl t="Logo (JPG, PNG or WebP, max 4 MB)">
          {cur?.logo_url && <img src={cur.logo_url} alt="" className="mt-1 h-16 rounded-lg object-contain" />}
          <input name="logo" type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block text-sm" /></Lbl>
        {cur?.logo_url && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_logo" />Remove current logo</label>}
        <div className="flex gap-2"><button className="btn-primary">Save brand</button>{cur && <Link href="/admin/brands" className="btn-outline">Cancel</Link>}</div>
      </form>
      <h2 className="mb-3 mt-10 text-xl font-bold">All brands</h2>
      {rows.length ? <ul className="divide-y divide-line rounded-card border border-line bg-white">{rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{r.name}</strong> <span className="text-muted">/{r.slug}</span></span>
          <span className="flex items-center gap-2"><Link href={`/admin/brands?edit=${r.id}`} className="btn-outline !min-h-0 !py-1.5">Edit</Link><DeleteForm action={deleteBrand} id={r.id} /></span></li>))}</ul>
        : <p className="text-sm text-muted">No brands yet.</p>}
    </>
  );
}
