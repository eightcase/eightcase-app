-- Eightcase Supabase foundation schema (Phase 2)
-- Run in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  primary_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  name text not null,
  area text not null,
  status text not null default 'Aktiv',
  expected_reach integer,
  estimated_scan_rate numeric(5,2),
  estimated_leads integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  campaign_id uuid references public.campaigns(id) on delete set null,
  source text not null default 'visualisera_demo',
  address text not null,
  style text,
  size text,
  features text[] not null default '{}',
  budget text,
  timeline text,
  estimated_price_min integer not null,
  estimated_price_max integer not null,
  estimated_value_increase_min integer not null,
  estimated_value_increase_max integer not null,
  drainage_risk text,
  drainage_payload jsonb,
  signature text unique,
  crm_status text not null default 'Ny',
  contact_name text,
  contact_email text,
  contact_phone text,
  preferred_contact_method text,
  consent_given boolean not null default false,
  consent_timestamp timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.visualizations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  address text not null,
  coordinates_lat numeric(10,7),
  coordinates_lng numeric(10,7),
  property_image_url text,
  before_image_url text,
  after_image_url text,
  pipeline_payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_campaigns_company on public.campaigns(company_id);
create index if not exists idx_leads_company on public.leads(company_id);
create index if not exists idx_leads_campaign on public.leads(campaign_id);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_visualizations_lead on public.visualizations(lead_id);
