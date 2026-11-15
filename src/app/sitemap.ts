import type { MetadataRoute } from "next";
import { baseUrl } from "@/lib/url";
import { getProducts, usingDemo } from "@/lib/content";
import { policies } from "@/lib/legal";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const b = baseUrl(), now = new Date();
  const pages = ["", "/about", "/products", "/brands", "/offers", "/contact", "/request-quote"].map((p) => ({ url: b + p, lastModified: now }));
  const legal = policies.map((p) => ({ url: `${b}/${p.slug}`, lastModified: now }));
  const prods = usingDemo() ? [] : (await getProducts()).map((p) => ({ url: `${b}/products/${p.slug}`, lastModified: now }));
  return [...pages, ...prods, ...legal];
}
