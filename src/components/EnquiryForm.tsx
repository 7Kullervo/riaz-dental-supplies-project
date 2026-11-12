"use client";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitContact, submitQuote } from "@/app/actions";
import { validate, FIELD_NAMES, type Kind } from "@/lib/validate";

type Opt = { slug: string; name: string };
const input = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm";

export default function EnquiryForm({ kind, products = [], defaultProduct = "" }: { kind: Kind; products?: Opt[]; defaultProduct?: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [ref, setRef] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const shownAt = useRef(0);
  useEffect(() => { shownAt.current = Date.now(); }, []);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const f: Record<string, string> = {};
    for (const k of FIELD_NAMES) f[k] = String(fd.get(k) ?? "");
    const errs = validate(kind, f);
    setErrors(errs); setFormError("");
    if (Object.keys(errs).length) return;
    fd.set("ts", String(shownAt.current));
    start(async () => {
      const res = await (kind === "quote" ? submitQuote(fd) : submitContact(fd));
      if (res.ok) setRef(res.ref);
      else { setErrors(res.fieldErrors ?? {}); setFormError(res.error ?? ""); }
    });
  }

  if (ref) {
    return (
      <div role="status" className="rounded-card border border-line bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto text-teal" size={44} aria-hidden />
        <h2 className="mt-4 text-2xl font-extrabold">{kind === "quote" ? "Quote request received" : "Message sent"}</h2>
        <p className="mt-2 text-muted">Thank you. We have received your {kind === "quote" ? "quotation request" : "message"} and will get back to you using the details you provided.</p>
        {ref !== "—" && <p className="mt-3 text-sm">Reference: <strong>{ref}</strong></p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/products" className="btn-primary">Browse Products</Link><Link href="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  const Field = ({ name, label, type = "text", autoComplete }: { name: string; label: string; type?: string; autoComplete?: string }) => (
    <label className="block text-sm font-semibold">{label} <span aria-hidden className="text-red-600">*</span>
      <input name={name} type={type} autoComplete={autoComplete} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} className={input + " font-normal"} />
      {errors[name] && <span id={`${name}-err`} className="mt-1 block text-xs font-normal text-red-600">{errors[name]}</span>}
    </label>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-card border border-line bg-white p-6 shadow-card">
      {formError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{formError}</p>}
      <Field name="name" label="Name" autoComplete="name" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="email" label="Email" type="email" autoComplete="email" />
        <Field name="phone" label="Phone number" type="tel" autoComplete="tel" />
      </div>
      {kind === "contact" ? (
        <>
          <Field name="subject" label="Subject" />
          <label className="block text-sm font-semibold">Message <span aria-hidden className="text-red-600">*</span>
            <textarea name="message" rows={5} required aria-invalid={!!errors.message} className={input + " font-normal"} />
            {errors.message && <span className="mt-1 block text-xs font-normal text-red-600">{errors.message}</span>}</label>
        </>
      ) : (
        <>
          <label className="block text-sm font-semibold">Product
            <select name="product" defaultValue={defaultProduct} className={input + " font-normal"}>
              <option value="">Not listed / general enquiry</option>
              {products.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Quantity <span aria-hidden className="text-red-600">*</span>
            <input name="quantity" type="number" min={1} defaultValue={1} required aria-invalid={!!errors.quantity} className={input + " font-normal"} />
            {errors.quantity && <span className="mt-1 block text-xs font-normal text-red-600">{errors.quantity}</span>}</label>
          <label className="block text-sm font-semibold">Additional requirements
            <textarea name="requirements" rows={4} aria-invalid={!!errors.requirements} className={input + " font-normal"} />
            {errors.requirements && <span className="mt-1 block text-xs font-normal text-red-600">{errors.requirements}</span>}</label>
        </>
      )}
      {/* Honeypot: hidden from people, bots tend to fill it in. */}
      <div aria-hidden className="absolute -left-[9999px]"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" disabled={pending} className="btn-primary w-full disabled:opacity-60">
        {pending ? <><Loader2 className="animate-spin" size={16} aria-hidden />Sending…</> : kind === "quote" ? "Submit Quote Request" : "Send Message"}
      </button>
    </form>
  );
}
