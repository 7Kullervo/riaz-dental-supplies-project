"use client";
import { useState } from "react";

// Admin slider with a live preview, so the effect is visible before saving.
// variant "hero": photo over navy with white text. variant "section": photo behind light sections.
export default function OpacitySlider({ name, defaultValue, image, variant = "hero", label }: { name: string; defaultValue: number; image: string; variant?: "hero" | "section"; label?: string }) {
  const [v, setV] = useState(Number.isNaN(defaultValue) ? 45 : Math.min(100, Math.max(0, defaultValue)));
  const hero = variant === "hero";
  return (
    <div className="space-y-2 rounded-lg border border-line bg-mist p-4">
      <label className="block text-sm font-semibold">
        {label ?? "Photo opacity"}: <output className="text-brand">{v}%</output>
        <input type="range" name={name} min={0} max={100} step={5} value={v} onChange={(e) => setV(Number(e.target.value))} className="mt-2 w-full" />
      </label>
      <p className="text-xs text-muted">{hero ? "Higher shows more of the photo. Lower makes it darker and softer, so the white text is easier to read." : "Higher shows more of the photo. Lower makes it paler and softer, so the text stays easy to read."}</p>
      <div className={`relative isolate h-28 overflow-hidden rounded-lg text-center ${hero ? "bg-navy" : "bg-white"}`} aria-hidden>
        {image && hero && /* eslint-disable-next-line @next/next/no-img-element */ <img src={image} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ opacity: v / 100 }} />}
        {image && !hero && <><div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${JSON.stringify(image)})` }} /><div className="absolute inset-0 -z-10 bg-white" style={{ opacity: 1 - v / 100 }} /></>}
        {hero
          ? <><p className="pt-7 text-xl font-extrabold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">Riaz Dental Supplies</p><p className="text-xs font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">{image ? "Preview (saved photo)" : "Preview: add a photo above, then save"}</p></>
          : <><p className="pt-7 text-lg font-extrabold text-navy">Explore Our Product Categories</p><p className="text-xs font-semibold text-muted">{image ? "Preview (saved photo)" : "Preview: add a photo above, then save"}</p></>}
      </div>
    </div>
  );
}
