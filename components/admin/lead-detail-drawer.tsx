"use client";

import { useEffect } from "react";
import { CrmLeadStatusBadge } from "@/components/admin/crm-lead-status-badge";
import {
  formatKrRange,
  formatLeadDate,
  LEAD_CRM_STATUSES,
  type CrmLead,
  type LeadCrmStatus,
} from "@/lib/admin/lead-crm";

export type StatusSaveState =
  | { phase: "idle" }
  | { phase: "saving" }
  | { phase: "success"; message: string }
  | { phase: "error"; message: string };

type LeadDetailDrawerProps = {
  lead: CrmLead | null;
  onClose: () => void;
  statusSaveState: StatusSaveState;
  onStatusChange: (
    statusKey: string,
    status: LeadCrmStatus,
  ) => void | Promise<void>;
};

export function LeadDetailDrawer({
  lead,
  onClose,
  statusSaveState,
  onStatusChange,
}: LeadDetailDrawerProps) {
  useEffect(() => {
    if (!lead) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lead, onClose]);

  if (!lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-ec-ink/25 backdrop-blur-[2px]"
        aria-label="Stäng leaddetaljer"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col border-l border-ec-border bg-ec-bg-elevated shadow-[var(--ec-shadow-lg)]">
        <header className="flex items-start justify-between gap-3 border-b border-ec-border-subtle px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-ec-text-dim">Lead</p>
            <h2 className="mt-1 truncate font-medium text-ec-warm">{lead.displayName}</h2>
            <p className="mt-1 text-sm text-ec-text-muted">{lead.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium"
          >
            Stäng
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <section className="flex flex-wrap items-center gap-2">
            <SourceChip source={lead.source} />
            <CrmLeadStatusBadge status={lead.crmStatus} />
            <span className="inline-flex rounded-full border border-amber-600/25 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-900">
              Kvalitet {lead.qualityScore}/100
            </span>
          </section>

          <section>
            <label
              htmlFor="crm-status-select"
              className="text-xs font-medium uppercase tracking-wider text-ec-text-dim"
            >
              Status
            </label>
            <select
              id="crm-status-select"
              value={lead.crmStatus}
              onChange={(e) =>
                onStatusChange(lead.statusKey, e.target.value as LeadCrmStatus)
              }
              className="admin-panel mt-2 w-full px-3 py-2.5 text-sm text-ec-warm focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
            >
              {LEAD_CRM_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <StatusSaveFeedback lead={lead} state={statusSaveState} />
          </section>

          <DetailSection title="Projekt">
            <DetailRow label="Stil" value={lead.style ?? "—"} />
            <DetailRow label="Storlek" value={lead.size ?? "—"} />
            <DetailRow label="Budget" value={lead.budget ?? "—"} />
            <DetailRow label="Tidsplan" value={lead.timeline ?? "—"} />
            <DetailRow
              label="Tillval"
              value={lead.features.length > 0 ? lead.features.join(", ") : "Inga valda"}
            />
          </DetailSection>

          <DetailSection title="Ekonomi">
            <DetailRow
              label="Uppskattat pris"
              value={formatKrRange(lead.estimatedPrice.min, lead.estimatedPrice.max)}
            />
            <DetailRow
              label="Värdeökning fastighet"
              value={formatKrRange(
                lead.estimatedPropertyValueIncrease.min,
                lead.estimatedPropertyValueIncrease.max,
              )}
            />
          </DetailSection>

          <DetailSection title="Dräneringsintresse">
            {lead.drainageUpsell ? (
              <>
                <DetailRow label="Risknivå" value={lead.drainageUpsell.riskLevel} />
                <DetailRow
                  label="Dräneringsintervall"
                  value={formatKrRange(
                    lead.drainageUpsell.drainageMin,
                    lead.drainageUpsell.drainageMax,
                  )}
                />
                <p className="text-sm leading-relaxed text-ec-text-muted">
                  {lead.drainageUpsell.recommendation}
                </p>
              </>
            ) : (
              <p className="text-sm text-ec-text-muted">Ingen dräneringsanalys ännu.</p>
            )}
          </DetailSection>

          <DetailSection title="Metadata">
            <DetailRow label="Skapad" value={formatLeadDate(lead.createdAt)} />
            <DetailRow label="Källa" value={sourceLabel(lead.source)} />
            {lead.campaign ? <DetailRow label="Kampanj" value={lead.campaign} /> : null}
          </DetailSection>
        </div>
      </aside>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">{title}</h3>
      <div className="mt-3 space-y-2.5">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-ec-text-dim">{label}</span>
      <span className="text-right font-medium text-ec-warm">{value}</span>
    </div>
  );
}

function SourceChip({ source }: { source: CrmLead["source"] }) {
  const styles =
    source === "supabase"
      ? "border-ec-sage/40 bg-ec-sage/10 text-ec-sage"
      : source === "demo"
        ? "border-ec-forest/30 bg-ec-forest/10 text-ec-forest"
        : "border-ec-border bg-ec-bg-subtle text-ec-text-muted";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {sourceLabel(source)}
    </span>
  );
}

function sourceLabel(source: CrmLead["source"]): string {
  if (source === "supabase") return "Supabase";
  if (source === "demo") return "Demo";
  return "Mock";
}

function StatusSaveFeedback({
  lead,
  state,
}: {
  lead: CrmLead;
  state: StatusSaveState;
}) {
  if (state.phase === "idle") {
    return (
      <p className="mt-2 text-[11px] text-ec-text-dim">
        {lead.source === "supabase"
          ? "Status sparas i Supabase."
          : "Status sparas lokalt i denna webbläsare."}
      </p>
    );
  }

  if (state.phase === "saving") {
    return (
      <p className="mt-2 text-[11px] text-ec-text-muted" aria-live="polite">
        Sparar status…
      </p>
    );
  }

  if (state.phase === "success") {
    return (
      <p
        className="mt-2 text-[11px] text-ec-sage"
        role="status"
        aria-live="polite"
      >
        {state.message}
      </p>
    );
  }

  return (
    <p className="mt-2 text-[11px] text-red-600/90" role="alert" aria-live="assertive">
      {state.message}
    </p>
  );
}
