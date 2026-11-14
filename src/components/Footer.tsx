import Link from "next/link";
import { site } from "@/lib/site";
import type { SiteContent } from "@/lib/content";

const cols = [
  { title: "Company", links: [["About Us", "/about"], ["Contact Us", "/contact"], ["Products", "/products"], ["Brands", "/brands"]] },
  { title: "Customer Information", links: [["Price List", "/price-list"], ["FAQs", "/#faq"], ["Request a Quote", "/request-quote"], ["Product Enquiries", "/contact"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy-policy"], ["Terms of Use", "/terms-of-use"], ["Terms & Conditions", "/terms-and-conditions"], ["Disclaimer", "/disclaimer"], ["Shipping & Delivery Policy", "/shipping-delivery-policy"], ["Return & Refund Policy", "/return-refund-policy"], ["Cookie Policy", "/cookie-policy"]] },
];

export default function Footer({ c }: { c: Pick<SiteContent, "phone" | "phone2" | "email" | "whatsapp"> }) {
  return (
    <footer className="bg-navy text-slate-300">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {cols.map((c) => (
          <div key={c.title}>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{c.title}</h3>
            <ul className="space-y-2 text-sm">
              {c.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
          <address className="space-y-1 text-sm not-italic">
            {site.address.map((l) => <div key={l}>{l}</div>)}
            <div className="pt-2">Phone: {c.phone}</div>
            {c.phone2 && <div>Phone: {c.phone2}</div>}
            <div>WhatsApp: {c.whatsapp || "to be added"}</div>
            <div>Email: {c.email}</div>
          </address>
          <p className="mt-4 text-xs text-slate-400">Social media links: to be added</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© 2026 Riaz Dental Supplies. All Rights Reserved.</div>
    </footer>
  );
}
