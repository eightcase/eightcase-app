import type { PreparedLead } from "@/lib/ai-visualization/pipeline";
import type { LeadCrmStatus } from "@/lib/admin/lead-crm";
import type { VisualizationSnapshot } from "@/lib/visualization/types";
import { editorFeatureIdsToPricingFeatures } from "@/lib/visualization/editor-features";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const LEAD_SELECT =
  "id, created_at, address, style, size, features, budget, timeline, estimated_price_min, estimated_price_max, estimated_value_increase_min, estimated_value_increase_max, drainage_payload, signature, crm_status, contact_name, contact_email, contact_phone, preferred_contact_method, consent_given, consent_timestamp, source, last_activity_at, email_sent_at, visualization_revision_count";

type LeadInsertRow = {
  company_id: string | null;
  source: string;
  address: string;
  style: string | null;
  size: string | null;
  features: string[];
  budget: string | null;
  timeline: string | null;
  estimated_price_min: number;
  estimated_price_max: number;
  estimated_value_increase_min: number;
  estimated_value_increase_max: number;
  drainage_risk: string | null;
  drainage_payload: PreparedLead["drainageUpsell"];
  signature: string;
  crm_status: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  preferred_contact_method: string | null;
  consent_given: boolean;
  consent_timestamp: string | null;
  last_activity_at?: string | null;
};

type LeadRow = {
  id: string;
  created_at: string;
  address: string;
  style: string | null;
  size: string | null;
  features: string[] | null;
  budget: string | null;
  timeline: string | null;
  estimated_price_min: number;
  estimated_price_max: number;
  estimated_value_increase_min: number;
  estimated_value_increase_max: number;
  drainage_payload: PreparedLead["drainageUpsell"] | null;
  signature: string;
  crm_status: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  preferred_contact_method: string | null;
  consent_given: boolean | null;
  consent_timestamp: string | null;
  source: string | null;
  last_activity_at: string | null;
  email_sent_at: string | null;
  visualization_revision_count: number | null;
};

function mapRowToPreparedLead(row: LeadRow): PreparedLead {
  return {
    id: row.id,
    createdAt: row.created_at,
    address: row.address,
    style: row.style,
    size: row.size,
    features: row.features ?? [],
    budget: row.budget,
    timeline: row.timeline,
    estimatedPrice: {
      min: row.estimated_price_min,
      max: row.estimated_price_max,
    },
    estimatedPropertyValueIncrease: {
      min: row.estimated_value_increase_min,
      max: row.estimated_value_increase_max,
    },
    drainageUpsell: row.drainage_payload ?? null,
    pipeline: null,
    signature: row.signature,
    crmStatus: row.crm_status,
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    preferredContactMethod: row.preferred_contact_method,
    consentGiven: row.consent_given ?? false,
    consentTimestamp: row.consent_timestamp,
    leadSource: row.source,
    lastActivityAt: row.last_activity_at,
    emailSentAt: row.email_sent_at,
    revisionCount: row.visualization_revision_count ?? 0,
  };
}

export function mapPreparedLeadToInsert(lead: PreparedLead): LeadInsertRow {
  const now = new Date().toISOString();
  return {
    company_id: process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ID ?? null,
    source: lead.leadSource ?? "visualisera_demo",
    address: lead.address,
    style: lead.style,
    size: lead.size,
    features: lead.features,
    budget: lead.budget,
    timeline: lead.timeline,
    estimated_price_min: lead.estimatedPrice.min,
    estimated_price_max: lead.estimatedPrice.max,
    estimated_value_increase_min: lead.estimatedPropertyValueIncrease.min,
    estimated_value_increase_max: lead.estimatedPropertyValueIncrease.max,
    drainage_risk: lead.drainageUpsell?.riskLevel ?? null,
    drainage_payload: lead.drainageUpsell,
    signature: lead.signature,
    crm_status: lead.crmStatus ?? "Ny",
    contact_name: lead.contactName ?? null,
    contact_email: lead.contactEmail ?? null,
    contact_phone: lead.contactPhone ?? null,
    preferred_contact_method: lead.preferredContactMethod ?? null,
    consent_given: lead.consentGiven ?? false,
    consent_timestamp: lead.consentTimestamp ?? null,
    last_activity_at: lead.lastActivityAt ?? now,
  };
}

export async function saveEarlyCaptureToSupabase(input: {
  address: string;
  contactMethod: "E-post" | "Telefon";
  email?: string;
  phone?: string;
  consentGiven: boolean;
  signature: string;
}): Promise<{ success: boolean; leadId: string | null; message: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, leadId: null, message: "Supabase not configured" };
  }

  const now = new Date().toISOString();
  const row: LeadInsertRow = {
    company_id: process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ID ?? null,
    source: "early_capture",
    address: input.address,
    style: null,
    size: null,
    features: [],
    budget: null,
    timeline: null,
    estimated_price_min: 720_000,
    estimated_price_max: 920_000,
    estimated_value_increase_min: 95_000,
    estimated_value_increase_max: 145_000,
    drainage_risk: null,
    drainage_payload: null,
    signature: input.signature,
    crm_status: "Ny",
    contact_name: null,
    contact_email: input.email ?? null,
    contact_phone: input.phone ?? null,
    preferred_contact_method: input.contactMethod,
    consent_given: input.consentGiven,
    consent_timestamp: now,
    last_activity_at: now,
  };

  const { data, error } = await client.from("leads").insert(row).select("id").single();
  if (error || !data) {
    return { success: false, leadId: null, message: error?.message ?? "Insert failed" };
  }

  return {
    success: true,
    leadId: (data as { id: string }).id,
    message: "Tidig lead sparad",
  };
}

export async function getLeadByIdFromSupabase(leadId: string): Promise<PreparedLead | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return null;

  const { data, error } = await client.from("leads").select(LEAD_SELECT).eq("id", leadId).maybeSingle();
  if (error || !data) return null;
  return mapRowToPreparedLead(data as LeadRow);
}

export async function updateLeadInSupabase(lead: PreparedLead): Promise<{
  success: boolean;
  message: string;
}> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, message: "Supabase not configured" };
  }

  const now = new Date().toISOString();
  const { error } = await client
    .from("leads")
    .update({
      source: lead.leadSource ?? "visualisera_demo",
      address: lead.address,
      style: lead.style,
      size: lead.size,
      features: lead.features,
      budget: lead.budget,
      timeline: lead.timeline,
      estimated_price_min: lead.estimatedPrice.min,
      estimated_price_max: lead.estimatedPrice.max,
      estimated_value_increase_min: lead.estimatedPropertyValueIncrease.min,
      estimated_value_increase_max: lead.estimatedPropertyValueIncrease.max,
      drainage_risk: lead.drainageUpsell?.riskLevel ?? null,
      drainage_payload: lead.drainageUpsell,
      signature: lead.signature,
      contact_name: lead.contactName ?? null,
      contact_email: lead.contactEmail ?? null,
      contact_phone: lead.contactPhone ?? null,
      preferred_contact_method: lead.preferredContactMethod ?? null,
      consent_given: lead.consentGiven ?? false,
      consent_timestamp: lead.consentTimestamp,
      last_activity_at: now,
    })
    .eq("id", lead.id);

  if (error) return { success: false, message: error.message };
  return { success: true, message: "Lead uppdaterad i Supabase" };
}

export async function saveLeadToSupabase(lead: PreparedLead): Promise<{
  success: boolean;
  message: string;
}> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, message: "Supabase not configured" };
  }

  const existing = await getLeadByIdFromSupabase(lead.id);
  if (existing) {
    return updateLeadInSupabase(lead);
  }

  if (!lead.consentGiven) {
    return { success: false, message: "Samtycke saknas" };
  }
  if (!lead.contactEmail?.trim() && !lead.contactPhone?.trim() && !lead.contactName?.trim()) {
    return { success: false, message: "Kontaktuppgifter saknas" };
  }

  const payload = mapPreparedLeadToInsert(lead);
  const { data, error } = await client.from("leads").insert(payload).select("id").single();
  if (error) {
    return { success: false, message: error.message };
  }
  if (data && lead.id !== (data as { id: string }).id) {
    lead.id = (data as { id: string }).id;
  }
  return { success: true, message: "Lead sparad i Supabase" };
}

export async function saveVisualizationRevisionToSupabase(
  leadId: string,
  snapshot: VisualizationSnapshot,
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, message: "Supabase not configured" };
  }

  const now = new Date().toISOString();
  const { error: vizError } = await client.from("visualizations").insert({
    lead_id: leadId,
    address: snapshot.editor.address,
    editor_state: snapshot.editor,
    revision_number: snapshot.meta.revision,
    version_label: snapshot.meta.versionLabel,
    pipeline_payload: { render: snapshot.render, estimate: snapshot.estimate },
    updated_at: now,
  });

  if (vizError) {
    return { success: false, message: vizError.message };
  }

  const { error: leadError } = await client
    .from("leads")
    .update({
      style: snapshot.editor.style,
      size: snapshot.editor.size,
      features: editorFeatureIdsToPricingFeatures(snapshot.editor.featureIds),
      estimated_price_min: snapshot.estimate.min,
      estimated_price_max: snapshot.estimate.max,
      estimated_value_increase_min: snapshot.valueIncrease.min,
      estimated_value_increase_max: snapshot.valueIncrease.max,
      visualization_revision_count: snapshot.meta.revision,
      last_activity_at: now,
    })
    .eq("id", leadId);

  if (leadError) return { success: false, message: leadError.message };
  return { success: true, message: "Version uppdaterad" };
}

export async function touchLeadActivity(leadId: string): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client) return;
  await client
    .from("leads")
    .update({ last_activity_at: new Date().toISOString() })
    .eq("id", leadId);
}

export async function markLeadEmailSent(
  leadId: string,
  _storage: "supabase",
): Promise<void> {
  const client = getSupabaseBrowserClient();
  if (!client) return;
  await client
    .from("leads")
    .update({ email_sent_at: new Date().toISOString() })
    .eq("id", leadId);
}

export async function updateLeadCrmStatusInSupabase(
  leadId: string,
  status: LeadCrmStatus,
): Promise<{ success: boolean; message: string }> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, message: "Supabase not configured" };
  }

  const { error } = await client
    .from("leads")
    .update({ crm_status: status, last_activity_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Status sparad i Supabase" };
}

export async function readLeadsFromSupabase(limit = 50): Promise<PreparedLead[]> {
  const client = getSupabaseBrowserClient();
  if (!client) return [];

  const { data, error } = await client
    .from("leads")
    .select(LEAD_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as LeadRow[]).map(mapRowToPreparedLead);
}

export async function tryReadLeadsFromSupabase(limit = 50): Promise<{
  configured: boolean;
  leads: PreparedLead[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    return { configured: false, leads: [], error: null };
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return { configured: false, leads: [], error: null };
  }

  const { data, error } = await client
    .from("leads")
    .select(LEAD_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return { configured: true, leads: [], error: error?.message ?? "Kunde inte läsa leads." };
  }

  const leads = (data as LeadRow[]).map(mapRowToPreparedLead);

  return { configured: true, leads, error: null };
}

export async function saveLeadStatusToSupabase(input: {
  leadId: string;
  status: LeadCrmStatus;
}): Promise<{ success: boolean; message: string }> {
  return updateLeadCrmStatusInSupabase(input.leadId, input.status);
}
