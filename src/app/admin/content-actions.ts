"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";

const s = (fd: FormData, k: string, max = 500) => String(fd.get(k) ?? "").trim().slice(0, max);
const slugify = (t: string) => t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
const isId = (v: string) => /^[0-9a-f-]{36}$/i.test(v);
const IMG = ["image/jpeg", "image/png", "image/webp"], PDF = ["application/pdf"], MAX = 4 * 1024 * 1024;

// Every action: server-side admin check first, then validate, write, refresh the public site, and return to the list.
function done(path: string, msg: string, ok = true): never {
  revalidatePath("/", "layout");
  redirect(`${path}?${ok ? "saved" : "error"}=${encodeURIComponent(msg)}`);
}
async function begin(path: string) {
  await requireAdmin();
  const db = getAdmin();
  if (!db) return done(path, "Database is not connected.", false);
  return db;
}
type Up = { url: string } | { error: string } | null;
async function upload(db: SupabaseClient, f: FormDataEntryValue | null, folder: string, types: string[]): Promise<Up> {
  if (!(f instanceof File) || f.size === 0) return null;
  if (!types.includes(f.type)) return { error: types === PDF ? "Brochure must be a PDF." : "Images must be JPG, PNG or WebP." };
  if (f.size > MAX) return { error: "Each file must be 4 MB or smaller." };
  const path = `${folder}/${crypto.randomUUID()}.${f.type === "application/pdf" ? "pdf" : f.type.split("/")[1]}`;
  const { error } = await db.storage.from("media").upload(path, f, { contentType: f.type });
  if (error) { console.error("upload failed", error.message); return { error: "Upload failed. Check that the 'media' storage bucket exists." }; }
  return { url: db.storage.from("media").getPublicUrl(path).data.publicUrl };
}
const dbError = (e: { code?: string; message: string }) => (e.code === "23505" ? "That URL name (slug) is already used. Choose a different one." : "Could not save. Please try again.");

// ---------- categories ----------
export async function saveCategory(fd: FormData) {
  const P = "/admin/categories", db = await begin(P);
  const id = s(fd, "id"), name = s(fd, "name", 120);
  if (!name) return done(P, "Name is required.", false);
  const row: Record<string, unknown> = { name, slug: slugify(s(fd, "slug") || name), description: s(fd, "description", 400) || null, sort_order: parseInt(s(fd, "sort_order"), 10) || 0 };
  const up = await upload(db, fd.get("image"), "categories", IMG);
  if (up && "error" in up) return done(P, up.error, false);
  if (up) row.image_url = up.url; else if (fd.get("remove_image")) row.image_url = null;
  const { error } = id && isId(id) ? await db.from("categories").update(row).eq("id", id) : await db.from("categories").insert(row);
  return error ? done(P, dbError(error), false) : done(P, "Category saved.");
}
export async function deleteCategory(fd: FormData) {
  const P = "/admin/categories", db = await begin(P), id = s(fd, "id");
  if (!isId(id)) return done(P, "Invalid request.", false);
  const { error } = await db.from("categories").delete().eq("id", id);
  return error ? done(P, "Could not delete.", false) : done(P, "Category deleted. Its products are now uncategorised.");
}
// ---------- brands ----------
export async function saveBrand(fd: FormData) {
  const P = "/admin/brands", db = await begin(P);
  const id = s(fd, "id"), name = s(fd, "name", 120);
  if (!name) return done(P, "Name is required.", false);
  const row: Record<string, unknown> = { name, slug: slugify(s(fd, "slug") || name), description: s(fd, "description", 800) || null };
  const up = await upload(db, fd.get("logo"), "brands", IMG);
  if (up && "error" in up) return done(P, up.error, false);
  if (up) row.logo_url = up.url; else if (fd.get("remove_logo")) row.logo_url = null;
  const { error } = id && isId(id) ? await db.from("brands").update(row).eq("id", id) : await db.from("brands").insert(row);
  return error ? done(P, dbError(error), false) : done(P, "Brand saved.");
}
export async function deleteBrand(fd: FormData) {
  const P = "/admin/brands", db = await begin(P), id = s(fd, "id");
  if (!isId(id)) return done(P, "Invalid request.", false);
  const { error } = await db.from("brands").delete().eq("id", id);
  return error ? done(P, "Could not delete.", false) : done(P, "Brand deleted.");
}
// ---------- products ----------
export async function saveProduct(fd: FormData) {
  const P = "/admin/products", db = await begin(P);
  const id = s(fd, "id"), name = s(fd, "name", 160);
  if (!name) return done(P, "Product name is required.", false);
  const availability = s(fd, "availability");
  if (!["in-stock", "on-request", "out-of-stock"].includes(availability)) return done(P, "Choose an availability.", false);
  const priceRaw = s(fd, "price", 20); const price = priceRaw === "" ? null : Number(priceRaw);
  if (price !== null && (!Number.isFinite(price) || price < 0)) return done(P, "Price must be a positive number, or left empty for 'Request a Quote'.", false);
  const features = s(fd, "features", 4000).split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 30).map((l) => l.slice(0, 200));
  const specs = s(fd, "specs", 4000).split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 40).map((l) => {
    const i = l.indexOf(":"); return i > 0 ? { label: l.slice(0, i).trim().slice(0, 100), value: l.slice(i + 1).trim().slice(0, 300) } : { label: l.slice(0, 100), value: "" };
  });
  const images = fd.getAll("keep_image").map(String).filter((u) => u.startsWith("http"));
  for (const f of fd.getAll("images")) {
    if (images.length >= 6) break;
    const up = await upload(db, f, "products", IMG);
    if (up && "error" in up) return done(P, up.error, false);
    if (up) images.push(up.url);
  }
  const row: Record<string, unknown> = {
    name, slug: slugify(s(fd, "slug") || name), description: s(fd, "description", 4000) || null,
    brand_slug: s(fd, "brand") || null, category_slug: s(fd, "category") || null,
    price, availability, features, specs, images, featured: fd.get("featured") === "on",
  };
  const br = await upload(db, fd.get("brochure"), "brochures", PDF);
  if (br && "error" in br) return done(P, br.error, false);
  if (br) row.brochure_url = br.url; else if (fd.get("remove_brochure")) row.brochure_url = null;
  const { error } = id && isId(id) ? await db.from("products").update(row).eq("id", id) : await db.from("products").insert(row);
  return error ? done(P, dbError(error), false) : done(P, "Product saved.");
}
export async function deleteProduct(fd: FormData) {
  const P = "/admin/products", db = await begin(P), id = s(fd, "id");
  if (!isId(id)) return done(P, "Invalid request.", false);
  const { error } = await db.from("products").delete().eq("id", id);
  return error ? done(P, "Could not delete.", false) : done(P, "Product deleted.");
}
// ---------- offers ----------
export async function saveOffer(fd: FormData) {
  const P = "/admin/offers", db = await begin(P);
  const id = s(fd, "id"), title = s(fd, "title", 160), expires = s(fd, "expires_on", 10);
  if (!title) return done(P, "Title is required.", false);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expires)) return done(P, "Choose an expiry date.", false);
  const row = { title, description: s(fd, "description", 1000) || null, expires_on: expires, product_slug: s(fd, "product") || null };
  const { error } = id && isId(id) ? await db.from("offers").update(row).eq("id", id) : await db.from("offers").insert(row);
  return error ? done(P, "Could not save the offer.", false) : done(P, "Offer saved.");
}
export async function deleteOffer(fd: FormData) {
  const P = "/admin/offers", db = await begin(P), id = s(fd, "id");
  if (!isId(id)) return done(P, "Invalid request.", false);
  const { error } = await db.from("offers").delete().eq("id", id);
  return error ? done(P, "Could not delete.", false) : done(P, "Offer deleted.");
}
// ---------- testimonials ----------
export async function saveTestimonial(fd: FormData) {
  const P = "/admin/testimonials", db = await begin(P);
  const id = s(fd, "id"), quote = s(fd, "quote", 600), author = s(fd, "author", 100);
  if (quote.length < 10 || !author) return done(P, "Enter the testimonial text and the customer's name.", false);
  const row = { quote, author, role: s(fd, "role", 100) || null };
  const { error } = id && isId(id) ? await db.from("testimonials").update(row).eq("id", id) : await db.from("testimonials").insert(row);
  return error ? done(P, "Could not save. Have you run supabase/phase5.sql?", false) : done(P, "Testimonial saved.");
}
export async function deleteTestimonial(fd: FormData) {
  const P = "/admin/testimonials", db = await begin(P), id = s(fd, "id");
  if (!isId(id)) return done(P, "Invalid request.", false);
  const { error } = await db.from("testimonials").delete().eq("id", id);
  return error ? done(P, "Could not delete.", false) : done(P, "Testimonial deleted.");
}
// ---------- site content ----------
export async function saveContent(fd: FormData) {
  const P = "/admin/content", db = await begin(P);
  const email = s(fd, "email", 200), whatsapp = s(fd, "whatsapp", 30).replace(/\D/g, "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return done(P, "Enter a valid email address.", false);
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) return done(P, "WhatsApp number must be 8 to 15 digits with country code, e.g. 923001234567.", false);
  const { data: cur } = await db.from("site_content").select("value").eq("key", "main").maybeSingle();
  const old = (cur?.value ?? {}) as Record<string, string>;
  const value: Record<string, string> = { announcement: s(fd, "announcement", 200), overview: s(fd, "overview", 1500), mission: s(fd, "mission", 600), vision: s(fd, "vision", 600), phone: s(fd, "phone", 40), phone2: s(fd, "phone2", 40), email, whatsapp, hours: s(fd, "hours", 300) };
  const op = parseInt(s(fd, "hero_opacity", 3), 10);
  value.heroOpacity = String(Number.isNaN(op) ? 45 : Math.min(100, Math.max(0, op)));
  for (const [field, input] of [["heroImage", "hero_image"], ["aboutImage", "about_image"], ["shopImage", "shop_image"]] as const) {
    const up = await upload(db, fd.get(input), "site", IMG);
    if (up && "error" in up) return done(P, up.error, false);
    value[field] = up ? up.url : fd.get(`remove_${input}`) ? "" : old[field] ?? "";
  }
  const { error } = await db.from("site_content").upsert({ key: "main", value, updated_at: new Date().toISOString() });
  return error ? done(P, "Could not save.", false) : done(P, "Website content saved.");
}
