import Link from "next/link";
import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";
import { saveProduct, deleteProduct } from "../../content-actions";
import { Flash, NoDb, Lbl, DeleteForm, inp, card, type SP } from "@/components/AdminUI";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const db = getAdmin(); if (!db) return <NoDb />;
  const [{ data }, { data: brands }, { data: cats }] = await Promise.all([
    db.from("products").select("*").order("created_at", { ascending: false }),
    db.from("brands").select("slug,name").order("name"), db.from("categories").select("slug,name").order("sort_order")]);
  const rows = data ?? []; const cur = rows.find((r) => r.id === searchParams.edit);
  const specsText = (cur?.specs ?? []).map((x: { label: string; value: string }) => `${x.label}: ${x.value}`).join("\n");
  return (
    <>
      <h1 className="text-3xl font-extrabold">Products</h1>
      <p className="mt-1 text-sm text-muted">Only enter specifications and claims supplied by the manufacturer or supplier.</p>
      <div className="mt-5"><Flash sp={searchParams} /></div>
      <form action={saveProduct} className={`${card} max-w-3xl space-y-4`} key={cur?.id ?? "new"}>
        <h2 className="text-lg font-bold">{cur ? "Edit product" : "Add product"}</h2>
        <input type="hidden" name="id" value={cur?.id ?? ""} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Lbl t="Product name *"><input name="name" required defaultValue={cur?.name} className={inp} /></Lbl>
          <Lbl t="URL name (slug)" hint="Optional. Created from the name if left empty."><input name="slug" defaultValue={cur?.slug} className={inp} /></Lbl>
          <Lbl t="Category"><select name="category" defaultValue={cur?.category_slug ?? ""} className={inp}><option value="">None</option>{(cats ?? []).map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></Lbl>
          <Lbl t="Brand"><select name="brand" defaultValue={cur?.brand_slug ?? ""} className={inp}><option value="">None</option>{(brands ?? []).map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></Lbl>
          <Lbl t="Availability"><select name="availability" defaultValue={cur?.availability ?? "on-request"} className={inp}><option value="in-stock">In Stock</option><option value="on-request">Available on Request</option><option value="out-of-stock">Out of Stock</option></select></Lbl>
          <Lbl t="Price (PKR)" hint="Leave empty to show “Request a Quote”."><input name="price" type="number" min="0" step="0.01" defaultValue={cur?.price ?? ""} className={inp} /></Lbl>
        </div>
        <Lbl t="Description"><textarea name="description" rows={4} defaultValue={cur?.description ?? ""} className={inp} /></Lbl>
        <Lbl t="Features and benefits" hint="One per line."><textarea name="features" rows={4} defaultValue={(cur?.features ?? []).join("\n")} className={inp} /></Lbl>
        <Lbl t="Technical specifications" hint="One per line, as  Label: value  (for example  Voltage: 220 V)."><textarea name="specs" rows={5} defaultValue={specsText} className={inp} /></Lbl>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" name="featured" defaultChecked={!!cur?.featured} />Show on the homepage as a featured product</label>
        <fieldset className="space-y-2"><legend className="text-sm font-semibold">Images (up to 6; JPG, PNG or WebP, max 4 MB each)</legend>
          {(cur?.images ?? []).length > 0 && <div className="flex flex-wrap gap-3">{(cur?.images as string[]).map((u) => (
            <label key={u} className="text-xs"><img src={u} alt="" className="h-20 w-20 rounded-lg object-cover" /><span className="mt-1 flex items-center gap-1"><input type="checkbox" name="keep_image" value={u} defaultChecked />Keep</span></label>))}</div>}
          <input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="block text-sm" /></fieldset>
        <Lbl t="Brochure / technical PDF (max 4 MB)">
          {cur?.brochure_url && <a href={cur.brochure_url} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-brand underline">Current brochure</a>}
          <input name="brochure" type="file" accept="application/pdf" className="mt-1 block text-sm" /></Lbl>
        {cur?.brochure_url && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remove_brochure" />Remove current brochure</label>}
        <div className="flex gap-2"><button className="btn-primary">Save product</button>{cur && <Link href="/admin/products" className="btn-outline">Cancel</Link>}</div>
      </form>
      <h2 className="mb-3 mt-10 text-xl font-bold">All products ({rows.length})</h2>
      {rows.length ? <ul className="divide-y divide-line rounded-card border border-line bg-white">{rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{r.name}</strong> <span className="text-muted">· {r.availability}{r.featured ? " · featured" : ""}</span></span>
          <span className="flex items-center gap-2"><Link href={`/admin/products?edit=${r.id}`} className="btn-outline !min-h-0 !py-1.5">Edit</Link><DeleteForm action={deleteProduct} id={r.id} /></span></li>))}</ul>
        : <p className="text-sm text-muted">No products yet. Until you add one, visitors see an empty catalogue.</p>}
    </>
  );
}
