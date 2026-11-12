import type { Metadata } from "next";
import { getProducts } from "@/lib/content";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata: Metadata = { title: "Request a Quote", description: "Request a quotation for dental equipment and supplies from Riaz Dental Supplies." };

export const dynamic = "force-dynamic";
export default async function QuotePage({ searchParams }: { searchParams: { product?: string } }) {
  const products = await getProducts();
  const def = products.some((p) => p.slug === searchParams.product) ? searchParams.product! : "";
  return (
    <section className="py-14"><div className="container-x max-w-2xl">
      <h1 className="text-4xl font-extrabold">Request a Quote</h1>
      <p className="mb-8 mt-2 text-muted">Tell us what you need and we will reply with a quotation. Prices and availability are confirmed in our reply.</p>
      <EnquiryForm kind="quote" products={products.map(({ slug, name }) => ({ slug, name }))} defaultProduct={def} />
    </div></section>
  );
}
