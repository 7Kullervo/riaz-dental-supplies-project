import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { type Product, availabilityLabel } from "@/lib/data";

export function Placeholder({ label = "Placeholder image", className = "" }: { label?: string; className?: string }) {
  return (
    <div role="img" aria-label={label} className={`flex flex-col items-center justify-center gap-2 border border-dashed border-line bg-mist text-muted ${className}`}>
      <ImageIcon size={28} aria-hidden /><span className="px-2 text-center text-xs font-medium">{label}</span>
    </div>
  );
}
// Shows the real image when there is one, otherwise a labelled placeholder.
export function Img({ src, alt, label, className = "", contain = false, eager = false }: { src?: string; alt: string; label: string; className?: string; contain?: boolean; eager?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} className={`${className} ${contain ? "object-contain bg-white p-3" : "object-cover"}`} /> : <Placeholder label={label} className={className} />;
}
export function SectionHeading({ eyebrow, title, text, center }: { eyebrow?: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`mb-10 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>}
      <h2 className="text-3xl font-extrabold sm:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
}
export function DemoBadge({ children = "Demonstration data" }: { children?: React.ReactNode }) {
  return <span className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800">{children}</span>;
}
const tone = { "in-stock": "text-emerald-700 bg-emerald-50", "on-request": "text-brand bg-mist", "out-of-stock": "text-red-700 bg-red-50" };
export function ProductCard({ p }: { p: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:-translate-y-0.5">
      <Img src={p.images[0]} alt={p.name} label="Product image placeholder" className="aspect-[4/3] w-full border-0 border-b" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase text-muted">{p.brandName}</span>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone[p.availability]}`}>{availabilityLabel[p.availability]}</span>
        </div>
        <h3 className="text-lg font-bold">{p.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{p.description}</p>
        <p className="mt-3 text-sm font-semibold text-navy">{p.price ? `Rs ${p.price.toLocaleString()}` : "Request a Quote"}</p>
        <div className="mt-4 flex gap-2 pt-1"><Link href={`/products/${p.slug}`} className="btn-primary flex-1">View Details</Link></div>
        {p.demo && <div className="mt-2"><DemoBadge /></div>}
      </div>
    </article>
  );
}
