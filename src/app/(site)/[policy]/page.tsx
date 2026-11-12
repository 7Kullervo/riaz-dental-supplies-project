import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { policies, LEGAL_UPDATED } from "@/lib/legal";

export const dynamicParams = false;
export const generateStaticParams = () => policies.map((p) => ({ policy: p.slug }));
export function generateMetadata({ params }: { params: { policy: string } }): Metadata {
  const p = policies.find((x) => x.slug === params.policy);
  return { title: p?.title ?? "Not found", description: p?.description };
}
// Highlights [bracketed placeholders] so the owner can find what to complete.
const render = (t: string) => t.split(/(\[[^\]]+\])/).map((s, i) => /^\[.*\]$/.test(s) ? <mark key={i} className="rounded bg-amber-100 px-1 text-amber-900">{s}</mark> : s);

export default function PolicyPage({ params }: { params: { policy: string } }) {
  const p = policies.find((x) => x.slug === params.policy);
  if (!p) notFound();
  return (
    <section className="py-14"><div className="container-x max-w-3xl">
      <h1 className="text-4xl font-extrabold">{p.title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated: {LEGAL_UPDATED}</p>
      <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Draft for owner review. This document is general information, not legal advice, and does not guarantee compliance with Pakistani law. The business owner should review it (ideally with a qualified lawyer) and complete the highlighted placeholders before publication.</p>
      <div className="mt-8 space-y-7">{p.sections.map((s) => (
        <div key={s.h}><h2 className="text-xl font-bold">{s.h}</h2>{s.p.map((t) => <p key={t} className="mt-2 text-muted">{render(t)}</p>)}</div>))}</div>
    </div></section>
  );
}
