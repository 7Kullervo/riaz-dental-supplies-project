"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { navLinks } from "@/lib/site";

export default function Header({ categories, announcement }: { categories: { slug: string; name: string }[]; announcement: string }) {
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur">
      <div className="bg-navy py-2 text-center text-xs text-white">{announcement}</div>
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="font-heading text-lg font-extrabold text-navy">
          Riaz <span className="text-brand">Dental</span> Supplies
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((l) =>
            l.mega ? (
              <div key={l.href} className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
                <Link href={l.href} className="flex items-center gap-1 text-sm font-medium hover:text-brand">
                  {l.label} <ChevronDown size={14} />
                </Link>
                {mega && (
                  <div className="absolute left-1/2 top-full w-[520px] -translate-x-1/2 pt-3">
                    <div className="grid grid-cols-2 gap-1 rounded-card border border-line bg-white p-4 shadow-card">
                      {categories.map((c) => (
                        <Link key={c.slug} href={`/products?category=${c.slug}`} className="rounded-lg px-3 py-2 text-sm hover:bg-mist hover:text-brand">
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={l.href} href={l.href} className="text-sm font-medium hover:text-brand">{l.label}</Link>
            )
          )}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/request-quote" className="btn-primary hidden sm:inline-flex">REQUEST A QUOTE</Link>
          <button className="p-2 lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="max-h-[75vh] overflow-y-auto border-t border-line bg-white p-4 lg:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-medium hover:bg-mist">{l.label}</Link>
          ))}
          <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase text-muted">Product categories</p>
          {categories.map((c) => (
            <Link key={c.slug} href={`/products?category=${c.slug}`} onClick={() => setOpen(false)} className="block px-3 py-2 text-sm text-muted hover:text-brand">{c.name}</Link>
          ))}
          <Link href="/request-quote" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">REQUEST A QUOTE</Link>
        </nav>
      )}
    </header>
  );
}
