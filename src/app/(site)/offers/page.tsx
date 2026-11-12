import type { Metadata } from "next";
import Link from "next/link";
import { getOffers, usingDemo } from "@/lib/content";
import { DemoBadge } from "@/components/ui";

export const metadata: Metadata = { title: "Offers", description: "Current offers and promotions from Riaz Dental Supplies." };
export const revalidate = 600;

export default async function OffersPage() {
  const today = new Date().toISOString().slice(0, 10);
  const active = (await getOffers()).filter((o) => o.expires >= today);
  return (
    <>
      <section className="bg-navy py-16 text-center"><div className="container-x max-w-2xl">
        <h1 className="text-4xl font-extrabold !text-white">Offers</h1>
        <p className="mt-3 text-slate-300">Current promotions from Riaz Dental Supplies. Enquire to confirm details.</p></div></section>
      <section className="py-14"><div className="container-x">
        {usingDemo() && <p className="mb-6"><DemoBadge>Offers below are demonstration placeholders. No real discount is implied.</DemoBadge></p>}
        {active.length ? (
          <div className="grid gap-6 md:grid-cols-2">{active.map((o) => (
            <article key={o.id} className="rounded-card border border-line bg-white p-7 shadow-card">
              <h2 className="text-xl font-bold">{o.title}</h2><p className="mt-2 text-muted">{o.description}</p>
              <p className="mt-3 text-sm font-semibold text-brand">Valid until {new Date(o.expires).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
              <Link href={`/request-quote${o.productSlug ? `?product=${o.productSlug}` : ""}`} className="btn-primary mt-5">Enquire About This Offer</Link>
            </article>))}</div>
        ) : <div className="rounded-card border border-dashed border-line p-12 text-center text-muted">There are no active offers right now. <Link href="/contact" className="text-brand underline">Contact us</Link> for current pricing.</div>}
      </div></section>
    </>
  );
}
