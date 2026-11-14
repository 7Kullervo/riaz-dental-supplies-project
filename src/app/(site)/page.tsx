import Link from "next/link";
import { ShieldCheck, Headphones, Boxes, HeartHandshake, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { getCategories, getProducts, getBrands, getSiteContent, getTestimonials, isPlaceholder, usingDemo } from "@/lib/content";
import JsonLd from "@/components/JsonLd";
import { baseUrl } from "@/lib/url";
import { intl } from "@/lib/phone";
import { Placeholder, Img, SectionHeading, ProductCard, DemoBadge } from "@/components/ui";
import Faq from "@/components/Faq";
import ShopMap, { directionsUrl } from "@/components/ShopMap";

export const revalidate = 60;
const trust = [{ icon: ShieldCheck, t: "Quality-Focused Products" }, { icon: Headphones, t: "Professional Support" }, { icon: Boxes, t: "Product Variety" }, { icon: HeartHandshake, t: "Customer-Centric Service" }];
const why = [
  ["Quality-Focused Selection", "We focus on equipment and supplies suited to professional dental practice."],
  ["Professional Assistance", "Talk to us about what you need and we will help you find suitable options."],
  ["Product Variety", "Equipment, instruments, materials and accessories across many categories."],
  ["Customer Support", "Enquire in person, by form or by message and we will follow up."],
];

export default async function Home() {
  const [cats, prods, brands, sc, tms] = await Promise.all([getCategories(), getProducts(), getBrands(), getSiteContent(), getTestimonials()]);
  const demo = usingDemo();
  const heroOpacity = (Number.isNaN(Number(sc.heroOpacity)) ? 45 : Math.min(100, Math.max(0, Number(sc.heroOpacity)))) / 100;
  const featured = prods.filter((p) => p.featured).slice(0, 4);
  // Only verified details go into structured data: no ratings, reviews, hours or placeholder contact info.
  const ld = {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: site.name, url: baseUrl(),
    image: sc.heroImage || undefined, description: "Dental equipment, instruments and supplies for dental professionals in Rawalpindi and Islamabad.",
    address: { "@type": "PostalAddress", streetAddress: "First Floor, Ramzan Plaza, Bank Rd, Saddar", addressLocality: "Rawalpindi", postalCode: "46000", addressCountry: "PK" },
    telephone: isPlaceholder(sc.phone) ? undefined : [sc.phone, sc.phone2].filter(Boolean).map(intl), email: isPlaceholder(sc.email) ? undefined : sc.email,
  };
  return (
    <>
      <JsonLd data={ld} />
      <section className="relative isolate overflow-hidden bg-navy">
        {sc.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sc.heroImage} alt="" fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ opacity: heroOpacity }} />
        )}
        <div className="container-x py-24 text-center lg:py-40">
          <h1 className="text-5xl font-extrabold !text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">Riaz Dental Supplies</h1>
          <p className="mx-auto mt-5 max-w-3xl text-2xl font-semibold text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)] sm:text-3xl">Equipping Dental Professionals for Better Care.</p>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-100 [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">Discover quality dental equipment, instruments and supplies to support modern dental practices.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-primary">Explore Products</Link>
            <Link href="/contact" className="btn border border-white text-white hover:bg-white hover:text-navy">Contact Us</Link>
          </div>
        </div>
      </section>
      <section aria-label="Why customers choose us" className="border-b border-line">
        <ul className="container-x grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {trust.map(({ icon: I, t }) => <li key={t} className="flex items-center gap-3 text-sm font-semibold text-navy"><I className="text-teal" size={24} aria-hidden />{t}</li>)}
        </ul>
      </section>
      {cats.length > 0 && <section className="py-20"><div className="container-x">
        <SectionHeading center title="Explore Our Product Categories" text="Availability of individual items should be confirmed with the shop." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} className="group overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:-translate-y-0.5">
              <Img src={c.imageUrl} alt={c.name} label="Category image placeholder" className="aspect-[4/3] w-full border-0 border-b" />
              <div className="p-5"><h3 className="font-bold">{c.name}</h3><p className="mt-1 text-sm text-muted">{c.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-brand group-hover:underline">Explore Products</span></div>
            </Link>))}
        </div>
      </div></section>}
      {featured.length > 0 && <section className="bg-mist py-20"><div className="container-x">
        <SectionHeading title="Explore Our Featured Products" text={demo ? "Placeholder products shown for demonstration until the real inventory is added." : undefined} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </div></section>}
      <section className="py-20"><div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <Img src={sc.aboutImage} alt="Riaz Dental Supplies" label="About photograph placeholder" className="aspect-[4/3] w-full rounded-card" />
        <div><SectionHeading title="Your Partner in Dental Excellence" /><p className="-mt-6 whitespace-pre-line text-muted">{sc.overview}</p><Link href="/about" className="btn-outline mt-6">Learn More</Link></div>
      </div></section>
      <section className="bg-mist py-20"><div className="container-x">
        <SectionHeading center title="Why Choose Us?" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{why.map(([t, d]) => <div key={t} className="rounded-card border border-line bg-white p-6 shadow-card"><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div>)}</div>
      </div></section>
      {brands.length > 0 && <section className="py-20"><div className="container-x">
        <SectionHeading center title="Brands and Manufacturers" text={demo ? "Placeholder brands. Real manufacturers will be listed only once confirmed by the owner." : undefined} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => <Link key={b.slug} href={`/brands?brand=${b.slug}`}><Img src={b.logoUrl} alt={b.name} label={`${b.name} logo`} contain className="h-24 w-full rounded-card border border-line hover:border-brand" /></Link>)}
        </div>
      </div></section>}
      <section className="bg-navy py-20 text-center text-white"><div className="container-x max-w-2xl">
        <h2 className="text-3xl font-extrabold !text-white sm:text-4xl">Upgrade Your Dental Practice.</h2>
        <p className="mt-3 text-slate-300">Explore dental equipment and supplies for your professional needs.</p>
        <Link href="/products" className="btn mt-7 bg-teal text-white hover:bg-white hover:text-navy">Explore Products</Link>
      </div></section>
      {tms.length > 0 && <section className="py-20"><div className="container-x">
        <SectionHeading center title="What Customers Say" />
        {tms[0].demo && <div className="mb-6 text-center"><DemoBadge>Demonstration testimonials, not real customer reviews</DemoBadge></div>}
        <div className="grid gap-6 md:grid-cols-3">{tms.map((t) => (
          <figure key={t.id} className="rounded-card border border-line bg-white p-6 shadow-card"><blockquote className="text-sm text-muted">{t.quote}</blockquote><figcaption className="mt-4 text-sm font-semibold">{t.author}{t.role && <span className="font-normal text-muted">, {t.role}</span>}</figcaption></figure>))}</div>
      </div></section>}
      <section className="bg-mist py-20"><div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div><SectionHeading title="We'd Love to Welcome You" />
          <address className="-mt-6 not-italic text-ink"><MapPin className="mb-2 text-brand" aria-hidden />{site.address.map((l) => <div key={l}>{l}</div>)}</address>
          <div className="mt-6 flex flex-wrap gap-3"><a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">Get Directions</a><Link href="/contact" className="btn-outline"><Phone size={16} aria-hidden />Contact</Link></div>
          <Img src={sc.shopImage} alt="Riaz Dental Supplies shop" label="Shop photograph placeholder" className="mt-6 h-40 w-full rounded-card" /></div>
        <ShopMap className="h-96" />
      </div></section>
      <section id="faq" className="py-20"><div className="container-x"><SectionHeading center title="Frequently Asked Questions" /><Faq /></div></section>
      <section className="bg-mist py-20 text-center"><div className="container-x max-w-2xl">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Looking for the Right Dental Equipment?</h2>
        <p className="mt-3 text-muted">Get in touch with Riaz Dental Supplies and let us help you find what you need.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/contact" className="btn-outline">Contact Us</Link><Link href="/request-quote" className="btn-primary">Request a Quote</Link></div>
      </div></section>
    </>
  );
}
