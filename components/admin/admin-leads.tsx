"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CrmLeadStatusBadge } from "@/components/admin/crm-lead-status-badge";
import { LeadDetailDrawer } from "@/components/admin/lead-detail-drawer";
import { clearDemoLeads, readDemoLeads } from "@/lib/admin/demo-leads";
import { MOCK_LEADS } from "@/lib/admin/mock-data";
import {
  isHotLead,
  matchesLeadFilter,
  mergeCrmLeads,
  qualityScoreLabel,
  readLeadStatusOverrides,
  saveLeadStatusOverride,
  type CrmLead,
  type LeadCrmStatus,
  type LeadFilter,
} from "@/lib/admin/lead-crm";
import { updateLeadCrmStatusInSupabase, tryReadLeadsFromSupabase } from "@/lib/admin/supabase-leads";
import type { StatusSaveState } from "@/components/admin/lead-detail-drawer";

const FILTERS: { id: LeadFilter; label: string }[] = [
  { id: "all", label: "Alla" },
  { id: "hot", label: "Heta leads" },
  { id: "new", label: "Nya" },
  { id: "booked", label: "Bokade" },
  { id: "supabase", label: "Supabase" },
];

export function AdminLeads() {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [filter, setFilter] = useState<LeadFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [statusSaveState, setStatusSaveState] = useState<StatusSaveState>({ phase: "idle" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [demoCount, setDemoCount] = useState(0);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    setInfoMessage(null);

    const overrides = readLeadStatusOverrides();
    const localDemo = readDemoLeads();
    setDemoCount(localDemo.length);

    const supabase = await tryReadLeadsFromSupabase(100);
    if (supabase.error) {
      setLoadError(`Supabase: ${supabase.error}`);
    } else if (supabase.configured && supabase.leads.length === 0) {
      setInfoMessage("Inga Supabase-leads ännu. Mock- och demodata visas tills funneln sparar.");
    }

    const merged = mergeCrmLeads({
      supabase: supabase.leads,
      demo: localDemo,
      mock: MOCK_LEADS,
      overrides,
    });

    setLeads(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    setStatusSaveState({ phase: "idle" });
  }, [selectedId]);

  const filteredLeads = useMemo(
    () => leads.filter((lead) => matchesLeadFilter(lead, filter)),
    [leads, filter],
  );

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedId) ?? null,
    [leads, selectedId],
  );

  const counts = useMemo(
    () => ({
      all: leads.length,
      hot: leads.filter(isHotLead).length,
      new: leads.filter((l) => l.crmStatus === "Ny").length,
      booked: leads.filter((l) => l.crmStatus === "Bokad").length,
      supabase: leads.filter((l) => l.source === "supabase").length,
    }),
    [leads],
  );

  const handleStatusChange = useCallback(
    async (statusKey: string, status: LeadCrmStatus) => {
      const target = leads.find((l) => l.statusKey === statusKey);
      if (!target) return;

      setLeads((prev) =>
        prev.map((lead) =>
          lead.statusKey === statusKey ? { ...lead, crmStatus: status } : lead,
        ),
      );

      if (target.source === "supabase") {
        setStatusSaveState({ phase: "saving" });
        const result = await updateLeadCrmStatusInSupabase(target.id, status);
        if (result.success) {
          setStatusSaveState({ phase: "success", message: result.message });
        } else {
          setStatusSaveState({ phase: "error", message: result.message });
        }
        return;
      }

      saveLeadStatusOverride(statusKey, status);
      setStatusSaveState({
        phase: "success",
        message: "Status sparad lokalt",
      });
    },
    [leads],
  );

  const handleCloseDrawer = useCallback(() => {
    setSelectedId(null);
    setStatusSaveState({ phase: "idle" });
  }, []);

  const handleClearDemoLeads = () => {
    const ok = window.confirm("Rensa alla demo leads från denna webbläsare?");
    if (!ok) return;
    clearDemoLeads();
    void loadLeads();
    setInfoMessage("Demo leads rensade.");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-medium text-ec-warm">Leads</h1>
          <p className="text-sm text-ec-text-muted">
            CRM-vy över visualiseringsförfrågningar — klicka en rad för detaljer
          </p>
        </div>
        {demoCount > 0 ? (
          <button
            type="button"
            onClick={handleClearDemoLeads}
            className="btn-secondary inline-flex h-8 items-center rounded-md px-3 text-xs font-medium text-ec-text-muted hover:text-ec-ink"
          >
            Rensa demo leads ({demoCount})
          </button>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              filter === f.id
                ? "border-ec-forest/40 bg-ec-forest/10 text-ec-forest"
                : "border-ec-border bg-ec-bg-elevated text-ec-text-muted hover:border-ec-border-subtle hover:text-ec-warm"
            }`}
          >
            {f.label}
            <span className="text-[10px] opacity-70">({counts[f.id]})</span>
          </button>
        ))}
      </div>

      {loading ? <LeadsLoadingState /> : null}
      {!loading && loadError ? (
        <div className="mb-3 rounded-lg border border-amber-600/30 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {loadError}
        </div>
      ) : null}
      {!loading && infoMessage ? (
        <div className="mb-3 rounded-lg border border-ec-border-subtle bg-ec-bg-subtle/50 px-4 py-2 text-xs text-ec-text-muted">
          {infoMessage}
        </div>
      ) : null}

      {!loading && leads.length === 0 ? <LeadsEmptyState variant="none" /> : null}

      {!loading && leads.length > 0 && filteredLeads.length === 0 ? (
        <LeadsEmptyState variant="filter" filter={filter} onClearFilter={() => setFilter("all")} />
      ) : null}

      {!loading && filteredLeads.length > 0 ? (
        <div className="admin-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead>
                <tr className="border-b border-ec-border bg-ec-bg-subtle/80 text-xs uppercase tracking-wider text-ec-text-dim">
                  <th className="px-4 py-2.5 font-medium">Lead</th>
                  <th className="px-4 py-2.5 font-medium">Adress</th>
                  <th className="px-4 py-2.5 font-medium">Budget</th>
                  <th className="px-4 py-2.5 font-medium">Kvalitet</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Källa</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.statusKey}
                    onClick={() => setSelectedId(lead.id)}
                    className={`cursor-pointer border-b border-ec-border-subtle transition hover:bg-ec-bg-subtle/60 ${
                      selectedId === lead.id ? "bg-ec-sage/5" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-ec-warm">{lead.displayName}</span>
                      {isHotLead(lead) ? (
                        <span className="ml-2 inline-flex rounded-full border border-amber-600/30 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                          Het
                        </span>
                      ) : null}
                      <p className="mt-0.5 text-xs text-ec-text-dim">
                        {lead.style ?? "—"} · {lead.timeline ?? "—"}
                      </p>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-ec-text-muted">
                      {lead.address}
                    </td>
                    <td className="px-4 py-3 text-ec-text-muted">{lead.budget ?? "—"}</td>
                    <td className="px-4 py-3">
                      <QualityScorePill score={lead.qualityScore} />
                    </td>
                    <td className="px-4 py-3">
                      <CrmLeadStatusBadge status={lead.crmStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <SourceBadge source={lead.source} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <LeadDetailDrawer
        lead={selectedLead}
        onClose={handleCloseDrawer}
        statusSaveState={statusSaveState}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

function QualityScorePill({ score }: { score: number }) {
  const label = qualityScoreLabel(score);
  const tone =
    score >= 75
      ? "border-amber-600/30 bg-amber-50 text-amber-900"
      : score >= 50
        ? "border-ec-sage/35 bg-ec-sage/10 text-ec-sage"
        : "border-ec-border bg-ec-bg-subtle text-ec-text-muted";

  return (
    <span className={`inline-flex flex-col rounded-md border px-2 py-1 text-xs font-medium ${tone}`}>
      <span>{score}</span>
      <span className="text-[10px] font-normal opacity-80">{label}</span>
    </span>
  );
}

function SourceBadge({ source }: { source: CrmLead["source"] }) {
  if (source === "supabase") {
    return (
      <span className="inline-flex rounded-full border border-ec-sage/40 bg-ec-sage/10 px-2.5 py-0.5 text-xs font-medium text-ec-sage">
        Supabase
      </span>
    );
  }
  if (source === "demo") {
    return (
      <span className="inline-flex rounded-full border border-ec-forest/30 bg-ec-forest/10 px-2.5 py-0.5 text-xs font-medium text-ec-forest">
        Demo
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full border border-ec-border bg-ec-bg-subtle px-2.5 py-0.5 text-xs font-medium text-ec-text-muted">
      Mock
    </span>
  );
}

function LeadsLoadingState() {
  return (
    <div className="admin-panel overflow-hidden" aria-busy="true" aria-label="Laddar leads">
      <div className="border-b border-ec-border-subtle px-4 py-3">
        <div className="h-4 w-40 animate-pulse rounded bg-ec-bg-subtle" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 border-b border-ec-border-subtle px-4 py-4 last:border-0"
        >
          <div className="h-4 flex-1 animate-pulse rounded bg-ec-bg-subtle" />
          <div className="h-4 w-32 animate-pulse rounded bg-ec-bg-subtle" />
          <div className="h-4 w-20 animate-pulse rounded bg-ec-bg-subtle" />
        </div>
      ))}
      <p className="px-4 py-3 text-xs text-ec-text-dim">Hämtar leads från Supabase och lokala källor…</p>
    </div>
  );
}

function LeadsEmptyState({
  variant,
  filter,
  onClearFilter,
}: {
  variant: "none" | "filter";
  filter?: LeadFilter;
  onClearFilter?: () => void;
}) {
  const filterLabel = FILTERS.find((f) => f.id === filter)?.label ?? filter;

  return (
    <div className="admin-panel flex flex-col items-center px-6 py-14 text-center">
      <p className="text-sm font-medium text-ec-warm">
        {variant === "none" ? "Inga leads ännu" : "Inga leads i det här filtret"}
      </p>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ec-text-muted">
        {variant === "none"
          ? "När någon slutför visualiseringsfunneln på webben visas leads här. Testa /visualisera eller vänta på första Supabase-sparningen."
          : `Inga träffar för «${filterLabel}». Prova ett annat filter eller visa alla leads.`}
      </p>
      {variant === "filter" && onClearFilter ? (
        <button
          type="button"
          onClick={onClearFilter}
          className="btn-secondary mt-6 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
        >
          Visa alla leads
        </button>
      ) : null}
    </div>
  );
}
