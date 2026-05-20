-- Add CRM status to leads (run in Supabase SQL Editor if not using CLI migrations)

alter table public.leads
  add column if not exists crm_status text not null default 'Ny';

comment on column public.leads.crm_status is
  'CRM pipeline status: Ny, Kontaktad, Bokad, Vunnen, Förlorad';

-- Optional: allow anon key to update status in demo phase (adjust for production auth)
-- create policy "anon update leads crm_status"
--   on public.leads for update to anon
--   using (true)
--   with check (true);
