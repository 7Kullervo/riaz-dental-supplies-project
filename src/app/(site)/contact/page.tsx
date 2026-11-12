import type { Metadata } from "next";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { getSiteContent, isPlaceholder } from "@/lib/content";
import EnquiryForm from "@/components/EnquiryForm";
import ShopMap, { directionsUrl } from "@/components/ShopMap";

export const metadata: Metadata = { title: "Contact Us", description: "Contact Riaz Dental Supplies or visit our shop at Ramzan Plaza, Bank Road, Saddar, Rawalpindi." };

export const revalidate = 60;
export default async function ContactPage() {
  const sc = await getSiteContent();
  const wa = sc.whatsapp ? `https://wa.me/${sc.whatsapp}?text=${encodeURIComponent("Hello Riaz Dental Supplies, I would like to enquire about...")}` : "";
  return (
    <section className="py-14"><div className="container-x">
      <h1 className="text-4xl font-extrabold">Contact Us</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="flex gap-3"><MapPin className="mt-1 shrink-0 text-brand" aria-hidden />
            <address className="not-italic"><strong>Riaz Dental Supplies</strong>{site.address.map((l) => <div key={l}>{l}</div>)}</address></div>
          <div className="flex gap-3"><Phone className="shrink-0 text-brand" aria-hidden />Phone: {sc.phone}{isPlaceholder(sc.phone) && <span className="text-xs text-muted"> (placeholder)</span>}</div>
          <div className="flex gap-3"><Mail className="shrink-0 text-brand" aria-hidden />Email: {sc.email}{isPlaceholder(sc.email) && <span className="text-xs text-muted"> (placeholder)</span>}</div>
          <div className="flex gap-3"><Clock className="shrink-0 text-brand" aria-hidden />{sc.hours}</div>
          <div className="flex flex-wrap items-center gap-3">
            <MessageCircle className="text-brand" aria-hidden />
            {wa ? <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary">Chat on WhatsApp</a> : <span>WhatsApp number to be added by the owner</span>}
            <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">Get Directions</a>
          </div>
          <p className="text-sm text-muted">Social media links: to be added.</p>
          <ShopMap className="h-72" />
        </div>
        <EnquiryForm kind="contact" />
      </div>
    </div></section>
  );
}
