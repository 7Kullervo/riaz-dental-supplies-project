import { site } from "@/lib/site";
export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.mapsQuery)}`;
export default function ShopMap({ className = "h-72" }: { className?: string }) {
  return (
    <iframe title="Riaz Dental Supplies location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
      className={`w-full rounded-card border border-line ${className}`}
      src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`} />
  );
}
