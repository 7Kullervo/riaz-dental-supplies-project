"use client";
export default function ConfirmSubmit({ label = "Delete", message = "Delete this item? This cannot be undone." }: { label?: string; message?: string }) {
  return <button type="submit" onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }} className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">{label}</button>;
}
