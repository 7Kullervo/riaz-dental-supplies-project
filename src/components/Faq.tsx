import { site } from "@/lib/site";
const faqs: [string, string][] = [
  ["What types of dental equipment do you offer?", "We list equipment, instruments and supplies across the product categories on this site. Availability can change, so please enquire about the item you need."],
  ["How can I request a quotation?", "Use the Request a Quote button on any product page or the Request a Quote page, and send us the details of what you need."],
  ["Can I enquire about product availability?", "Yes. Send an enquiry through the quote form or contact page and we will respond with availability."],
  ["Where is your shop located?", `${site.address.join(" ")}`],
  ["How can I contact Riaz Dental Supplies?", "Use the Contact Us page, or visit the shop. Phone, email and WhatsApp details will be published here once confirmed by the owner."],
  ["Do you offer delivery?", "No. We do not offer delivery for now. Please enquire about collection options."],
  ["Can I request information about a particular brand?", "Yes. Mention the brand in your enquiry and we will let you know what we can offer."],
];
export default function Faq() {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-card border border-line bg-white">
      {faqs.map(([q, a]) => (
        <details key={q} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-navy">
            {q}<span className="ml-4 text-brand transition group-open:rotate-45" aria-hidden>+</span>
          </summary>
          <p className="mt-3 text-sm text-muted">{a}</p>
        </details>
      ))}
    </div>
  );
}
