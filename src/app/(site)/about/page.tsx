import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { getCategories, getSiteContent, isPlaceholder } from "@/lib/content";
import { SectionHeading, Img } from "@/components/ui";
import ShopMap, { directionsUrl } from "@/components/ShopMap";

export const metadata: Metadata = { title: "About Us", description: "About Riaz Dental Supplies, a dental equipment and supplies business in Saddar, Rawalpindi." };

const values = [["Quality Focus", "We care about the suitability and reliability of what we supply."], ["Integrity", "Clear, honest information about products and availability."], ["Professional Support", "Helpful guidance for dental professionals."], ["Customer Care", "Respectful, responsive service for every enquiry."]];

export const revalidate = 60;
export default async function About() {
  const [categories, sc] = await Promise.all([getCategories(), getSiteContent()]);
  return (
    <>
      <section className="bg-mist py-20">
        <div className="container-x max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-brand">ABOUT US</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Riaz Dental Supplies</h1>
          <p className="mt-4 text-lg text-muted">A dental equipment, instruments and supplies business serving dental professionals from Saddar, Rawalpindi.</p>
        </div>
      </section>
      <section className="py-16"><div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div><h2 className="text-3xl font-extrabold">Company Overview</h2>
          <p className="mt-4 text-muted">{sc.overview}</p></div>
        <Img src={sc.aboutImage} alt="Riaz Dental Supplies" label="Company photograph placeholder" className="aspect-[4/3] w-full rounded-card" />
      </div></section>
      <section className="bg-mist py-16"><div className="container-x grid gap-6 md:grid-cols-2">
        {[["Our Mission", sc.mission], ["Our Vision", sc.vision]].map(([t, d]) => (
          <div key={t} className="rounded-card border border-line bg-white p-8 shadow-card"><h2 className="text-2xl font-extrabold">{t}</h2><p className="mt-3 text-muted">{d}</p></div>))}
      </div></section>
      <section className="py-16"><div className="container-x">
        <SectionHeading center title="Core Values" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{values.map(([t, d]) => (
          <div key={t} className="rounded-card border border-line p-6"><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div>))}</div>
      </div></section>
      <section className="bg-mist py-16"><div className="container-x">
        <SectionHeading title="Product and Equipment Categories" text="Confirm availability of specific items with the shop." />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{categories.map((c) => (
          <li key={c.slug}><Link href={`/products?category=${c.slug}`} className="block rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium hover:border-brand hover:text-brand">{c.name}</Link></li>))}</ul>
      </div></section>
      <section className="py-16"><div className="container-x grid gap-6 md:grid-cols-2">
        <div className="rounded-card border border-line p-8"><h2 className="text-2xl font-extrabold">Commitment to Dental Professionals</h2><p className="mt-3 text-muted">We aim to make it simple to find, compare and enquire about the equipment and supplies your practice needs.</p></div>
        <div className="rounded-card border border-line p-8"><h2 className="text-2xl font-extrabold">Customer Support</h2><p className="mt-3 text-muted">Send an enquiry, request a quotation or visit us. Phone: {sc.phone} · Email: {sc.email}{isPlaceholder(sc.phone + sc.email) ? " (placeholders, to be confirmed)" : ""}.</p></div>
      </div></section>
      <section className="bg-mist py-16"><div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div><h2 className="text-3xl font-extrabold">Visit Our Shop</h2>
          <address className="mt-4 not-italic text-ink">{site.address.map((l) => <div key={l}>{l}</div>)}</address>
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-5">Get Directions</a></div>
        <ShopMap className="h-80" />
      </div></section>
      <section className="py-16 text-center"><div className="container-x"><h2 className="text-3xl font-extrabold">Have a question or need a quote?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/contact" className="btn-outline">Contact Us</Link><Link href="/request-quote" className="btn-primary">Request a Quote</Link></div></div></section>
    </>
  );
}
