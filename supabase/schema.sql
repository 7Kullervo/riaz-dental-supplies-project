-- Run this once in Supabase: SQL Editor > New query > paste > Run.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'quote')),
  name text not null,
  email text not null,
  phone text not null,
  subject text,
  message text,
  product_slug text,
  quantity integer,
  status text not null default 'new' check (status in ('new', 'in-progress', 'completed')),
  internal_notes text,
  created_at timestamptz not null default now()
);
create index if not exists enquiries_email_created_idx on public.enquiries (email, created_at desc);

-- Row Level Security ON with no public policies: the browser can never read or write this table.
-- Only the server (using the secret service-role key) can, through the website's server actions.
alter table public.enquiries enable row level security;
