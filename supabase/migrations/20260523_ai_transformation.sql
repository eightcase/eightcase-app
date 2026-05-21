-- AI property transformation metadata (Phase 1 scaffold)
-- Storage bucket `visualizations` should be created in Supabase Dashboard:
--   {company_id}/{lead_id}/rev-NNN/original.jpg
--   {company_id}/{lead_id}/rev-NNN/generated.jpg
--   {company_id}/{lead_id}/rev-NNN/generation.json

alter table public.leads
  add column if not exists ai_generation_status text,
  add column if not exists ai_generation_provider text,
  add column if not exists ai_generated_preview_url text,
  add column if not exists ai_generation_started_at timestamptz,
  add column if not exists ai_generation_completed_at timestamptz,
  add column if not exists ai_generation_metadata jsonb;

comment on column public.leads.ai_generation_status is 'queued | generating | completed | failed | skipped';
comment on column public.leads.ai_generation_provider is 'mock | replicate | fal | openai-images | runware';

alter table public.visualizations
  add column if not exists ai_generation_status text,
  add column if not exists ai_generation_provider text,
  add column if not exists ai_generation_metadata jsonb;

create index if not exists idx_leads_ai_generation_status
  on public.leads (ai_generation_status)
  where ai_generation_status is not null;
