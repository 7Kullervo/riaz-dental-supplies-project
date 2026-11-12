"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { login, requestReset, updatePassword } from "@/app/admin/actions";

const inp = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm font-normal";
function useAction(fn: (fd: FormData) => Promise<{ ok: true } | { ok: false; error: string }>, onOk: () => void) {
  const [error, setError] = useState(""); const [pending, start] = useTransition();
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError("");
    const fd = new FormData(e.currentTarget);
    start(async () => { const r = await fn(fd); if (r.ok) onOk(); else setError(r.error); });
  };
  return { error, pending, submit };
}
const Err = ({ m }: { m: string }) => (m ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{m}</p> : null);

export function LoginForm() {
  const router = useRouter();
  const { error, pending, submit } = useAction(login, () => { router.push("/admin"); router.refresh(); });
  return (
    <form onSubmit={submit} className="space-y-4">
      <Err m={error} />
      <label className="block text-sm font-semibold">Email<input name="email" type="email" autoComplete="username" required className={inp} /></label>
      <label className="block text-sm font-semibold">Password<input name="password" type="password" autoComplete="current-password" required className={inp} /></label>
      <div className="text-right text-sm"><Link href="/admin/forgot-password" className="font-semibold text-brand hover:underline">Forgot password?</Link></div>
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
export function ForgotForm() {
  const [sent, setSent] = useState(false);
  const { error, pending, submit } = useAction(requestReset, () => setSent(true));
  if (sent) return <p role="status" className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">If that email belongs to an administrator, a password reset link has been sent. Check your inbox (and spam folder). The link expires after a short time.</p>;
  return (
    <form onSubmit={submit} className="space-y-4">
      <Err m={error} />
      <label className="block text-sm font-semibold">Admin email<input name="email" type="email" autoComplete="username" required className={inp} /></label>
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Sending…" : "Send reset link"}</button>
    </form>
  );
}
export function ResetForm() {
  const router = useRouter();
  const { error, pending, submit } = useAction(updatePassword, () => { router.push("/admin"); router.refresh(); });
  return (
    <form onSubmit={submit} className="space-y-4">
      <Err m={error} />
      <label className="block text-sm font-semibold">New password (10+ characters)<input name="password" type="password" autoComplete="new-password" minLength={10} required className={inp} /></label>
      <label className="block text-sm font-semibold">Confirm new password<input name="confirm" type="password" autoComplete="new-password" minLength={10} required className={inp} /></label>
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Saving…" : "Set new password"}</button>
    </form>
  );
}
