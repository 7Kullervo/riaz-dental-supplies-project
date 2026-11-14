import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { availabilityLabel, formatPrice } from "@/lib/data";
import { getProducts, usingDemo } from "@/lib/content";
import { Img, ProductCard, DemoBadge } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { baseUrl } from "@/lib/url";

export const revalidate = 60;
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = (await getProducts()).find((x) => x.slug === params.slug);
  return p ? { title: p.name, description: p.description.slice(0, 160), alternates: { canonical: `/products/${p.slug}` }, openGraph: { title: p.name, description: p.description.slice(0, 160), images: p.images[0] ? [p.images[0]] : undefined } } : { title: "Product not found" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const all = await getProducts();
  const p = all.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const same = all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 3);
  const more = same.length ? same : all.filter((x) => x.slug !== p.slug).slice(0, 3);
  const imgs = p.images.length ? p.images : [undefined, undefined, undefined, undefined];
  // Product structured data only for real listings (never demo data), and only with facts the owner entered.
  const ld = usingDemo() ? null : {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description || undefined,
    image: p.images.length ? p.images : undefined, brand: p.brandName ? { "@type": "Brand", name: p.brandName } : undefined,
    offers: p.price ? { "@type": "Offer", priceCurrency: "PKR", price: p.price, url: `${baseUrl()}/products/${p.slug}`,
      availability: p.availability === "out-of-stock" ? "https://schema.org/OutOfStock" : p.availability === "in-stock" ? "https://schema.org/InStock" : undefined } : undefined,
  };
  return (
    <section className="py-12"><div className="container-x">
      {ld && <JsonLd data={ld} />}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted"><Link href="/products" className="hover:text-brand">Products</Link>{p.categoryName && ` / ${p.categoryName}`}</nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Img src={imgs[0]} alt={p.name} label="Product photograph placeholder" className="aspect-square w-full rounded-card" contain />
          {imgs.length > 1 && <div className="mt-3 grid grid-cols-3 gap-3">{imgs.slice(1, 4).map((s, i) => <Img key={i} src={s} alt={`${p.name} photo ${i + 2}`} label={`Photo ${i + 2}`} className="aspect-square w-full rounded-lg" contain />)}</div>}
        </div>
        <div>
          {p.brandName && <p className="text-sm font-semibold uppercase text-brand">{p.brandName}</p>}
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">{p.name}</h1>
          <p className="mt-3"><span className="rounded-full bg-mist px-3 py-1 text-sm font-semibold text-brand">{availabilityLabel[p.availability]}</span> {usingDemo() && <DemoBadge />}</p>
          {p.description && <p className="mt-4 whitespace-pre-line text-muted">{p.description}</p>}
          <p className="mt-4 text-xl font-bold text-navy">{p.price ? formatPrice(p.price) : "Price on request"}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/request-quote?product=${p.slug}`} className="btn-primary">Request a Quote</Link>
            {p.brochureUrl && <a href={p.brochureUrl} className="btn-outline" target="_blank" rel="noopener noreferrer"><Download size={16} aria-hidden />Download Brochure</a>}
          </div>
          {p.features.length > 0 && <><h2 className="mb-2 mt-10 text-xl font-bold">Features and Benefits</h2><ul className="list-disc space-y-1 pl-5 text-sm text-muted">{p.features.map((f) => <li key={f}>{f}</li>)}</ul></>}
          {p.specs.length > 0 && <><h2 className="mb-2 mt-8 text-xl font-bold">Technical Specifications</h2>
            <table className="w-full text-sm"><tbody>{p.specs.map(([k, v]) => <tr key={k} className="border-b border-line"><th scope="row" className="w-1/3 py-2 text-left font-semibold">{k}</th><td className="py-2 text-muted">{v}</td></tr>)}</tbody></table></>}
        </div>
      </div>
      {more.length > 0 && <><h2 className="mb-6 mt-16 text-2xl font-extrabold">Related Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{more.map((r) => <ProductCard key={r.slug} p={r} />)}</div></>}
    </div></section>
  );
}
