-- Phase 5: run once in Supabase SQL Editor (after schema.sql and phase4b.sql).
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null, author text not null, role text,
  created_at timestamptz not null default now()
);
alter table public.testimonials enable row level security;
