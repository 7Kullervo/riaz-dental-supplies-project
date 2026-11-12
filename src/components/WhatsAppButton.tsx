"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

// Floating button, bottom-right on every public page. Rendered only when a WhatsApp number is saved
// (admin > Website content), so it is never a dead button.
// On a product page the chat message includes that product's page link.
export default function WhatsAppButton({ number }: { number: string }) {
  const pathname = usePathname();
  const [origin, setOrigin] = useState("");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  if (!number) return null;

  const onProduct = /^\/products\/[^/]+$/.test(pathname);
  const text = onProduct && origin
    ? `Hello Riaz Dental Supplies, I would like to enquire about this product: ${origin}${pathname}`
    : "Hello Riaz Dental Supplies, I would like to enquire about...";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with Riaz Dental Supplies on WhatsApp"
      style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))", right: "calc(1rem + env(safe-area-inset-right, 0px))" }}
      className="fixed z-40 flex h-14 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lg transition hover:scale-105 hover:bg-[#1ebe5b] sm:px-5">
      <MessageCircle size={26} aria-hidden /><span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
