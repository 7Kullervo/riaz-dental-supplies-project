import type { Metadata } from "next";
import { Suspense } from "react";
import ProductsClient from "./ProductsClient";
import { DemoBadge } from "@/components/ui";
import { getProducts, getBrands, getCategories, usingDemo } from "@/lib/content";

export const metadata: Metadata = { title: "Products", description: "Browse dental equipment, instruments and supplies from Riaz Dental Supplies, Rawalpindi." };
export const revalidate = 60;

export default async function ProductsPage() {
  const [products, brands, categories] = await Promise.all([getProducts(), getBrands(), getCategories()]);
  return (
    <section className="py-12"><div className="container-x">
      <h1 className="text-4xl font-extrabold">Products</h1>
      <p className="mb-8 mt-2 text-muted">Browse our catalogue and request a quote for anything you need. {usingDemo() && <DemoBadge>Products shown are demonstration data</DemoBadge>}</p>
      <Suspense fallback={<p className="text-muted">Loading products…</p>}><ProductsClient products={products} brands={brands} categories={categories} /></Suspense>
    </div></section>
  );
}
