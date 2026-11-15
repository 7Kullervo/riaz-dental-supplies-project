import InfoTip from "./InfoTip";

// Title + "i" button + the upload control. (Not a <label>, so the "i" button never opens the file picker.)
export function UploadField({ title, tip, children }: { title: string; tip: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="text-sm font-semibold">
      <div className="flex items-center">{title}<InfoTip>{tip}</InfoTip></div>
      {children}
    </div>
  );
}
const List = ({ items }: { items: string[] }) => <ul className="list-disc space-y-1 pl-4">{items.map((i) => <li key={i}>{i}</li>)}</ul>;

export const tips = {
  image: <List items={[
    "Formats: JPG, PNG or WebP. Most phone and camera photos also work; they are converted automatically.",
    "Any size up to 20 MB: large photos are shrunk for you before uploading, so there is no need to resize them.",
    "Best results: a clear, well-lit photo at least 1000 px wide.",
  ]} />,
  productImages: <List items={[
    "Formats: JPG, PNG or WebP. Most phone and camera photos also work; they are converted automatically.",
    "Any size up to 20 MB each: large photos are shrunk for you before uploading.",
    "Up to 6 photos per product. The first one is the main photo.",
    "To pick several at once, hold Ctrl (or Shift) while clicking in the file window.",
    "Best results: clear, well-lit, square or landscape photos at least 1000 px wide.",
  ]} />,
  logo: <List items={[
    "Formats: JPG, PNG or WebP. A PNG with a transparent background looks best.",
    "Any size up to 20 MB: large files are shrunk for you automatically.",
    "Square or wide logos both work. Make sure the logo is clear and not cropped.",
  ]} />,
  brochure: <List items={[
    "PDF files only.",
    "Maximum 4 MB. PDFs cannot be shrunk automatically, so compress a large one first (for example with the free tool at ilovepdf.com).",
    "Customers see it as a Download Brochure button on the product page.",
  ]} />,
  hero: <List items={[
    "A wide, landscape photo works best, at least 1600 px wide.",
    "Formats: JPG, PNG or WebP. Any size up to 20 MB: large photos are shrunk for you.",
    "Use the slider below to make the photo stronger or softer. Lower it if the white text is hard to read.",
  ]} />,
  section: <List items={[
    "A large landscape photo, at least 1600 px wide. Soft, uncluttered photos work best.",
    "It shows behind the Product Categories, Featured Products and Your Partner in Dental Excellence sections.",
    "Formats: JPG, PNG or WebP. Any size up to 20 MB: large photos are shrunk for you.",
    "Use the slider below to make it stronger or softer. A low setting keeps the text easy to read.",
  ]} />,
  site: <List items={[
    "Formats: JPG, PNG or WebP. Any size up to 20 MB: large photos are shrunk for you automatically.",
    "Best results: a clear, well-lit landscape photo at least 1200 px wide.",
    "Until you add a photo, a labelled placeholder shows on the website.",
  ]} />,
};
