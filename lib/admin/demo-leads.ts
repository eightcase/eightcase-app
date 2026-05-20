import type { PreparedLead } from "@/lib/ai-visualization/pipeline";
import type { VisualizationSnapshot } from "@/lib/visualization/types";
import { editorFeatureIdsToPricingFeatures } from "@/lib/visualization/editor-features";
import { funnelStateToEditorState } from "@/lib/visualization/state";
import { calculateEstimate } from "@/lib/visualisera/pricing";
import type { FunnelState } from "@/lib/visualisera/types";

export const DEMO_LEADS_STORAGE_KEY = "eightcase.demoLeads.v1";
export const DEMO_VIZ_STORAGE_KEY = "eightcase.demoVisualizations.v1";

type DemoVizStore = Record<string, VisualizationSnapshot[]>;

function readVizStore(): DemoVizStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(DEMO_VIZ_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as DemoVizStore;
  } catch {
    return {};
  }
}

function writeVizStore(store: DemoVizStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_VIZ_STORAGE_KEY, JSON.stringify(store));
}

export function readDemoLeads(): PreparedLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DEMO_LEADS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as PreparedLead[];
  } catch {
    return [];
  }
}

function writeDemoLeads(leads: PreparedLead[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_LEADS_STORAGE_KEY, JSON.stringify(leads));
}

export function getDemoLeadById(leadId: string): PreparedLead | null {
  return readDemoLeads().find((l) => l.id === leadId) ?? null;
}

export function saveDemoLead(lead: PreparedLead): void {
  if (typeof window === "undefined") return;
  const existing = readDemoLeads();
  const deduped = existing.filter((x) => x.id !== lead.id && x.signature !== lead.signature);
  const next = [{ ...lead, lastActivityAt: new Date().toISOString() }, ...deduped].slice(0, 50);
  writeDemoLeads(next);
}

export function updateDemoLead(lead: PreparedLead): void {
  saveDemoLead(lead);
}

export function clearDemoLeads(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_LEADS_STORAGE_KEY);
  window.localStorage.removeItem(DEMO_VIZ_STORAGE_KEY);
}

export function saveEarlyCaptureDemoLead(input: {
  address: string;
  contactMethod: "E-post" | "Telefon";
  email?: string;
  phone?: string;
  consentGiven: boolean;
  signature: string;
}): { leadId: string } {
  const leadId = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = new Date().toISOString();
  const lead: PreparedLead = {
    id: leadId,
    createdAt: now,
    address: input.address,
    style: null,
    size: null,
    features: [],
    budget: null,
    timeline: null,
    estimatedPrice: { min: 720_000, max: 920_000 },
    estimatedPropertyValueIncrease: { min: 95_000, max: 145_000 },
    drainageUpsell: null,
    pipeline: null,
    signature: input.signature,
    crmStatus: "Ny",
    contactEmail: input.email ?? null,
    contactPhone: input.phone ?? null,
    preferredContactMethod: input.contactMethod,
    consentGiven: input.consentGiven,
    consentTimestamp: now,
    leadSource: "early_capture",
    lastActivityAt: now,
    revisionCount: 0,
  };
  saveDemoLead(lead);
  const funnelState = {
    address: input.address,
    style: "Modern",
    size: "Mellan",
    features: [],
    budget: null,
    timeline: null,
  } satisfies FunnelState;
  const editor = funnelStateToEditorState(funnelState);
  const estimate = calculateEstimate(funnelState);
  saveDemoVisualizationRevision(leadId, {
    editor,
    estimate,
    valueIncrease: lead.estimatedPropertyValueIncrease,
    render: {
      address: input.address,
      style: "Modern",
      size: "Mellan",
      featureIds: [],
      renderKey: "initial",
    },
    meta: { revision: 1, versionLabel: "Första version", updatedAt: now },
  });
  return { leadId };
}

export function saveDemoVisualizationRevision(
  leadId: string,
  snapshot: VisualizationSnapshot,
): void {
  const store = readVizStore();
  const list = store[leadId] ?? [];
  store[leadId] = [snapshot, ...list.filter((s) => s.meta.revision !== snapshot.meta.revision)].slice(
    0,
    20,
  );
  writeVizStore(store);
}

export function getLatestDemoVisualization(leadId: string): VisualizationSnapshot | null {
  const list = readVizStore()[leadId];
  return list?.[0] ?? null;
}
