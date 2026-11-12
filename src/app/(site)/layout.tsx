import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCategories, getSiteContent } from "@/lib/content";

export const revalidate = 60;
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [cats, sc] = await Promise.all([getCategories(), getSiteContent()]);
  return (<><a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:p-3">Skip to main content</a><Header categories={cats} announcement={sc.announcement} /><main id="main">{children}</main><Footer c={sc} /><WhatsAppButton number={sc.whatsapp} /></>);
}
