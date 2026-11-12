// Pure validation shared by the browser (instant feedback) and the server (the real check).
export type Kind = "contact" | "quote";
export type Fields = Record<string, string>;
export const FIELD_NAMES = ["name", "email", "phone", "subject", "message", "product", "quantity", "requirements"] as const;

export function validate(kind: Kind, f: Fields): Record<string, string> {
  const e: Record<string, string> = {};
  if ((f.name ?? "").trim().length < 2) e.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email ?? "")) e.email = "Please enter a valid email address.";
  if (!/^\+?[\d\s-]{7,20}$/.test(f.phone ?? "")) e.phone = "Please enter a valid phone number.";
  if (kind === "contact") {
    if ((f.subject ?? "").trim().length < 3) e.subject = "Please enter a subject.";
    if ((f.message ?? "").trim().length < 10) e.message = "Please write a message of at least 10 characters.";
  } else {
    const q = Number(f.quantity);
    if (!Number.isInteger(q) || q < 1 || q > 100000) e.quantity = "Please enter a quantity of 1 or more.";
    if (!f.product && (f.requirements ?? "").trim().length < 10) e.requirements = "Select a product or describe what you need.";
  }
  for (const k of ["name", "email", "subject", "product"]) if ((f[k] ?? "").length > 200) e[k] = "Too long.";
  for (const k of ["message", "requirements"]) if ((f[k] ?? "").length > 3000) e[k] = "Too long (3000 characters maximum).";
  return e;
}
