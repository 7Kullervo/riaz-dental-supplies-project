# Riaz Dental Supplies website

A complete website for Riaz Dental Supplies (Shop # F4, Ramzan Plaza, Bank Road, Saddar, Rawalpindi).
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide icons and Supabase (database, file storage, admin login).

**Includes:** Home, About, Products (search, filters, detail pages), Brands, Offers, Contact, Request a Quote, seven policy pages, and a protected admin dashboard (products, categories, brands, offers, testimonials, enquiries, website content and photos). SEO files (sitemap, robots, structured data) are included.

---
## 1. Run it on your computer
You need Node.js 18 or newer (nodejs.org, choose "LTS").
1. Open the project folder in VS Code, then open the terminal (Terminal > New Terminal).
2. `npm install` downloads the libraries listed in `package.json` (can take a minute).
3. Copy `.env.example` to a new file named `.env.local` and fill it in (section 2).
4. `npm run dev` starts the site. Open http://localhost:3000.
5. `npm run build` checks that everything compiles, the same check Vercel runs when you deploy.

Without Supabase the public site still runs and shows clearly labelled demonstration data. Forms refuse to submit and say so honestly.

## 2. Environment variables (`.env.local`)
| Variable | What it is | Secret? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase "anon public" key | No (used for admin login only) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase "service_role" key | **YES. Never share it or put it in code or GitHub** |
| `ADMIN_EMAILS` | Emails allowed into /admin (comma-separated) | No |
| `NEXT_PUBLIC_SITE_URL` | The website's public address, e.g. `https://www.yourdomain.com` (locally `http://localhost:3000`) | No |

`.env.local` is excluded from Git, so it is not uploaded to GitHub.

## 3. Database setup (Supabase free plan is enough to start)
1. Create a project at supabase.com. Pick a region close to Pakistan.
2. Project Settings > API: copy the Project URL, anon key and service_role key into `.env.local`.
3. Open **SQL Editor > New query**. Run these files **in order**, one at a time (paste the contents, press Run):
   1. `supabase/schema.sql` (enquiries)
   2. `supabase/phase4b.sql` (products, categories, brands, offers, site content, image storage bucket)
   3. `supabase/phase5.sql` (testimonials)
4. All tables are locked: only the website's server can read or write them, never a visitor's browser.

## 4. Admin setup
1. Supabase > Authentication > Users > **Add user**: enter the admin's email and a strong password, tick "Auto confirm".
2. Supabase > Authentication > Sign In / Providers > Email: turn **OFF** "Allow new users to sign up".
3. Put the admin email in `ADMIN_EMAILS`. Only listed emails can enter /admin, checked on the server for every page and action.
4. Supabase > Authentication > URL Configuration: set **Site URL** to your website address and add `http://localhost:3000/**` and `https://your-live-address/**` under **Redirect URLs**. "Forgot password?" needs this.
5. Sign in at `/admin/login`. **Forgot password?** emails a reset link to the admin address.
6. Before launch, set up custom email sending (Supabase > Authentication > Emails > SMTP Settings). The built-in sender is limited and for testing only, so reset emails may not arrive reliably without it.

## 5. First things to do in the admin
- **Website content:** phone, email, WhatsApp number (digits with country code, e.g. 923001234567), business hours, announcement, About text and the three homepage photos. The WhatsApp button appears once a number is saved.
- **Brands, Products, Offers:** add real ones only, with specifications supplied by the manufacturer or supplier.
- **Testimonials:** genuine feedback only, with the customer's permission.
- Anything you save shows on the public site straight away.

## 6. Deploy to Vercel
1. Put the project on GitHub (terminal: `git init`, `git add .`, `git commit -m "Riaz Dental Supplies"`, create an empty repository on github.com, then run the two commands GitHub shows: `git remote add origin ...` and `git push -u origin main`).
2. At vercel.com sign in with GitHub, click **Add New > Project**, pick the repository.
3. Under **Environment Variables** add all five variables from section 2 (set `NEXT_PUBLIC_SITE_URL` to the `.vercel.app` address Vercel gives you at first, then change it when you connect a domain).
4. Click **Deploy**. Then update the Supabase Redirect URLs (section 4, step 4) to the live address.
5. Optional: Vercel > Settings > Domains to connect your own domain, then update `NEXT_PUBLIC_SITE_URL` and the Supabase URLs and redeploy.
6. Submit `https://your-address/sitemap.xml` in Google Search Console.

## 7. Launch checklist
- [ ] Replace placeholder phone, email, hours and WhatsApp (admin > Website content).
- [ ] Update contact lines in the policy pages (they read the placeholders in `src/lib/site.ts`; edit there or in `src/lib/legal.ts`).
- [ ] Have a qualified lawyer review the policy pages and complete every yellow-highlighted placeholder in `src/lib/legal.ts`. They are drafts, not legal advice, and do not guarantee compliance with Pakistani law.
- [ ] Upload the homepage photos, brand logos and product photos.
- [ ] Add social media links in `src/components/Footer.tsx` and the Contact page once accounts exist.
- [ ] Send a test Contact message and a test quote; check them in admin > Enquiries.
- [ ] Test "Forgot password?" end to end.
- [ ] List only brands you have confirmed. Listing a brand never claims an authorized partnership.

## 8. Where things are
- `src/lib/site.ts`: business name, address, default contact placeholders, navigation.
- `src/lib/legal.ts`: all policy text.
- `src/lib/content.ts`: reads website data from Supabase (demo data if Supabase is not connected).
- `src/app/(site)`: public pages. `src/app/admin`: admin area. `supabase/`: database scripts.

## 9. Notes and limits
- Uploads: 4 MB each (Vercel limits request size). Images JPG/PNG/WebP, brochures PDF.
- No analytics or tracking cookies are used. If you add analytics later, update the Cookie Policy and consider consent.
- Structured data: the home page describes the business (name, address, and phone/email only if real). Product pages add Product data only for real products, with prices only if entered. No ratings or review markup.
- Online payments are not built: the site takes quote requests and enquiries, as planned. A checkout can be added later.
