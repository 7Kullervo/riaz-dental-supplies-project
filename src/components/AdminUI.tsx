import ConfirmSubmit from "./ConfirmSubmit";
export const inp = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm font-normal";
export const card = "rounded-card border border-line bg-white p-6 shadow-card";
export type SP = { saved?: string; error?: string; edit?: string };

export function Flash({ sp }: { sp: SP }) {
  if (sp.saved) return <p role="status" className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{sp.saved}</p>;
  if (sp.error) return <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{sp.error}</p>;
  return null;
}
export function NoDb() {
  return <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Database not connected: add the Supabase keys to .env.local and run supabase/phase4b.sql.</p>;
}
export function Lbl({ t, hint, children }: { t: string; hint?: string; children: React.ReactNode }) {
  return <label className="block text-sm font-semibold">{t}{children}{hint && <span className="mt-1 block text-xs font-normal text-muted">{hint}</span>}</label>;
}
export function DeleteForm({ action, id }: { action: (fd: FormData) => Promise<void>; id: string }) {
  return <form action={action}><input type="hidden" name="id" value={id} /><ConfirmSubmit /></form>;
}
