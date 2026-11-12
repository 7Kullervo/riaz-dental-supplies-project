import Link from "next/link";
export default function AuthCard({ title, text, children }: { title: string; text?: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-card border border-line bg-white p-8 shadow-card">
        <p className="font-heading text-lg font-extrabold text-navy">Riaz <span className="text-brand">Dental</span> Supplies</p>
        <h1 className="mt-4 text-2xl font-extrabold">{title}</h1>
        {text && <p className="mb-5 mt-1 text-sm text-muted">{text}</p>}
        <div className="mt-5">{children}</div>
        <p className="mt-6 text-center text-xs"><Link href="/" className="text-muted hover:text-brand">← Back to website</Link></p>
      </div>
    </div>
  );
}
