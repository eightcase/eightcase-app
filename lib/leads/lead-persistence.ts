import type { AITransformationResult } from "@/lib/ai-transformation/types";
import type { PreparedLead } from "@/lib/ai-visualization/pipeline";
import {
  getDemoLeadById,
  readDemoLeads,
  saveDemoLead,
  saveDemoVisualizationRevision,
  saveEarlyCaptureDemoLead,
  updateDemoLead,
} from "@/lib/admin/demo-leads";
import {
  getLeadByIdFromSupabase,
  markLeadEmailSent,
  saveEarlyCaptureToSupabase,
  saveLeadToSupabase,
  saveVisualizationRevisionToSupabase,
  touchLeadActivity,
  updateLeadInSupabase,
} from "@/lib/admin/supabase-leads";
import { sendVisualizationReadyEmail } from "@/lib/email/visualization-ready";
import type { VisualizationEditorState, VisualizationSnapshot } from "@/lib/visualization/types";
import { editorFeatureIdsToPricingFeatures } from "@/lib/visualization/editor-features";
import { buildVisualizationSnapshot } from "@/lib/visualization/state";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export type EarlyCaptureInput = {
  address: string;
  contactMethod: "E-post" | "Telefon";
  email?: string;
  phone?: string;
  consentGiven: boolean;
};

export type EarlyCaptureResult = {
  success: boolean;
  leadId: string | null;
  storage: "supabase" | "demo";
  message: string;
};

const PLACEHOLDER_ESTIMATE = { min: 720_000, max: 920_000 };
const PLACEHOLDER_VALUE = { min: 95_000, max: 145_000 };

export async function persistEarlyCapture(
  input: EarlyCaptureInput,
): Promise<EarlyCaptureResult> {
  const signature = `early:${input.address}:${input.email ?? input.phone ?? ""}`;

  if (isSupabaseConfigured()) {
    const result = await saveEarlyCaptureToSupabase({
      address: input.address,
      contactMethod: input.contactMethod,
      email: input.email,
      phone: input.phone,
      consentGiven: input.consentGiven,
      signature,
    });
    if (result.success && result.leadId) {
      if (input.email) {
        void sendVisualizationReadyEmail({
          to: input.email,
          address: input.address,
          leadId: result.leadId,
        }).then((email) => {
          if (email.success) void markLeadEmailSent(result.leadId!, "supabase");
        });
      }
      return {
        success: true,
        leadId: result.leadId,
        storage: "supabase",
        message: result.message,
      };
    }
  }

  const demo = saveEarlyCaptureDemoLead({
    address: input.address,
    contactMethod: input.contactMethod,
    email: input.email,
    phone: input.phone,
    consentGiven: input.consentGiven,
    signature,
  });

  return {
    success: true,
    leadId: demo.leadId,
    storage: "demo",
    message: "Lead sparad lokalt (demo)",
  };
}

export async function loadLeadForVisualization(leadId: string): Promise<{
  lead: PreparedLead | null;
  storage: "supabase" | "demo" | null;
}> {
  if (isSupabaseConfigured()) {
    const lead = await getLeadByIdFromSupabase(leadId);
    if (lead) return { lead, storage: "supabase" };
  }
  const demo = getDemoLeadById(leadId);
  if (demo) return { lead: demo, storage: "demo" };
  return { lead: null, storage: null };
}

export async function persistLeadUpdate(
  lead: PreparedLead,
  storage: "supabase" | "demo" | null,
): Promise<{ success: boolean; message: string }> {
  if (storage === "supabase") {
    return updateLeadInSupabase(lead);
  }
  updateDemoLead(lead);
  return { success: true, message: "Lead uppdaterad lokalt" };
}

export async function persistCompleteLead(
  lead: PreparedLead,
  existingStorage?: "supabase" | "demo" | null,
): Promise<{ success: boolean; message: string; storage: "supabase" | "demo" }> {
  const isDemoId = lead.id.startsWith("demo_");

  if (existingStorage === "supabase" || (isSupabaseConfigured() && !isDemoId)) {
    const updated = await updateLeadInSupabase(lead);
    if (updated.success) {
      if (lead.contactEmail) {
        const email = await sendVisualizationReadyEmail({
          to: lead.contactEmail,
          recipientName: lead.contactName,
          address: lead.address,
          leadId: lead.id,
        });
        if (email.success) await markLeadEmailSent(lead.id, "supabase");
      }
      return { ...updated, storage: "supabase" };
    }
    if (existingStorage === "supabase") {
      return { ...updated, storage: "supabase" };
    }
  }

  if (existingStorage === "demo" || isDemoId) {
    updateDemoLead(lead);
    if (lead.contactEmail) {
      await sendVisualizationReadyEmail({
        to: lead.contactEmail,
        recipientName: lead.contactName,
        address: lead.address,
        leadId: lead.id,
      });
    }
    return { success: true, message: "Lead uppdaterad lokalt", storage: "demo" };
  }

  const insert = await saveLeadToSupabase(lead);
  if (insert.success) {
    if (lead.contactEmail) {
      await sendVisualizationReadyEmail({
        to: lead.contactEmail,
        recipientName: lead.contactName,
        address: lead.address,
        leadId: lead.id,
      });
    }
    return { ...insert, storage: "supabase" };
  }

  updateDemoLead(lead);
  return { success: true, message: insert.message, storage: "demo" };
}

export async function persistVisualizationRevision(
  leadId: string,
  editor: VisualizationEditorState,
  storage: "supabase" | "demo" | null,
  transformation?: AITransformationResult | null,
): Promise<{ success: boolean; snapshot: VisualizationSnapshot; message: string }> {
  const snapshot = buildVisualizationSnapshot(editor, "Version uppdaterad", transformation);

  if (storage === "supabase") {
    const result = await saveVisualizationRevisionToSupabase(leadId, snapshot);
    return { ...result, snapshot };
  }

  saveDemoVisualizationRevision(leadId, snapshot);
  const leads = readDemoLeads();
  const lead = leads.find((l) => l.id === leadId);
  if (lead) {
    updateDemoLead({
      ...lead,
      style: editor.style,
      size: editor.size,
      features: editorFeatureIdsToPricingFeatures(snapshot.editor.featureIds),
      estimatedPrice: snapshot.estimate,
      estimatedPropertyValueIncrease: snapshot.valueIncrease,
      revisionCount: snapshot.meta.revision,
      lastVersionLabel: snapshot.meta.versionLabel,
      lastActivityAt: new Date().toISOString(),
      aiTransformation: snapshot.transformation ?? lead.aiTransformation,
    });
  }

  return {
    success: true,
    snapshot,
    message: "Version sparad lokalt",
  };
}

export async function touchLead(leadId: string, storage: "supabase" | "demo" | null): Promise<void> {
  if (storage === "supabase") {
    await touchLeadActivity(leadId);
    return;
  }
  const lead = getDemoLeadById(leadId);
  if (lead) {
    updateDemoLead({ ...lead, lastActivityAt: new Date().toISOString() });
  }
}
