import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist px-4 text-center">
      <p className="text-sm font-semibold tracking-widest text-brand">ERROR 404</p>
      <h1 className="mt-2 text-4xl font-extrabold">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">The page you are looking for does not exist or has moved.</p>
      <div className="mt-6 flex gap-3"><Link href="/" className="btn-primary">Back to Home</Link><Link href="/products" className="btn-outline">Browse Products</Link></div>
    </div>
  );
}
