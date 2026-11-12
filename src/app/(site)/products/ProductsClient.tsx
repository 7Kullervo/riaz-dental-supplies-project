"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import type { Product, Brand, Category } from "@/lib/data";
import { ProductCard } from "@/components/ui";

export default function ProductsClient({ products, brands, categories }: { products: Product[]; brands: Brand[]; categories: Category[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") ?? "", category = sp.get("category") ?? "", brand = sp.get("brand") ?? "";
  const avail = sp.get("availability") ?? "", sort = sp.get("sort") ?? "featured";
  const hasPrices = products.some((p) => p.price !== undefined);
  const min = sp.get("min") ?? "", max = sp.get("max") ?? "";

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    router.replace(`/products?${p.toString()}`, { scroll: false });
  };

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    let r = products.filter((p) =>
      (!t || `${p.name} ${p.description}`.toLowerCase().includes(t)) &&
      (!category || p.category === category) && (!brand || p.brand === brand) && (!avail || p.availability === avail) &&
      (!min || (p.price ?? 0) >= Number(min)) && (!max || (p.price !== undefined && p.price <= Number(max))));
    if (sort === "name-asc") r = [...r].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "name-desc") r = [...r].sort((a, b) => b.name.localeCompare(a.name));
    return r;
  }, [products, q, category, brand, avail, sort, min, max]);

  const field = "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm";
  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
        <label className="block text-sm font-semibold">Search
          <input type="search" defaultValue={q} onChange={(e) => set("q", e.target.value)} placeholder="Search products" className={`${field} mt-1 font-normal`} /></label>
        <label className="block text-sm font-semibold">Category
          <select value={category} onChange={(e) => set("category", e.target.value)} className={`${field} mt-1 font-normal`}>
            <option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
        <label className="block text-sm font-semibold">Brand
          <select value={brand} onChange={(e) => set("brand", e.target.value)} className={`${field} mt-1 font-normal`}>
            <option value="">All brands</option>{brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label>
        <label className="block text-sm font-semibold">Availability
          <select value={avail} onChange={(e) => set("availability", e.target.value)} className={`${field} mt-1 font-normal`}>
            <option value="">Any</option><option value="in-stock">In Stock</option><option value="on-request">Available on Request</option><option value="out-of-stock">Out of Stock</option></select></label>
        {hasPrices && (
          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <label>Min price<input type="number" min="0" defaultValue={min} onChange={(e) => set("min", e.target.value)} className={`${field} mt-1 font-normal`} /></label>
            <label>Max price<input type="number" min="0" defaultValue={max} onChange={(e) => set("max", e.target.value)} className={`${field} mt-1 font-normal`} /></label>
          </div>)}
        <label className="block text-sm font-semibold">Sort by
          <select value={sort} onChange={(e) => set("sort", e.target.value)} className={`${field} mt-1 font-normal`}>
            <option value="featured">Featured</option><option value="name-asc">Name A to Z</option><option value="name-desc">Name Z to A</option></select></label>
        <button type="button" onClick={() => router.replace("/products", { scroll: false })} className="btn-outline w-full">Clear filters</button>
      </aside>
      <div>
        <p className="mb-4 text-sm text-muted" aria-live="polite">{list.length} product{list.length === 1 ? "" : "s"} found</p>
        {list.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        ) : (
          <div className="rounded-card border border-dashed border-line p-12 text-center text-muted">No products match your filters. Try clearing them or <a href="/request-quote" className="text-brand underline">request a quote</a> for what you need.</div>
        )}
      </div>
    </div>
  );
}
