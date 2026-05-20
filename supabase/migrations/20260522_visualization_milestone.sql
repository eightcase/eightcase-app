-- Visualization revisit milestone

alter table public.leads
  add column if not exists last_activity_at timestamptz,
  add column if not exists email_sent_at timestamptz,
  add column if not exists visualization_revision_count integer not null default 0;

alter table public.visualizations
  add column if not exists revision_number integer not null default 1,
  add column if not exists version_label text,
  add column if not exists editor_state jsonb,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_leads_last_activity on public.leads(last_activity_at desc);
create index if not exists idx_visualizations_lead_revision on public.visualizations(lead_id, revision_number desc);
