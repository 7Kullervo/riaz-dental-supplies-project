import { requireAdmin } from "@/lib/supabase-auth";
import { getAdmin } from "@/lib/supabase-server";
import { getSiteContent } from "@/lib/content";
import { saveContent } from "../../content-actions";
import OpacitySlider from "@/components/OpacitySlider";
import { Flash, NoDb, Lbl, inp, card, type SP } from "@/components/AdminUI";

export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: SP }) {
  await requireAdmin();
  if (!getAdmin()) return <NoDb />;
  const c = await getSiteContent();
  return (
    <>
      <h1 className="text-3xl font-extrabold">Website content</h1>
      <div className="mt-5"><Flash sp={searchParams} /></div>
      <form action={saveContent} className={`${card} max-w-2xl space-y-4`}>
        <Lbl t="Announcement bar"><input name="announcement" defaultValue={c.announcement} className={inp} /></Lbl>
        <h2 className="pt-2 text-lg font-bold">Homepage photos</h2>
        <p className="text-xs text-muted">JPG, PNG or WebP, max 4 MB each. Until a photo is added, a labelled placeholder shows.</p>
        {([["hero_image", "Hero photo (top of the homepage)", c.heroImage], ["about_image", "About photo (homepage and About Us page)", c.aboutImage], ["shop_image", "Shop photo (Visit Our Shop section)", c.shopImage]] as const).map(([n, l, v]) => (
          <div key={n}><div className="space-y-1"><Lbl t={l}>{v && <img src={v} alt="" className="mt-1 h-24 rounded-lg object-cover" />}<input name={n} type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block text-sm" /></Lbl>
            {v && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name={`remove_${n}`} />Remove current photo</label>}</div>{n === "hero_image" && <OpacitySlider defaultValue={Number(c.heroOpacity)} image={c.heroImage} />}</div>))}
        <h2 className="pt-2 text-lg font-bold">About Us</h2>
        <Lbl t="Company overview"><textarea name="overview" rows={4} defaultValue={c.overview} className={inp} /></Lbl>
        <Lbl t="Mission"><textarea name="mission" rows={2} defaultValue={c.mission} className={inp} /></Lbl>
        <Lbl t="Vision"><textarea name="vision" rows={2} defaultValue={c.vision} className={inp} /></Lbl>
        <h2 className="pt-2 text-lg font-bold">Contact information</h2>
        <Lbl t="Phone"><input name="phone" defaultValue={c.phone} className={inp} /></Lbl>
        <Lbl t="Second phone number" hint="Optional. Leave empty to show only one number."><input name="phone2" defaultValue={c.phone2} className={inp} /></Lbl>
        <Lbl t="Email"><input name="email" type="email" defaultValue={c.email} className={inp} /></Lbl>
        <Lbl t="WhatsApp number" hint="Digits only with country code, e.g. 923001234567. The WhatsApp button appears once this is set."><input name="whatsapp" defaultValue={c.whatsapp} className={inp} /></Lbl>
        <Lbl t="Business hours"><textarea name="hours" rows={2} defaultValue={c.hours} className={inp} /></Lbl>
        <button className="btn-primary">Save content</button>
      </form>
    </>
  );
}
