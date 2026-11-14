import type { Metadata } from "next";
import { getProducts, getCategories, usingDemo } from "@/lib/content";
import { DemoBadge } from "@/components/ui";
import { site } from "@/lib/site";
import PriceListClient from "./PriceListClient";

export const metadata: Metadata = { title: "Price List", description: "Price list of dental equipment and supplies from Riaz Dental Supplies, Rawalpindi. Request a quote for items without a listed price." };
export const revalidate = 60;

export default async function PriceListPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <section className="py-12"><div className="container-x">
      <h1 className="text-4xl font-extrabold">Price List</h1>
      <p className="mt-2 max-w-3xl text-muted">Prices are in Pakistani Rupees (PKR) and may change without notice. Please confirm the current price and availability with the shop before ordering. Items without a listed price are available on request. {usingDemo() && <DemoBadge>Demonstration data: no real prices</DemoBadge>}</p>
      <p className="mt-3 hidden text-sm print:block">{site.name}, {site.address.join(" ")}</p>
      <div className="mt-8"><PriceListClient products={products} categories={categories} /></div>
    </div></section>
  );
}
