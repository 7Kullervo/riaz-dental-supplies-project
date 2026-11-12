import Link from "next/link";
import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";
import { saveTestimonial, deleteTestimonial } from "../../content-actions";
import { Flash, NoDb, Lbl, DeleteForm, inp, card, type SP } from "@/components/AdminUI";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  const db = getAdmin(); if (!db) return <NoDb />;
  const { data, error } = await db.from("testimonials").select("*").order("created_at", { ascending: false });
  const rows = data ?? []; const cur = rows.find((r) => r.id === searchParams.edit);
  return (
    <>
      <h1 className="text-3xl font-extrabold">Testimonials</h1>
      <p className="mt-1 text-sm text-muted">Publish only genuine feedback from real customers, and only with their permission. The homepage section appears once you add the first one.</p>
      {error && <p role="alert" className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Testimonials table not found. Run supabase/phase5.sql in the Supabase SQL Editor.</p>}
      <div className="mt-5"><Flash sp={searchParams} /></div>
      <form action={saveTestimonial} className={`${card} max-w-2xl space-y-4`} key={cur?.id ?? "new"}>
        <h2 className="text-lg font-bold">{cur ? "Edit testimonial" : "Add testimonial"}</h2>
        <input type="hidden" name="id" value={cur?.id ?? ""} />
        <Lbl t="Customer's words *"><textarea name="quote" rows={3} required defaultValue={cur?.quote} className={inp} /></Lbl>
        <div className="grid gap-4 sm:grid-cols-2">
          <Lbl t="Customer name *"><input name="author" required defaultValue={cur?.author} className={inp} /></Lbl>
          <Lbl t="Clinic or role" hint="Optional."><input name="role" defaultValue={cur?.role ?? ""} className={inp} /></Lbl>
        </div>
        <div className="flex gap-2"><button className="btn-primary">Save testimonial</button>{cur && <Link href="/admin/testimonials" className="btn-outline">Cancel</Link>}</div>
      </form>
      <h2 className="mb-3 mt-10 text-xl font-bold">All testimonials</h2>
      {rows.length ? <ul className="divide-y divide-line rounded-card border border-line bg-white">{rows.map((r) => (
        <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"><span><strong>{r.author}</strong> <span className="text-muted">· {r.quote.slice(0, 60)}…</span></span>
          <span className="flex items-center gap-2"><Link href={`/admin/testimonials?edit=${r.id}`} className="btn-outline !min-h-0 !py-1.5">Edit</Link><DeleteForm action={deleteTestimonial} id={r.id} /></span></li>))}</ul>
        : <p className="text-sm text-muted">No testimonials yet.</p>}
    </>
  );
}
