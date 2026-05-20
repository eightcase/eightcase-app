"use client";

import { useEffect, useState } from "react";
import type { PreparedLead } from "@/lib/ai-visualization/pipeline";
import { clearDemoLeads, readDemoLeads } from "@/lib/admin/demo-leads";
import { MOCK_LEADS } from "@/lib/admin/mock-data";
import { tryReadLeadsFromSupabase } from "@/lib/admin/supabase-leads";

type LeadSource = "supabase" | "demo" | "mock";

type LeadRow = {
  id: string;
  source: LeadSource;
  name: string;
  address: string;
  style: string;
  budget: string;
  timeline: string;
  subline: string;
};

export function AdminLeads() {
  const [demoLeads, setDemoLeads] = useState<PreparedLead[]>([]);
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [dataSource, setDataSource] = useState<LeadSource>("mock");
  const [checkingSupabase, setCheckingSupabase] = useState(true);
  const [fallbackMessage, setFallbackMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadLeads = async () => {
      setCheckingSupabase(true);
      setFallbackMessage(null);
      const localDemo = readDemoLeads();
      if (!cancelled) setDemoLeads(localDemo);

      const supabase = await tryReadLeadsFromSupabase(100);
      if (cancelled) return;

      if (supabase.configured && supabase.leads.length > 0) {
        setRows(supabase.leads.map(mapPreparedLeadToRow("supabase")));
        setDataSource("supabase");
        setCheckingSupabase(false);
        return;
      }

      if (supabase.error) {
        setFallbackMessage("Supabase kunde inte läsas. Visar fallback-data.");
      } else if (supabase.configured) {
        setFallbackMessage("Inga Supabase leads ännu. Visar fallback-data.");
      }

      if (localDemo.length > 0) {
        setRows(localDemo.map(mapPreparedLeadToRow("demo")));
        setDataSource("demo");
        setCheckingSupabase(false);
        return;
      }

      setRows(
        MOCK_LEADS.map((lead) => ({
          id: lead.id,
          source: "mock" as const,
          name: lead.name,
          address: lead.address,
          style: lead.style,
          budget: lead.budget,
          timeline: lead.timeline,
          subline: lead.campaign,
        })),
      );
      setDataSource("mock");
      setCheckingSupabase(false);
    };

    void loadLeads();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleClearDemoLeads = () => {
    const ok = window.confirm("Rensa alla demo leads från demoportalen?");
    if (!ok) return;
    clearDemoLeads();
    setDemoLeads([]);
    if (dataSource === "demo") {
      setRows(
        MOCK_LEADS.map((lead) => ({
          id: lead.id,
          source: "mock" as const,
          name: lead.name,
          address: lead.address,
          style: lead.style,
          budget: lead.budget,
          timeline: lead.timeline,
          subline: lead.campaign,
        })),
      );
      setDataSource("mock");
      setFallbackMessage("Demo leads rensade. Visar mock leads.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-ec-warm">Leads</h1>
          <p className="text-sm text-ec-text-muted">
            Kvalificerade förfrågningar från visualiseringsfunneln
          </p>
        </div>
        {dataSource === "demo" && demoLeads.length > 0 ? (
          <button
            type="button"
            onClick={handleClearDemoLeads}
            className="btn-secondary inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-ec-text-muted hover:text-ec-ink"
          >
            Rensa demo leads ({demoLeads.length})
          </button>
        ) : null}
      </div>
      {checkingSupabase ? (
        <div className="mb-3 rounded-lg border border-ec-border-subtle bg-ec-bg-elevated px-4 py-2 text-xs text-ec-text-muted">
          Läser leads från Supabase...
        </div>
      ) : null}
      {fallbackMessage ? (
        <div className="mb-3 rounded-lg border border-ec-border-subtle bg-ec-bg-subtle/50 px-4 py-2 text-xs text-ec-text-muted">
          {fallbackMessage}
        </div>
      ) : null}
      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ec-border bg-ec-bg-subtle/80 text-xs uppercase tracking-wider text-ec-text-dim">
                <th className="px-4 py-2.5 font-medium">Namn</th>
                <th className="px-4 py-2.5 font-medium">Adress</th>
                <th className="px-4 py-2.5 font-medium">Stil</th>
                <th className="px-4 py-2.5 font-medium">Budget</th>
                <th className="px-4 py-2.5 font-medium">Tidsplan</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-ec-border-subtle hover:bg-ec-bg-subtle/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-ec-warm">{lead.name}</span>
                    <p className="mt-0.5 text-xs text-ec-text-dim">{lead.subline}</p>
                  </td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.address}</td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.style}</td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.budget}</td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.timeline}</td>
                  <td className="px-4 py-3">
                    <SourceBadge source={lead.source} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function buildLeadSubline(lead: PreparedLead): string {
  const price = `${new Intl.NumberFormat("sv-SE").format(lead.estimatedPrice.min)} – ${new Intl.NumberFormat("sv-SE").format(lead.estimatedPrice.max)} kr`;
  const drainage = lead.drainageUpsell
    ? `Dränering: ${lead.drainageUpsell.riskLevel}`
    : "Ingen dräneringsanalys";
  return `${price} · ${drainage}`;
}

function mapPreparedLeadToRow(source: "supabase" | "demo") {
  return (lead: PreparedLead): LeadRow => ({
    id: lead.id,
    source,
    name: source === "supabase" ? "Supabase lead" : "Demo lead",
    address: lead.address,
    style: lead.style ?? "—",
    budget: lead.budget ?? "—",
    timeline: lead.timeline ?? "—",
    subline: buildLeadSubline(lead),
  });
}

function SourceBadge({ source }: { source: LeadSource }) {
  if (source === "supabase") {
    return (
      <span className="inline-flex rounded-full border border-ec-sage/40 bg-ec-sage/10 px-2.5 py-0.5 text-xs font-medium text-ec-sage">
        Supabase lead
      </span>
    );
  }
  if (source === "demo") {
    return (
      <span className="inline-flex rounded-full border border-ec-forest/30 bg-ec-forest/10 px-2.5 py-0.5 text-xs font-medium text-ec-forest">
        Demo lead
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full border border-ec-border bg-ec-bg-subtle px-2.5 py-0.5 text-xs font-medium text-ec-text-muted">
      Mock lead
    </span>
  );
}
