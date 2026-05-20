import type { PreparedLead } from "@/lib/ai-visualization/pipeline";
import type { LeadCrmStatus } from "@/lib/admin/lead-crm";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const LEAD_SELECT =
  "id, created_at, address, style, size, features, budget, timeline, estimated_price_min, estimated_price_max, estimated_value_increase_min, estimated_value_increase_max, drainage_payload, signature, crm_status";

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
  };
}

export function mapPreparedLeadToInsert(lead: PreparedLead): LeadInsertRow {
  return {
    company_id: process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ID ?? null,
    source: "visualisera_demo",
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
    crm_status: "Ny",
  };
}

/**
 * Attempts to persist a lead in Supabase.
 * Caller should fallback to localStorage/demo mode when success is false.
 */
export async function saveLeadToSupabase(lead: PreparedLead): Promise<{
  success: boolean;
  message: string;
}> {
  const client = getSupabaseBrowserClient();
  if (!client) {
    return { success: false, message: "Supabase not configured" };
  }

  const payload = mapPreparedLeadToInsert(lead);
  const { error } = await client.from("leads").insert(payload);
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Lead saved to Supabase" };
}

/**
 * Updates CRM status for a Supabase lead row.
 */
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
    .update({ crm_status: status })
    .eq("id", leadId);

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Status sparad i Supabase" };
}

/**
 * Reads latest leads from Supabase and maps them to PreparedLead-compatible shape.
 */
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

/** @deprecated Use updateLeadCrmStatusInSupabase */
export async function saveLeadStatusToSupabase(input: {
  leadId: string;
  status: LeadCrmStatus;
}): Promise<{ success: boolean; message: string }> {
  return updateLeadCrmStatusInSupabase(input.leadId, input.status);
}
