import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getProducts, usingDemo } from "@/lib/content";
import { Img, ProductCard, DemoBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Brands", description: "Brands and manufacturers featured by Riaz Dental Supplies." };
export const dynamic = "force-dynamic";

export default async function BrandsPage({ searchParams }: { searchParams: { brand?: string } }) {
  const [brands, products] = await Promise.all([getBrands(), getProducts()]);
  const sel = brands.find((b) => b.slug === searchParams.brand);
  const shown = sel ? [sel] : brands;
  return (
    <section className="py-12"><div className="container-x">
      <h1 className="text-4xl font-extrabold">Brands</h1>
      <p className="mt-2 text-muted">Listing a brand here does not imply an authorized distribution relationship. {usingDemo() && <DemoBadge>Placeholder brands for demonstration</DemoBadge>}</p>
      {brands.length === 0 && <p className="mt-8 rounded-card border border-dashed border-line p-10 text-center text-muted">No brands have been added yet.</p>}
      {brands.length > 0 && <div className="my-8 flex flex-wrap gap-2">
        <Link href="/brands" className={`rounded-full border px-4 py-1.5 text-sm ${!sel ? "border-brand bg-brand text-white" : "border-line"}`}>All brands</Link>
        {brands.map((b) => <Link key={b.slug} href={`/brands?brand=${b.slug}`} className={`rounded-full border px-4 py-1.5 text-sm ${sel?.slug === b.slug ? "border-brand bg-brand text-white" : "border-line hover:border-brand"}`}>{b.name}</Link>)}
      </div>}
      <div className="space-y-10">{shown.map((b) => {
        const items = products.filter((p) => p.brand === b.slug);
        return (
          <article key={b.slug} className="rounded-card border border-line p-6 shadow-card">
            <div className="flex flex-col gap-6 sm:flex-row">
              <Img src={b.logoUrl} alt={`${b.name} logo`} label={`${b.name} logo`} contain className="h-28 w-full shrink-0 rounded-card border border-line sm:w-48" />
              <div><h2 className="text-2xl font-extrabold">{b.name}</h2><p className="mt-2 text-muted">{b.description}</p><Link href={`/products?brand=${b.slug}`} className="btn-primary mt-4">Explore Products</Link></div>
            </div>
            {sel && (items.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div> : <p className="mt-6 text-sm text-muted">No products listed for this brand yet.</p>)}
          </article>);
      })}</div>
    </div></section>
  );
}
