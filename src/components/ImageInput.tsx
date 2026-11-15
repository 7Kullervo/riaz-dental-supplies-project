"use client";
import { useState } from "react";

// Lets the admin pick large photos: each one is shrunk in the browser before it is uploaded.
// (The server can only take about 4 MB per request on Vercel, so big originals would otherwise fail.)
const MAX_IN = 20 * 1024 * 1024, MAX_EDGE = 1600, TARGET = 700 * 1024, MAX_TOTAL = 4.2 * 1024 * 1024;

async function shrink(file: File): Promise<File> {
  if (file.size > MAX_IN) throw new Error(`"${file.name}" is larger than 20 MB.`);
  if (typeof createImageBitmap !== "function") return file;
  let bmp: ImageBitmap;
  try { bmp = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { throw new Error(`"${file.name}" could not be read as a photo. Please use JPG, PNG or WebP.`); }
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size <= TARGET && ["image/jpeg", "image/png", "image/webp"].includes(file.type)) { bmp.close(); return file; }
  const w = Math.max(1, Math.round(bmp.width * scale)), h = Math.max(1, Math.round(bmp.height * scale));
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d"); if (!ctx) { bmp.close(); return file; }
  const toBlob = (type: string, q?: number) => new Promise<Blob | null>((r) => c.toBlob(r, type, q));
  const base = file.name.replace(/\.[^.]+$/, "") || "photo";
  if (file.type === "image/png") { // keep transparency (logos) when the result is a sensible size
    ctx.drawImage(bmp, 0, 0, w, h);
    const png = await toBlob("image/png");
    if (png && png.size <= 2 * 1024 * 1024) { bmp.close(); return new File([png], `${base}.png`, { type: "image/png" }); }
  }
  ctx.clearRect(0, 0, w, h); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h); ctx.drawImage(bmp, 0, 0, w, h); bmp.close();
  let blob: Blob | null = null;
  for (const q of [0.82, 0.72, 0.62, 0.5]) { blob = await toBlob("image/jpeg", q); if (blob && blob.size <= TARGET) break; }
  if (!blob) throw new Error(`"${file.name}" could not be converted. Please try a JPG or PNG.`);
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

export default function ImageInput({ name, label, multiple = false }: { name: string; label: string; multiple?: boolean }) {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.currentTarget, files = Array.from(input.files ?? []);
    if (!files.length) { setMsg(null); return; }
    setMsg({ ok: true, text: files.length > 1 ? "Preparing photos…" : "Preparing photo…" });
    input.setCustomValidity("Please wait a moment: your photos are still being prepared."); // blocks Save until done
    try {
      const out: File[] = [];
      for (const f of files) out.push(await shrink(f));
      const total = out.reduce((n, f) => n + f.size, 0);
      if (total > MAX_TOTAL) throw new Error("These photos add up to more than the 4 MB upload limit. Please pick fewer photos at a time.");
      const dt = new DataTransfer(); out.forEach((f) => dt.items.add(f)); input.files = dt.files;
      setMsg({ ok: true, text: `${out.length} photo${out.length > 1 ? "s" : ""} ready (${(total / 1024 / 1024).toFixed(1)} MB in total).` });
    } catch (err) {
      input.value = ""; setMsg({ ok: false, text: err instanceof Error ? err.message : "Could not prepare the photo." });
    } finally { input.setCustomValidity(""); }
  }
  return (
    <div>
      <input name={name} type="file" multiple={multiple} accept="image/*" aria-label={label} onChange={onChange} className="mt-1 block text-sm font-normal" />
      {msg && <p role="status" className={`mt-1 text-xs font-normal ${msg.ok ? "text-muted" : "text-red-700"}`}>{msg.text}</p>}
    </div>
  );
}
