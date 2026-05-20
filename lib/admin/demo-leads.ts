import type { PreparedLead } from "@/lib/ai-visualization/pipeline";

export const DEMO_LEADS_STORAGE_KEY = "eightcase.demoLeads.v1";

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

export function saveDemoLead(lead: PreparedLead): void {
  if (typeof window === "undefined") return;
  const existing = readDemoLeads();
  const deduped = existing.filter((x) => x.signature !== lead.signature);
  const next = [lead, ...deduped].slice(0, 25);
  window.localStorage.setItem(DEMO_LEADS_STORAGE_KEY, JSON.stringify(next));
}

export function clearDemoLeads(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_LEADS_STORAGE_KEY);
}
