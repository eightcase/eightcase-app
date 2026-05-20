-- Homeowner contact fields on leads (run in Supabase SQL Editor)

alter table public.leads
  add column if not exists contact_name text,
  add column if not exists contact_email text,
  add column if not exists contact_phone text,
  add column if not exists preferred_contact_method text,
  add column if not exists consent_given boolean not null default false,
  add column if not exists consent_timestamp timestamptz;

comment on column public.leads.contact_name is 'Homeowner name from visualisera contact form';
comment on column public.leads.preferred_contact_method is 'Telefon or E-post';
