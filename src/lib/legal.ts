import { site } from "./site";
export const LEGAL_UPDATED = "11 November 2026";
export type Policy = { slug: string; title: string; description: string; sections: { h: string; p: string[] }[] };
const contact = `Riaz Dental Supplies, ${site.address.join(" ")} Email: ${site.email} [placeholder: owner to confirm]. Phone: ${site.phone}, ${site.phone2}.`;

export const policies: Policy[] = [
  { slug: "privacy-policy", title: "Privacy Policy", description: "How Riaz Dental Supplies collects, uses and protects your information.", sections: [
    { h: "1. Introduction", p: ["This policy explains how Riaz Dental Supplies (“we”, “us”) handles personal information collected through this website."] },
    { h: "2. Information we collect", p: ["We collect only the information you choose to give us: your name, email address, phone number, and the details of your message or product enquiry. We may also receive basic technical information such as your browser type when you visit the site."] },
    { h: "3. Contact form and enquiry information", p: ["When you use the Contact or Request a Quote forms, we store your details, the product you asked about, the quantity and any requirements you wrote, so that we can reply to you and keep a record of the enquiry."] },
    { h: "4. How we use your information", p: ["We use your information to respond to enquiries, prepare quotations, follow up on requests and manage our business records. We do not sell your personal information. [Owner: add any marketing use here, if applicable.]"] },
    { h: "5. Data storage and security", p: ["Enquiries are stored in a database hosted by our service provider with access restricted to authorised staff. No method of storage or transmission is completely secure, so we cannot guarantee absolute security. [Owner: confirm retention period for enquiries.]"] },
    { h: "6. Third-party services", p: ["We use third-party services to run this website, including hosting, database and map providers (for example Vercel, Supabase and Google Maps). These providers may process data on our behalf under their own terms and privacy policies."] },
    { h: "7. Cookies and analytics", p: ["See our Cookie Policy for details of the cookies used on this website."] },
    { h: "8. Your privacy rights", p: ["You may ask us to tell you what personal information we hold about you, to correct it, or to delete it, subject to any legal obligations to keep records. To make a request, contact us using the details below. [Owner: confirm how requests are handled and any applicable data protection requirements.]"] },
    { h: "9. Contact us", p: [contact] },
  ] },
  { slug: "terms-of-use", title: "Terms of Use", description: "Terms for using the Riaz Dental Supplies website.", sections: [
    { h: "1. Website usage", p: ["By using this website you agree to these terms. If you do not agree, please do not use the site."] },
    { h: "2. Intellectual property", p: ["The content of this website, including text, design, logos and images, belongs to Riaz Dental Supplies or its licensors. Brand names and logos belong to their respective owners. You may not copy or reuse content without permission."] },
    { h: "3. Acceptable use", p: ["You agree not to misuse the website, attempt to gain unauthorised access, submit false or harmful content, send spam through our forms, or interfere with the site’s operation."] },
    { h: "4. Product information", p: ["We try to keep product information accurate, but descriptions, images and availability may change and may contain errors. Please confirm details with us before relying on them."] },
    { h: "5. External links", p: ["This website may link to external sites. We do not control them and are not responsible for their content."] },
    { h: "6. Website availability", p: ["We do not guarantee that the website will always be available or error-free, and we may change or suspend it at any time."] },
    { h: "7. Limitation of liability", p: ["To the extent permitted by law, Riaz Dental Supplies is not liable for losses arising from your use of, or inability to use, this website."] },
    { h: "8. Contact", p: [contact] },
  ] },
  { slug: "terms-and-conditions", title: "Terms & Conditions", description: "Terms that apply to enquiries, quotations and purchases from Riaz Dental Supplies.", sections: [
    { h: "1. Product descriptions", p: ["We aim to describe products accurately, but images are illustrative and manufacturers may change specifications without notice."] },
    { h: "2. Product availability", p: ["Availability shown on the website is indicative. Items may be unavailable or available only on request. We will confirm availability in our reply to your enquiry."] },
    { h: "3. Pricing", p: ["Prices, where shown, are in Pakistani Rupees (PKR) and may change without notice. Where no price is shown, please request a quote. [Owner: confirm whether prices include taxes.]"] },
    { h: "4. Quotations", p: ["A quotation is an offer valid for the period stated in it. [Owner: set a default validity period, for example X days.] Submitting a quote request does not create a purchase contract."] },
    { h: "5. Order confirmation", p: ["An order is only confirmed when we confirm it to you in writing or in person. We may decline or cancel an order, for example if an item is unavailable or a price was shown in error."] },
    { h: "6. Payments", p: ["Accepted payment methods and payment timing will be stated in the quotation or order confirmation. [Owner: list accepted payment methods and any advance payment requirements.]"] },
    { h: "7. Customer responsibilities", p: ["You are responsible for giving accurate details, for confirming that a product suits your clinical or professional needs, and for any licences or approvals needed to buy or use the product."] },
    { h: "8. Disputes", p: ["We encourage you to contact us first so we can try to resolve any problem. Disputes are governed by the applicable laws of Pakistan. [Owner: confirm jurisdiction and dispute process.]"] },
    { h: "9. Contact", p: [contact] },
  ] },
  { slug: "disclaimer", title: "Disclaimer", description: "Important limits on the information provided on this website.", sections: [
    { h: "1. General website information", p: ["The information on this website is provided for general purposes only and does not constitute professional advice."] },
    { h: "2. Product specifications", p: ["Specifications are taken from information available to us and may be incomplete or change. Always check the manufacturer’s instructions and confirm specifications with us before purchase."] },
    { h: "3. Manufacturer information", p: ["Brand and manufacturer names are shown to identify products. Their appearance on this site does not mean we are an authorised distributor or partner of that manufacturer unless we state so explicitly. [Owner: add confirmed partnerships only.]"] },
    { h: "4. Medical and professional responsibility", p: ["Dental equipment and materials must be selected and used by qualified professionals. Choosing and using a product, and any clinical outcome, is the responsibility of the professional. Nothing here is medical advice."] },
    { h: "5. External websites", p: ["We are not responsible for the content or accuracy of external websites linked from this site."] },
    { h: "6. Limitation of liability", p: ["To the extent permitted by law, we are not liable for loss or damage resulting from reliance on information on this website."] },
  ] },
  { slug: "shipping-delivery-policy", title: "Shipping & Delivery Policy", description: "Delivery information for orders from Riaz Dental Supplies.", sections: [
    { h: "1. Delivery availability", p: ["[Owner: state the areas you deliver to, for example Rawalpindi, Islamabad and nationwide, or whether orders are collected from the shop.] Products can be collected from our shop at the address below."] },
    { h: "2. Shipping methods", p: ["[Owner: list courier services or own delivery used.]"] },
    { h: "3. Delivery timelines", p: ["Delivery times depend on the product, its availability and the destination. We will give an estimated time when confirming your order. Estimates are not guarantees."] },
    { h: "4. Shipping charges", p: ["[Owner: state how delivery charges are calculated.] Any delivery charge will be confirmed to you before you pay."] },
    { h: "5. Delays", p: ["Delays can occur due to stock, courier or circumstances beyond our control. We will inform you of significant delays as soon as we can."] },
    { h: "6. Damaged shipments", p: ["Please check your delivery on receipt. If an item arrives damaged, contact us promptly with your order details and photographs so we can investigate. [Owner: state the reporting period, for example within X days.]"] },
    { h: "7. Contact", p: [contact] },
  ] },
  { slug: "return-refund-policy", title: "Return & Refund Policy", description: "How returns and refunds are handled at Riaz Dental Supplies.", sections: [
    { h: "1. Return eligibility", p: ["[Owner: state the return period and conditions, for example unused items in original packaging.] Please contact us before sending anything back."] },
    { h: "2. Damaged or defective products", p: ["If a product arrives damaged, defective or different from what you ordered, contact us promptly. We will review the issue and, where appropriate, offer a replacement, repair or refund. Warranty terms may also apply through the manufacturer. [Owner: confirm warranty handling.]"] },
    { h: "3. Return requests", p: ["To request a return, contact us with your order details and the reason. We will tell you whether the return is accepted and how to send the item back."] },
    { h: "4. Refund processing", p: ["Approved refunds are made using the original payment method or another method agreed with you. [Owner: state the typical processing time.]"] },
    { h: "5. Non-returnable products", p: ["Some items may not be returnable for hygiene, safety or regulatory reasons, such as opened sterile or consumable items, and special-order or custom items. [Owner: confirm the list.]"] },
    { h: "6. Contact procedure", p: [contact] },
  ] },
  { slug: "cookie-policy", title: "Cookie Policy", description: "How cookies are used on the Riaz Dental Supplies website.", sections: [
    { h: "1. What cookies are", p: ["Cookies are small text files stored on your device by websites. They help sites work and can remember your preferences."] },
    { h: "2. Essential cookies", p: ["Essential cookies are needed for the site to work, such as keeping the website administrator signed in. They cannot be switched off in our systems."] },
    { h: "3. Analytics cookies", p: ["This website does not currently set analytics cookies. [Owner: if analytics are added later, update this section and obtain consent where required.]"] },
    { h: "4. Functional cookies", p: ["We do not currently use functional cookies for visitors. Embedded services such as Google Maps may set their own cookies when the map loads."] },
    { h: "5. Managing cookies", p: ["You can block or delete cookies in your browser settings. Blocking essential cookies may stop some features from working."] },
  ] },
];
