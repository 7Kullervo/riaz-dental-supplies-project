"use client";
import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

// Small "i" button that opens a tips bubble. Closes on outside click or Escape.
export default function InfoTip({ children, label = "Upload instructions" }: { children: React.ReactNode; label?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down); document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <span ref={ref} className="relative ml-1.5 inline-block align-middle">
      <button type="button" aria-label={label} aria-expanded={open} onClick={() => setOpen((o) => !o)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-brand text-brand transition hover:bg-brand hover:text-white"><Info size={12} aria-hidden /></button>
      {open && <span role="tooltip" className="absolute left-0 top-7 z-30 block w-72 max-w-[80vw] rounded-lg border border-line bg-white p-3 text-xs font-normal leading-relaxed text-ink shadow-card">{children}</span>}
    </span>
  );
}
