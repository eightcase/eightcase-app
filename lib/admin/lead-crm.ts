import type { PreparedLead } from "@/lib/ai-visualization/pipeline";
import type { AITransformationResult } from "@/lib/ai-transformation/types";
import { generationStatusLabel } from "@/lib/ai-transformation/generation-job";
import { visualizationPagePath } from "@/lib/visualization/state";
import type { DrainageAssessment } from "@/lib/drainage/types";
import type { Lead, LeadStatus as MockHeatStatus } from "@/lib/admin/mock-data";

export const LEAD_CRM_STATUSES = [
  "Ny",
  "Kontaktad",
  "Bokad",
  "Vunnen",
  "Förlorad",
] as const;

export type LeadCrmStatus = (typeof LEAD_CRM_STATUSES)[number];

export type LeadSource = "supabase" | "demo" | "mock";

export type LeadFilter = "all" | "hot" | "new" | "booked" | "supabase";

export type CrmLead = {
  id: string;
  /** Stable key for local status overrides; maps to future `leads.crm_status` in Supabase. */
  statusKey: string;
  source: LeadSource;
  displayName: string;
  campaign: string | null;
  createdAt: string;
  address: string;
  style: string | null;
  size: string | null;
  features: string[];
  budget: string | null;
  timeline: string | null;
  estimatedPrice: { min: number; max: number };
  estimatedPropertyValueIncrease: { min: number; max: number };
  drainageUpsell: DrainageAssessment | null;
  crmStatus: LeadCrmStatus;
  qualityScore: number;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  preferredContactMethod: string | null;
  consentGiven: boolean;
  consentTimestamp: string | null;
  leadSource: string | null;
  lastActivityAt: string | null;
  emailSentAt: string | null;
  revisionCount: number;
  lastVersionLabel: string | null;
  visualizationUrl: string;
  aiTransformation: AITransformationResult | null;
};

export { generationStatusLabel };

export const LEAD_STATUS_STORAGE_KEY = "eightcase.leadCrmStatuses.v1";

const PREMIUM_FEATURES = new Set<string>(["Spabad", "Pooltak", "Utekök"]);

const MOCK_HEAT_TO_CRM: Record<MockHeatStatus, LeadCrmStatus> = {
  Het: "Ny",
  Varm: "Kontaktad",
  Ny: "Ny",
};

export function formatKr(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

export function formatKrRange(min: number, max: number): string {
  return `${formatKr(min)} – ${formatKr(max)} kr`;
}

export function formatLeadDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("sv-SE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Client-side status until `leads.crm_status` exists in Supabase. */
export function readLeadStatusOverrides(): Record<string, LeadCrmStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(LEAD_STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, LeadCrmStatus>;
  } catch {
    return {};
  }
}

export function saveLeadStatusOverride(statusKey: string, status: LeadCrmStatus): void {
  if (typeof window === "undefined") return;
  const next = { ...readLeadStatusOverrides(), [statusKey]: status };
  window.localStorage.setItem(LEAD_STATUS_STORAGE_KEY, JSON.stringify(next));
}

export function parseCrmStatus(value: string | null | undefined): LeadCrmStatus {
  if (value && LEAD_CRM_STATUSES.includes(value as LeadCrmStatus)) {
    return value as LeadCrmStatus;
  }
  return "Ny";
}

export function resolveCrmStatus(
  statusKey: string,
  fallback: LeadCrmStatus,
  overrides: Record<string, LeadCrmStatus>,
): LeadCrmStatus {
  return overrides[statusKey] ?? fallback;
}

export function calculateLeadQualityScore(lead: {
  budget: string | null;
  timeline: string | null;
  features: string[];
  drainageUpsell: DrainageAssessment | null;
}): number {
  let score = 0;

  if (lead.budget === "1M+") score += 30;
  else if (lead.budget === "750k–1M") score += 20;
  else if (lead.budget === "500k–750k") score += 10;

  if (lead.timeline === "Så snart som möjligt") score += 25;
  else if (lead.timeline === "Inom 3 månader") score += 20;
  else if (lead.timeline === "Inom 6–12 månader") score += 10;

  const premiumCount = lead.features.filter((f) => PREMIUM_FEATURES.has(f)).length;
  score += Math.min(premiumCount * 8, 24);

  if (lead.drainageUpsell) {
    score += 15;
    if (lead.drainageUpsell.riskLevel === "Förhöjd" || lead.drainageUpsell.riskLevel === "Hög") {
      score += 10;
    }
  }

  return Math.min(100, score);
}

export function isHotLead(lead: CrmLead): boolean {
  return lead.qualityScore >= 70 || (lead.crmStatus === "Ny" && lead.qualityScore >= 55);
}

export function matchesLeadFilter(lead: CrmLead, filter: LeadFilter): boolean {
  switch (filter) {
    case "all":
      return true;
    case "hot":
      return isHotLead(lead);
    case "new":
      return lead.crmStatus === "Ny";
    case "booked":
      return lead.crmStatus === "Bokad";
    case "supabase":
      return lead.source === "supabase";
    default:
      return true;
  }
}

export function crmLeadFromPrepared(
  lead: PreparedLead,
  source: "supabase" | "demo",
  overrides: Record<string, LeadCrmStatus>,
): CrmLead {
  const statusKey = lead.signature || lead.id;
  const crmStatus =
    source === "supabase"
      ? parseCrmStatus(lead.crmStatus)
      : resolveCrmStatus(statusKey, "Ny", overrides);

  const contactName = lead.contactName?.trim() || null;
  const base = {
    id: lead.id,
    statusKey,
    source,
    displayName:
      contactName ?? (source === "supabase" ? "Supabase lead" : "Demo lead"),
    campaign: null,
    createdAt: lead.createdAt,
    address: lead.address,
    style: lead.style,
    size: lead.size,
    features: lead.features,
    budget: lead.budget,
    timeline: lead.timeline,
    estimatedPrice: lead.estimatedPrice,
    estimatedPropertyValueIncrease: lead.estimatedPropertyValueIncrease,
    drainageUpsell: lead.drainageUpsell,
    crmStatus,
    contactName,
    contactEmail: lead.contactEmail?.trim() || null,
    contactPhone: lead.contactPhone?.trim() || null,
    preferredContactMethod: lead.preferredContactMethod ?? null,
    consentGiven: lead.consentGiven ?? false,
    consentTimestamp: lead.consentTimestamp ?? null,
    leadSource: lead.leadSource ?? null,
    lastActivityAt: lead.lastActivityAt ?? null,
    emailSentAt: lead.emailSentAt ?? null,
    revisionCount: lead.revisionCount ?? 0,
    lastVersionLabel: lead.lastVersionLabel ?? null,
    visualizationUrl: visualizationPagePath(lead.id),
    aiTransformation:
      lead.aiTransformation ?? lead.pipeline?.transformation ?? null,
  };

  return {
    ...base,
    qualityScore: calculateLeadQualityScore(base),
  };
}

function estimatePriceFromBudget(budget: string): { min: number; max: number } {
  if (budget === "1M+") return { min: 1_020_000, max: 1_580_000 };
  if (budget === "750k–1M") return { min: 820_000, max: 1_020_000 };
  if (budget === "500k–750k") return { min: 620_000, max: 780_000 };
  return { min: 700_000, max: 900_000 };
}

export function crmLeadFromMock(
  lead: Lead,
  overrides: Record<string, LeadCrmStatus>,
): CrmLead {
  const statusKey = `mock:${lead.id}`;
  const fallback = MOCK_HEAT_TO_CRM[lead.status] ?? "Ny";
  const crmStatus = resolveCrmStatus(statusKey, fallback, overrides);
  const estimatedPrice = estimatePriceFromBudget(lead.budget);
  const mid = Math.round((estimatedPrice.min + estimatedPrice.max) / 2);

  const base = {
    id: lead.id,
    statusKey,
    source: "mock" as const,
    displayName: lead.name,
    campaign: lead.campaign,
    createdAt: lead.createdAt,
    address: lead.address,
    style: lead.style,
    size: "Mellan",
    features: lead.status === "Het" ? ["Spabad", "Pooltak", "Utekök"] : ["Poolbelysning", "Trädäck"],
    budget: lead.budget,
    timeline: lead.timeline,
    estimatedPrice,
    estimatedPropertyValueIncrease: {
      min: Math.round(mid * 0.12),
      max: Math.round(mid * 0.18),
    },
    drainageUpsell:
      lead.status === "Het"
        ? ({
            riskLevel: "Förhöjd",
            riskScore: 72,
            recommendation: "Samordnad dränering rekommenderas vid poolprojekt.",
            problemZones: ["Norrsida", "Fuktskydd"],
            drainageMin: 185_000,
            drainageMax: 265_000,
            coordinatedSavingsKr: 42_000,
            coordinatedSavingsPercent: 8,
            combinedMin: estimatedPrice.min + 185_000,
            combinedMax: estimatedPrice.max + 265_000,
            separateTotalMin: estimatedPrice.min + 210_000,
            separateTotalMax: estimatedPrice.max + 290_000,
          } satisfies DrainageAssessment)
        : null,
    crmStatus,
    contactName: null,
    contactEmail: null,
    contactPhone: null,
    preferredContactMethod: null,
    consentGiven: false,
    consentTimestamp: null,
    leadSource: "mock",
    lastActivityAt: null,
    emailSentAt: null,
    revisionCount: 0,
    lastVersionLabel: null,
    visualizationUrl: visualizationPagePath(lead.id),
    aiTransformation: null,
  };

  return {
    ...base,
    qualityScore: calculateLeadQualityScore(base),
  };
}

export function mergeCrmLeads(input: {
  supabase: PreparedLead[];
  demo: PreparedLead[];
  mock: Lead[];
  overrides: Record<string, LeadCrmStatus>;
}): CrmLead[] {
  const byKey = new Map<string, CrmLead>();

  for (const lead of input.mock) {
    const crm = crmLeadFromMock(lead, input.overrides);
    byKey.set(crm.statusKey, crm);
  }
  for (const lead of input.demo) {
    const crm = crmLeadFromPrepared(lead, "demo", input.overrides);
    byKey.set(crm.statusKey, crm);
  }
  for (const lead of input.supabase) {
    const crm = crmLeadFromPrepared(lead, "supabase", input.overrides);
    byKey.set(crm.statusKey, crm);
  }

  return Array.from(byKey.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function qualityScoreLabel(score: number): string {
  if (score >= 75) return "Hög";
  if (score >= 50) return "Medel";
  return "Låg";
}
