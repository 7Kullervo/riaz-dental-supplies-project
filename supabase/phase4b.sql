-- Phase 4b: run once in Supabase SQL Editor (after schema.sql).
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, description text, image_url text,
  sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, description text, logo_url text,
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null,
  brand_slug text references public.brands(slug) on update cascade on delete set null,
  category_slug text references public.categories(slug) on update cascade on delete set null,
  description text, price numeric(12,2),
  availability text not null default 'on-request' check (availability in ('in-stock','on-request','out-of-stock')),
  features jsonb not null default '[]', specs jsonb not null default '[]', images jsonb not null default '[]',
  brochure_url text, featured boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null, description text, expires_on date not null,
  product_slug text references public.products(slug) on update cascade on delete set null,
  created_at timestamptz not null default now()
);
create table if not exists public.site_content (
  key text primary key, value jsonb not null, updated_at timestamptz not null default now()
);

-- Locked down: only the website server (secret service-role key) can read or write.
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.products enable row level security;
alter table public.offers enable row level security;
alter table public.site_content enable row level security;

-- Starting categories (editable in the admin; not a claim that every category is stocked).
insert into public.categories (slug, name, description, sort_order) values
 ('dental-chairs-units','Dental Chairs & Units','Treatment chairs, units and related clinic equipment.',1),
 ('dental-handpieces','Dental Handpieces','Handpieces and related rotary instruments.',2),
 ('sterilization-equipment','Sterilization Equipment','Equipment for instrument cleaning and sterilization.',3),
 ('imaging-xray-equipment','Dental Imaging & X-Ray Equipment','Imaging and X-ray equipment for dental diagnostics.',4),
 ('dental-instruments','Dental Instruments','Hand instruments for examination and treatment.',5),
 ('surgical-equipment','Surgical Equipment','Instruments and equipment for dental surgery.',6),
 ('materials-consumables','Dental Materials & Consumables','Restorative materials and everyday clinic consumables.',7),
 ('laboratory-equipment','Laboratory Equipment','Equipment for dental laboratories.',8),
 ('dental-accessories','Dental Accessories','Accessories and supporting items for the dental clinic.',9)
on conflict (slug) do nothing;

-- Public storage bucket for product images, logos and brochures.
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
