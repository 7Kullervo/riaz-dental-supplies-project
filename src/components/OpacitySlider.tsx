"use client";
import { useState } from "react";

// Admin control for the hero photo opacity, with a live preview so the effect is visible before saving.
export default function OpacitySlider({ defaultValue, image }: { defaultValue: number; image: string }) {
  const [v, setV] = useState(Number.isNaN(defaultValue) ? 45 : Math.min(100, Math.max(0, defaultValue)));
  return (
    <div className="space-y-2 rounded-lg border border-line bg-mist p-4">
      <label className="block text-sm font-semibold">
        Hero photo opacity: <output className="text-brand">{v}%</output>
        <input type="range" name="hero_opacity" min={0} max={100} step={5} value={v} onChange={(e) => setV(Number(e.target.value))} className="mt-2 w-full" />
      </label>
      <p className="text-xs text-muted">Higher shows more of the photo. Lower makes it darker and softer, so the white text is easier to read. Works with any photo.</p>
      <div className="relative isolate h-28 overflow-hidden rounded-lg bg-navy text-center" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {image && <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ opacity: v / 100 }} />}
        <p className="pt-7 text-xl font-extrabold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">Riaz Dental Supplies</p>
        <p className="text-xs font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">{image ? "Preview (saved photo)" : "Preview: add a photo above, then save"}</p>
      </div>
    </div>
  );
}
