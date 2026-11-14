import type { Metadata } from "next";
import Link from "next/link";
import { Check, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { getSiteContent } from "@/lib/content";
import { intl } from "@/lib/phone";
import { SectionHeading, Img } from "@/components/ui";
import ShopMap, { directionsUrl } from "@/components/ShopMap";

export const metadata: Metadata = { title: "About Us", description: "About Riaz Dental Supplies: quality dental products and materials for dentists, clinics, hospitals and dental laboratories in Rawalpindi." };
export const revalidate = 60;

const offer = ["Dental Instruments", "Dental Filling Materials", "Composite & Bonding Agents", "Endodontic Materials", "Dental Consumables", "Sterilization Products", "Dental Equipment & Accessories", "Infection Control Products", "Orthodontic Material & Equipment"];
const why = ["Quality Dental Products", "Competitive Prices", "Wide Range of Dental Materials", "Reliable Customer Support", "Professional Service", "Customer Satisfaction"];
const serve = ["Dentists", "Dental Clinics", "Dental Hospitals", "Dental Surgeons", "Dental Laboratories", "Dental Students", "Dental Professionals"];

function Checklist({ items, white = false }: { items: string[]; white?: boolean }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <li key={i} className={`flex items-center gap-3 rounded-card border border-line p-4 text-sm font-semibold text-navy shadow-card ${white ? "bg-mist" : "bg-white"}`}>
          <Check className="shrink-0 text-teal" size={20} aria-hidden />{i}
        </li>
      ))}
    </ul>
  );
}

export default async function About() {
  const sc = await getSiteContent();
  return (
    <>
      <section className="bg-mist py-20">
        <div className="container-x max-w-3xl">
          <p className="text-sm font-semibold tracking-widest text-brand">ABOUT US</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Riaz Dental Supplies</h1>
          <p className="mt-4 text-lg text-muted">Quality dental products and materials for dental professionals, from Saddar, Rawalpindi.</p>
        </div>
      </section>

      <section className="py-16"><div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div><h2 className="text-3xl font-extrabold">Who We Are</h2><p className="mt-4 whitespace-pre-line text-muted">{sc.overview}</p></div>
        <Img src={sc.aboutImage} alt="Riaz Dental Supplies" label="Company photograph placeholder" className="aspect-[4/3] w-full rounded-card" />
      </div></section>

      <section className="bg-mist py-16"><div className="container-x">
        <SectionHeading title="What We Offer" text="We offer a wide range of dental products and materials, including:" />
        <Checklist items={offer} />
      </div></section>

      <section className="py-16"><div className="container-x max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold">Our Mission</h2><p className="mt-4 text-lg text-muted">{sc.mission}</p>
      </div></section>

      <section className="bg-mist py-16"><div className="container-x">
        <SectionHeading title="Why Choose Us" />
        <Checklist items={why} />
      </div></section>

      <section className="py-16"><div className="container-x">
        <SectionHeading title="Who We Serve" text="We proudly serve:" />
        <Checklist items={serve} white />
      </div></section>

      <section className="bg-mist py-16"><div className="container-x max-w-3xl text-center">
        <h2 className="text-3xl font-extrabold">Our Vision</h2><p className="mt-4 text-lg text-muted">{sc.vision}</p>
      </div></section>

      <section className="py-16"><div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold">Visit or Call Us</h2>
          <address className="mt-4 flex gap-3 not-italic text-ink"><MapPin className="mt-1 shrink-0 text-brand" aria-hidden />
            <span><strong>Riaz Dental Supplies</strong>{site.address.map((l) => <span key={l} className="block">{l}</span>)}</span></address>
          <div className="mt-3 flex gap-3"><Phone className="mt-1 shrink-0 text-brand" aria-hidden />
            <div className="space-y-1">{[sc.phone, sc.phone2].filter(Boolean).map((n) => <div key={n}><a href={`tel:${intl(n)}`} className="font-semibold text-navy hover:text-brand">{n}</a></div>)}</div></div>
          <div className="mt-6 flex flex-wrap gap-3"><a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Get Directions</a><Link href="/contact" className="btn-outline">Contact Us</Link></div>
        </div>
        <ShopMap className="h-80" />
      </div></section>

      <section className="bg-mist py-16 text-center"><div className="container-x"><h2 className="text-3xl font-extrabold">Have a question or need a quote?</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/contact" className="btn-outline">Contact Us</Link><Link href="/request-quote" className="btn-primary">Request a Quote</Link></div></div></section>
    </>
  );
}
