"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Printer, Search } from "lucide-react";
import { type Product, type Category, availabilityLabel, formatPrice } from "@/lib/data";

const tone = { "in-stock": "text-emerald-700 bg-emerald-50", "on-request": "text-brand bg-mist", "out-of-stock": "text-red-700 bg-red-50" };
const field = "rounded-lg border border-line bg-white px-3 py-2.5 text-sm";

export default function PriceListClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [q, setQ] = useState(""); const [cat, setCat] = useState("");
  const groups = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = products.filter((p) => (!cat || p.category === cat) && (!t || `${p.name} ${p.brandName}`.toLowerCase().includes(t)));
    const order = categories.map((c) => c.slug);
    const map = new Map<string, Product[]>();
    for (const p of list) { const k = p.category || ""; map.set(k, [...(map.get(k) ?? []), p]); }
    const rank = (s: string) => (s ? (order.indexOf(s) === -1 ? 998 : order.indexOf(s)) : 999);
    return [...map.entries()].sort(([a], [b]) => rank(a) - rank(b)).map(([slug, items]) => ({
      name: categories.find((c) => c.slug === slug)?.name ?? "Other products",
      items: [...items].sort((x, y) => x.name.localeCompare(y.name)),
    }));
  }, [products, categories, q, cat]);
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end gap-3 print:hidden">
        <label className="relative block min-w-[220px] flex-1 text-sm font-semibold">Search
          <Search size={16} className="pointer-events-none absolute bottom-3.5 left-3 text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Product or brand" className={`${field} mt-1 w-full pl-9 font-normal`} /></label>
        <label className="block text-sm font-semibold">Category
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={`${field} mt-1 block font-normal`}>
            <option value="">All categories</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
        <button type="button" onClick={() => window.print()} className="btn-outline"><Printer size={16} aria-hidden />Print / Save as PDF</button>
      </div>
      <p className="mb-4 text-sm text-muted print:hidden" aria-live="polite">{total} product{total === 1 ? "" : "s"}</p>

      {total === 0 ? (
        <div className="rounded-card border border-dashed border-line p-12 text-center text-muted">
          {products.length === 0 ? "No products have been listed yet." : "No products match your search."} <Link href="/contact" className="text-brand underline">Contact us</Link> for pricing.
        </div>
      ) : groups.map((g) => (
        <section key={g.name} className="mb-10 break-inside-avoid">
          <h2 className="mb-3 text-xl font-bold">{g.name} <span className="text-sm font-normal text-muted">({g.items.length})</span></h2>
          <div className="overflow-x-auto rounded-card border border-line">
            <table className="w-full table-fixed text-sm sm:min-w-[560px]">
              <thead className="bg-mist text-left text-xs uppercase text-muted"><tr>
                <th className="px-4 py-3">Product</th><th className="hidden px-4 py-3 sm:table-cell sm:w-[18%]">Brand</th><th className="hidden px-4 py-3 md:table-cell md:w-[19%]">Availability</th>
                <th className="w-[120px] px-4 py-3 text-right">Price</th><th className="hidden w-[140px] px-4 py-3 sm:table-cell print:hidden"><span className="sr-only">Action</span></th></tr></thead>
              <tbody className="divide-y divide-line bg-white">{g.items.map((p) => (
                <tr key={p.slug}>
                  <td className="px-4 py-3"><Link href={`/products/${p.slug}`} className="font-semibold text-navy hover:text-brand">{p.name}</Link>
                    <div className="text-xs text-muted sm:hidden">{p.brandName}</div>
                    <Link href={`/request-quote?product=${p.slug}`} className="mt-1 inline-block text-xs font-semibold text-brand hover:underline sm:hidden print:hidden">Request a Quote</Link></td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{p.brandName || "–"}</td>
                  <td className="hidden px-4 py-3 md:table-cell"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[p.availability]}`}>{availabilityLabel[p.availability]}</span></td>
                  <td className="px-4 py-3 text-right font-semibold text-navy">{p.price ? <span className="whitespace-nowrap">{formatPrice(p.price)}</span> : <span className="font-normal text-muted">Price on request</span>}</td>
                  <td className="hidden px-4 py-3 text-right sm:table-cell print:hidden"><Link href={`/request-quote?product=${p.slug}`} className="whitespace-nowrap text-xs font-semibold text-brand hover:underline">Request a Quote</Link></td>
                </tr>))}</tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
