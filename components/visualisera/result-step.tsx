"use client";

import { DrainageUpsellSection } from "@/components/drainage/drainage-upsell-section";
import { ResultContactCard } from "@/components/visualisera/result-contact-card";
import type { LeadContactInput } from "@/lib/visualisera/lead-contact";
import { PoolScene } from "@/components/pool-scene";
import { PropertyPreview } from "@/components/visualisera/property-preview";
import type { DrainageAssessment } from "@/lib/drainage/types";
import { buildCoordinatedSummary } from "@/lib/upsell/coordinated";
import {
  formatFinancingFrom,
  getNearbyProjects,
  PROJECT_TIMELINE,
  TRUST_ITEMS,
} from "@/lib/visualisera/result-mock";
import type { FunnelState } from "@/lib/visualisera/types";
import type { calculateEstimate } from "@/lib/visualisera/pricing";

function formatKr(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

type LeadSaveStatus = "idle" | "saving" | "demo" | "supabase" | "error";

type SupabaseConfigStatus = {
  hasUrl: boolean;
  hasAnonKey: boolean;
  configured: boolean;
  hasCompanyId: boolean;
};

type ResultStepProps = {
  state: FunnelState;
  estimate: ReturnType<typeof calculateEstimate>;
  priceRange: string;
  monthlyRange: string;
  emailSent: boolean;
  drainageAssessment: DrainageAssessment | null;
  leadSaveStatus: LeadSaveStatus;
  leadSaveDetail: string | null;
  supabaseConfig: SupabaseConfigStatus;
  contactSubmitted: boolean;
  submittedContact: { name: string; preferredContactMethod: "Telefon" | "E-post" } | null;
  contactSaving: boolean;
  onContactSubmit: (contact: LeadContactInput & { consentTimestamp: string }) => void;
  visualizationUrl: string | null;
  onOpenDrainage: () => void;
  onBook: () => void;
  onEmail: () => void;
};

function yesNo(value: boolean): string {
  return value ? "ja" : "nej";
}

function saveStatusLabel(status: LeadSaveStatus): string {
  switch (status) {
    case "idle":
      return "väntar";
    case "saving":
      return "sparar…";
    case "supabase":
      return "Supabase";
    case "demo":
      return "demo (localStorage)";
    case "error":
      return "fel";
    default:
      return status;
  }
}

export function ResultStep({
  state,
  estimate,
  priceRange,
  monthlyRange,
  emailSent,
  drainageAssessment,
  leadSaveStatus,
  leadSaveDetail,
  supabaseConfig,
  contactSubmitted,
  submittedContact,
  contactSaving,
  onContactSubmit,
  visualizationUrl,
  onOpenDrainage,
  onBook,
  onEmail,
}: ResultStepProps) {
  const shortAddress = state.address.split(",")[0] ?? state.address;
  const mid = Math.round((estimate.min + estimate.max) / 2);
  const valueLow = Math.round(mid * 0.12);
  const valueHigh = Math.round(mid * 0.18);
  const coordinated = drainageAssessment
    ? buildCoordinatedSummary(estimate, drainageAssessment)
    : null;
  const nearbyProjects = getNearbyProjects(shortAddress);

  return (
    <div className="relative -mx-2 sm:-mx-4">
      <header className="funnel-result-reveal text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-ec-sage">
          Din visualisering är klar
        </p>
        <h1 className="font-display mt-4 text-[2.15rem] leading-[1.05] text-ec-warm sm:text-[2.85rem]">
          Ditt premiumförslag
        </h1>
        <p className="mt-2 text-base text-ec-text-muted">Visualisering för: {state.address}</p>
      </header>

      <div className="funnel-result-reveal funnel-result-reveal-delay-1 relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl border border-ec-border shadow-[var(--ec-shadow-lg)] sm:mt-12 sm:aspect-[16/10]">
        <div className="absolute inset-0 grid grid-cols-2">
          <div className="relative border-r border-ec-border-subtle">
            <PoolScene variant="before" />
            <span className="absolute left-4 top-4 rounded-full bg-ec-forest/75 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ec-cream/90 backdrop-blur-sm">
              Före
            </span>
          </div>
          <div className="relative">
            <PoolScene variant="after" />
            <span className="absolute right-4 top-4 rounded-full border border-ec-sage/40 bg-ec-sage/25 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-ec-cream backdrop-blur-sm">
              Efter
            </span>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ec-forest-deep/95 via-ec-forest/60 to-transparent px-5 pb-5 pt-20">
          <p className="text-sm font-medium text-ec-cream">
            {state.style} · {state.size}
          </p>
          <p className="mt-1 text-xs text-ec-cream/75">
            AI-genererat för din tomt · redo för rådgivning
          </p>
        </div>
      </div>

      <div className="funnel-result-reveal funnel-result-reveal-delay-2 mt-10">
        <p className="text-xs uppercase tracking-[0.2em] text-ec-text-dim">Uppskattad investering</p>
        <p className="font-display mt-2 text-4xl tracking-tight text-ec-warm sm:text-5xl">
          {priceRange}
        </p>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ec-text-muted">
          Indikativt prisspann baserat på vald stil, storlek och tillval. En skriftlig offert
          fastställs efter platsbesök.
        </p>
      </div>

      <div className="funnel-result-reveal mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
          Fastighetsunderlag
        </p>
        <PropertyPreview address={state.address} className="mt-3 aspect-[16/8]" />
      </div>

      <div className="funnel-result-reveal funnel-result-reveal-delay-3 mt-8 grid gap-3 sm:grid-cols-2">
        <ProposalCard
          title="Möjlig värdeökning på bostaden"
          value={`+${formatKr(valueLow)} – ${formatKr(valueHigh)} kr`}
          helper="Baserat på typ av projekt, område och upplevd standardhöjning."
        />
        <ProposalCard
          title="Månadsfinansiering"
          value={formatFinancingFrom(estimate.monthlyMin)}
          helper={`Indikativt finansieringsintervall: ${monthlyRange}`}
        />
      </div>

      <div className="funnel-result-reveal funnel-result-reveal-delay-4 funnel-card mt-4 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
          Uppskattad tidsplan
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PROJECT_TIMELINE.map((phase, i) => (
            <div
              key={phase.label}
              className="rounded-xl border border-ec-border-subtle bg-ec-bg-subtle/50 px-4 py-3"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-ec-text-dim">
                Steg {i + 1}
              </p>
              <p className="mt-1 font-medium text-ec-warm">{phase.label}</p>
              <p className="mt-0.5 text-xs text-ec-text-muted">{phase.duration}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="funnel-result-reveal mt-8">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
          Liknande projekt i närheten
        </p>
        <div className="mt-4 grid gap-3">
          {nearbyProjects.map((project, idx) => (
            <article key={project.id} className="funnel-card overflow-hidden p-0">
              <div className="grid min-h-28 grid-cols-[108px_1fr]">
                <div
                  className={`relative ${
                    idx % 2 === 0
                      ? "bg-gradient-to-bl from-[#3a4540] to-[#1a2018]"
                      : "bg-gradient-to-br from-[#2a2826] to-[#141412]"
                  }`}
                >
                  <span className="absolute left-2 top-2 rounded bg-black/45 px-2 py-0.5 text-[9px] uppercase text-white/75">
                    Projekt
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-medium text-ec-warm">{project.title}</p>
                  <p className="mt-1 text-xs text-ec-text-muted">
                    {project.location} · {project.style}
                  </p>
                  <p className="font-display mt-2 text-xl text-ec-warm">{project.valueLabel}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="funnel-result-reveal mt-8 grid gap-2 sm:grid-cols-2">
        {TRUST_ITEMS.map((item) => (
          <div
            key={item}
            className="rounded-full border border-ec-border-subtle bg-ec-bg-elevated px-4 py-2 text-center text-xs font-medium text-ec-ink-muted sm:text-left"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="funnel-result-reveal funnel-result-reveal-delay-4 funnel-card mt-4 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
          AI-genererad visualisering
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ec-text-muted">
          Konceptet är framtaget från adress, valt uttryck och dina tillval för att visa hur
          projektet kan fungera på just din fastighet.
        </p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <SummaryRow label="Adress" value={shortAddress} />
          <SummaryRow label="Poolstil" value={state.style ?? "—"} />
          <SummaryRow label="Storlek" value={state.size ?? "—"} />
          <SummaryRow
            label="Valda tillval"
            value={state.features.length > 0 ? `${state.features.length} st` : "Inga valda"}
          />
        </div>
      </div>

      <div className="funnel-result-reveal funnel-result-reveal-delay-4 funnel-card mt-4 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
          Sammanfattning
        </p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <SummaryRow label="Stil" value={state.style ?? "—"} />
          <SummaryRow label="Storlek" value={state.size ?? "—"} />
          <SummaryRow label="Budget" value={state.budget ?? "—"} />
          <SummaryRow label="Tidsplan" value={state.timeline ?? "—"} />
          <SummaryRow
            className="sm:col-span-2"
            label="Tillval"
            value={state.features.length > 0 ? state.features.join(", ") : "Inga valda"}
          />
        </div>
      </div>

      {coordinated ? (
        <div className="funnel-result-reveal mt-8 space-y-3">
          <div className="funnel-card p-5">
            <p className="text-xs uppercase tracking-wider text-ec-text-dim">
              Sammanlagt pool + dränering
            </p>
            <p className="font-display mt-2 text-2xl text-ec-warm">{coordinated.combinedRange}</p>
            <p className="mt-2 text-xs text-ec-text-muted">
              Dränering: {coordinated.drainageRange}
            </p>
          </div>
          <div className="rounded-xl border border-ec-sage/20 bg-ec-sage/5 px-4 py-4">
            <p className="text-sm leading-relaxed text-ec-warm">{coordinated.savingsLabel}</p>
          </div>
        </div>
      ) : null}

      <DrainageUpsellSection onOpen={onOpenDrainage} completed={!!drainageAssessment} />

      {visualizationUrl ? (
        <div className="funnel-result-reveal mt-10 text-center">
          <a
            href={visualizationUrl}
            className="btn-funnel inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium shadow-lg shadow-black/20"
          >
            Öppna min visualisering
          </a>
          <p className="mt-3 text-xs text-ec-text-dim">
            Din personliga sida — spara länken och justera när som helst.
          </p>
        </div>
      ) : null}

      <div className="mt-10">
        <ResultContactCard
          disabled={contactSaving}
          saving={contactSaving}
          submitted={contactSubmitted}
          submittedContact={submittedContact}
          onSubmit={onContactSubmit}
        />
      </div>

      <div className="funnel-result-reveal funnel-result-reveal-delay-4 mt-10 space-y-3">
        {contactSubmitted && leadSaveStatus === "supabase" ? (
          <div className="rounded-full border border-ec-sage/35 bg-ec-sage/10 px-4 py-2 text-center text-xs font-medium text-ec-sage">
            Lead sparad i Supabase
          </div>
        ) : null}
        {contactSubmitted && leadSaveStatus === "demo" ? (
          <div className="rounded-full border border-ec-border bg-ec-cream/5 px-4 py-2 text-center text-xs font-medium text-ec-text-muted">
            Lead sparad i demoportalen (endast denna webbläsare)
          </div>
        ) : null}
        {contactSubmitted && leadSaveStatus === "error" ? (
          <div className="rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-center text-xs font-medium text-red-200">
            Kunde inte spara lead
          </div>
        ) : null}
        {contactSubmitted ? (
          <div
            className="rounded-xl border border-ec-border/70 bg-ec-cream/5 px-4 py-3 text-[11px] leading-relaxed text-ec-text-muted"
            aria-live="polite"
          >
            <p className="font-medium uppercase tracking-wider text-ec-text-dim">Sparstatus</p>
            <ul className="mt-2 space-y-1">
              <li>Supabase konfigurerad: {yesNo(supabaseConfig.configured)}</li>
              <li>Sparresultat: {saveStatusLabel(leadSaveStatus)}</li>
            </ul>
            {leadSaveDetail ? (
              <p className="mt-2 break-words text-ec-text-dim">Detalj: {leadSaveDetail}</p>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onBook}
          className="btn-funnel flex h-14 w-full items-center justify-center text-base font-medium shadow-lg shadow-black/20"
        >
          Boka kostnadsfri konsultation
        </button>
        <button
          type="button"
          onClick={onEmail}
          disabled={emailSent}
          className="btn-secondary flex h-12 w-full items-center justify-center rounded-full text-sm font-medium disabled:opacity-50"
        >
          {emailSent
            ? "Visualisering skickad till din e-post"
            : "Skicka visualiseringen till min e-post"}
        </button>
      </div>

      <p className="mt-8 text-center text-[11px] leading-relaxed text-ec-text-dim">
        Priserna är indikativa och ersätter inte en skriftlig offert.
      </p>
    </div>
  );
}

function ProposalCard({ title, value, helper }: { title: string; value: string; helper: string }) {
  return (
    <div className="funnel-card p-5">
      <p className="text-xs uppercase tracking-wider text-ec-text-dim">{title}</p>
      <p className="font-display mt-3 text-2xl text-ec-warm">{value}</p>
      <p className="mt-2 text-xs leading-relaxed text-ec-text-muted">{helper}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-ec-text-dim">{label}</p>
      <p className="mt-0.5 font-medium text-ec-warm">{value}</p>
    </div>
  );
}
