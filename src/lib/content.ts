import "server-only";
import { getAdmin } from "./supabase-server";
import { site } from "./site";
import { demoCategories, demoBrands, demoProducts, demoOffers, type Product, type Brand, type Category, type Offer } from "./data";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;
export type SiteContent = { announcement: string; overview: string; mission: string; vision: string; phone: string; email: string; whatsapp: string; hours: string; heroImage: string; aboutImage: string; shopImage: string };

export const usingDemo = () => !getAdmin();
export const isPlaceholder = (v: string) => /XXX|example\.com|to be confirmed/i.test(v);

const defaults: SiteContent = {
  announcement: site.announcement,
  overview: "Riaz Dental Supplies provides dental equipment and supplies to dentists, dental clinics, hospitals, students and laboratories. Customers can browse products online, request quotations, or visit the shop in person.",
  mission: "To help dental professionals access dependable equipment and supplies, with clear information and helpful service.",
  vision: "To be a trusted local source of dental equipment and supplies for the dental community.",
  phone: site.phone, email: site.email, whatsapp: site.whatsapp, hours: site.hours,
  heroImage: "", aboutImage: "", shopImage: "",
};

export async function getSiteContent(): Promise<SiteContent> {
  const db = getAdmin(); if (!db) return defaults;
  const { data } = await db.from("site_content").select("value").eq("key", "main").maybeSingle();
  const out = { ...defaults };
  for (const [k, v] of Object.entries((data?.value ?? {}) as Row)) if (k in out && typeof v === "string" && v.trim()) (out as Row)[k] = v;
  return out;
}
export async function getCategories(): Promise<Category[]> {
  const db = getAdmin(); if (!db) return demoCategories;
  const { data, error } = await db.from("categories").select("*").order("sort_order").order("name");
  if (error) { console.error(error.message); return []; }
  return (data as Row[]).map((r) => ({ slug: r.slug, name: r.name, description: r.description ?? "", imageUrl: r.image_url ?? undefined }));
}
export async function getBrands(): Promise<Brand[]> {
  const db = getAdmin(); if (!db) return demoBrands;
  const { data, error } = await db.from("brands").select("*").order("name");
  if (error) { console.error(error.message); return []; }
  return (data as Row[]).map((r) => ({ slug: r.slug, name: r.name, description: r.description ?? "", logoUrl: r.logo_url ?? undefined }));
}
export async function getProducts(): Promise<Product[]> {
  const db = getAdmin(); if (!db) return demoProducts;
  const [{ data, error }, brands, cats] = await Promise.all([db.from("products").select("*").order("created_at", { ascending: false }), getBrands(), getCategories()]);
  if (error) { console.error(error.message); return []; }
  return (data as Row[]).map((r) => ({
    slug: r.slug, name: r.name, brand: r.brand_slug ?? "", brandName: brands.find((b) => b.slug === r.brand_slug)?.name ?? "",
    category: r.category_slug ?? "", categoryName: cats.find((c) => c.slug === r.category_slug)?.name ?? "",
    description: r.description ?? "", price: r.price != null ? Number(r.price) : undefined, availability: r.availability,
    features: r.features ?? [], specs: (r.specs ?? []).map((s: Row) => [s.label, s.value] as [string, string]),
    images: r.images ?? [], brochureUrl: r.brochure_url ?? undefined, featured: !!r.featured,
  }));
}
export async function getOffers(): Promise<Offer[]> {
  const db = getAdmin(); if (!db) return demoOffers;
  const { data, error } = await db.from("offers").select("*").order("expires_on");
  if (error) { console.error(error.message); return []; }
  return (data as Row[]).map((r) => ({ id: r.id, title: r.title, description: r.description ?? "", expires: r.expires_on, productSlug: r.product_slug ?? undefined }));
}

export type Testimonial = { id: string; quote: string; author: string; role: string; demo?: boolean };
export async function getTestimonials(): Promise<Testimonial[]> {
  const db = getAdmin();
  if (!db) return [1, 2, 3].map((n) => ({ id: String(n), quote: "Placeholder testimonial text. Real customer feedback will be added here with permission.", author: "Customer name, clinic", role: "", demo: true }));
  const { data, error } = await db.from("testimonials").select("*").order("created_at", { ascending: false }).limit(9);
  if (error) { console.error(error.message); return []; }
  return (data as Row[]).map((r) => ({ id: r.id, quote: r.quote, author: r.author, role: r.role ?? "" }));
}
