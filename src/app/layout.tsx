import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/site";
import { baseUrl } from "@/lib/url";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl()),
  alternates: { canonical: "./" },
  openGraph: { siteName: site.name, locale: "en_PK", type: "website" },
  title: { default: `${site.name} | Dental Equipment & Supplies in Rawalpindi`, template: `%s | ${site.name}` },
  description: "Dental equipment, instruments and supplies for dental professionals in Rawalpindi and Islamabad. Request a quote today.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
