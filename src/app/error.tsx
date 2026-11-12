"use client";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-mist px-4 text-center">
      <h1 className="text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-muted">Please try again. If the problem continues, contact the shop directly.</p>
      <button onClick={reset} className="btn-primary mt-6">Try again</button>
    </div>
  );
}
