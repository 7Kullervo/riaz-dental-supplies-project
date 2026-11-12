// DEMONSTRATION DATA: shown only while Supabase is not connected. Nothing here is real stock, pricing or partnerships.
import { categories as seedCats } from "./site";

export type Availability = "in-stock" | "on-request" | "out-of-stock";
export type Product = {
  slug: string; name: string; brand: string; brandName: string; category: string; categoryName: string;
  description: string; price?: number; availability: Availability; features: string[]; specs: [string, string][];
  images: string[]; brochureUrl?: string; featured?: boolean; demo?: boolean;
};
export type Brand = { slug: string; name: string; description: string; logoUrl?: string };
export type Category = { slug: string; name: string; description: string; imageUrl?: string };
export type Offer = { id: string; title: string; description: string; expires: string; productSlug?: string };

export const categoryDesc: Record<string, string> = {
  "dental-chairs-units": "Treatment chairs, units and related clinic equipment.",
  "dental-handpieces": "Handpieces and related rotary instruments.",
  "sterilization-equipment": "Equipment for instrument cleaning and sterilization.",
  "imaging-xray-equipment": "Imaging and X-ray equipment for dental diagnostics.",
  "dental-instruments": "Hand instruments for examination and treatment.",
  "surgical-equipment": "Instruments and equipment for dental surgery.",
  "materials-consumables": "Restorative materials and everyday clinic consumables.",
  "laboratory-equipment": "Equipment for dental laboratories.",
  "dental-accessories": "Accessories and supporting items for the dental clinic.",
};
export const availabilityLabel: Record<Availability, string> = { "in-stock": "In Stock", "on-request": "Available on Request", "out-of-stock": "Out of Stock" };

export const demoCategories: Category[] = seedCats.map((c) => ({ ...c, description: categoryDesc[c.slug] }));
export const demoBrands: Brand[] = [1, 2, 3, 4, 5, 6].map((n) => ({ slug: `brand-${n}`, name: `Brand Name ${n}`, description: "Placeholder description. Replace with verified manufacturer information." }));

const mk = (slug: string, name: string, brand: string, category: string, availability: Availability, featured = false): Product => ({
  slug, name, brand, category, availability, featured, demo: true, images: [],
  brandName: demoBrands.find((b) => b.slug === brand)?.name ?? "", categoryName: demoCategories.find((c) => c.slug === category)?.name ?? "",
  description: "Demonstration product. Replace this text with the real product description supplied by the manufacturer or supplier.",
  features: ["Feature to be provided", "Benefit to be provided"],
  specs: [["Model", "To be provided"], ["Specifications", "To be provided by supplier"]],
});
export const demoProducts: Product[] = [
  mk("demo-dental-chair-unit", "Demo Dental Chair Unit", "brand-1", "dental-chairs-units", "on-request", true),
  mk("demo-high-speed-handpiece", "Demo High-Speed Handpiece", "brand-2", "dental-handpieces", "in-stock", true),
  mk("demo-autoclave", "Demo Tabletop Autoclave", "brand-3", "sterilization-equipment", "on-request", true),
  mk("demo-intraoral-sensor", "Demo Intraoral X-Ray Sensor", "brand-4", "imaging-xray-equipment", "on-request", true),
  mk("demo-examination-kit", "Demo Examination Instrument Kit", "brand-5", "dental-instruments", "in-stock"),
  mk("demo-extraction-forceps", "Demo Extraction Forceps Set", "brand-5", "surgical-equipment", "in-stock"),
  mk("demo-composite-material", "Demo Composite Material", "brand-6", "materials-consumables", "out-of-stock"),
  mk("demo-lab-micromotor", "Demo Laboratory Micromotor", "brand-1", "laboratory-equipment", "on-request"),
  mk("demo-curing-light", "Demo LED Curing Light", "brand-2", "dental-accessories", "in-stock"),
];
export const demoOffers: Offer[] = [
  { id: "1", title: "Demonstration Offer: Equipment Enquiry", description: "Placeholder offer. Replace with a real promotion from the admin dashboard.", expires: "2027-12-31", productSlug: "demo-dental-chair-unit" },
  { id: "2", title: "Demonstration Offer: Consumables", description: "Placeholder offer. No real discount is implied.", expires: "2027-12-31", productSlug: "demo-composite-material" },
];
