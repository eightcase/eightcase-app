"use client";

import { MOCK_COMPANY, type Campaign } from "@/lib/admin/mock-data";

type CampaignFlyerPreviewProps = {
  campaign: Campaign;
};

export function CampaignFlyerPreview({ campaign }: CampaignFlyerPreviewProps) {
  const areaName = campaign.area.split("·")[0]?.trim() ?? campaign.area;

  return (
    <aside className="admin-panel overflow-hidden lg:sticky lg:top-6">
      <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-ec-sage">
        Flyer-förhandsvisning
      </p>
      <p className="mt-1 text-xs text-ec-text-muted">
        {campaign.name} · redo att skrivas ut
      </p>

      <div className="mt-4 overflow-hidden rounded-lg border border-ec-border-subtle bg-ec-cream shadow-[var(--ec-shadow)]">
        <div
          className="aspect-[210/297] max-h-[min(520px,70vh)] w-full p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(165deg, #f7f4ee 0%, #ebe6dc 45%, #e8e3d9 100%)",
          }}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div
                className="flex h-10 w-24 items-center justify-center rounded border border-dashed border-ec-border bg-white/60"
                aria-hidden
              >
                <span className="font-display text-[10px] text-ec-text-muted">
                  Er logotyp
                </span>
              </div>
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-ec-border bg-white text-[8px] font-medium uppercase tracking-wider text-ec-text-dim"
                aria-hidden
              >
                QR
              </div>
            </div>

            <p className="mt-6 text-[9px] font-medium uppercase tracking-[0.28em] text-ec-sage">
              {MOCK_COMPANY.companyName}
            </p>
            <h2 className="font-display mt-2 text-[1.35rem] leading-[1.12] text-ec-forest">
              Vi bygger i ditt område
            </h2>
            <p className="mt-1.5 text-[11px] text-ec-text-muted">{areaName}</p>

            <div className="mt-5 grid flex-1 grid-cols-2 gap-1.5 overflow-hidden rounded-md border border-ec-border-subtle">
              <div className="relative min-h-[72px] bg-gradient-to-br from-[#2a2826] to-[#141412]">
                <span className="absolute left-1.5 top-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[7px] uppercase text-white/70">
                  Före
                </span>
              </div>
              <div className="relative min-h-[72px] bg-gradient-to-bl from-[#3a4540] to-[#1a2018]">
                <span className="absolute right-1.5 top-1.5 rounded border border-ec-sage/40 bg-ec-sage/20 px-1.5 py-0.5 text-[7px] uppercase text-ec-cream">
                  Efter
                </span>
              </div>
            </div>

            <p className="mt-5 text-center font-display text-[13px] leading-snug text-ec-ink">
              Se hur din framtida pool kan se ut
            </p>
            <p className="mt-2 text-center text-[9px] leading-relaxed text-ec-text-muted">
              Skanna QR-koden · AI-visualisering · personlig offert
            </p>

            <div className="mt-auto border-t border-ec-border-subtle pt-4 text-center text-[9px] text-ec-text-dim">
              <p className="font-medium text-ec-ink-muted">{MOCK_COMPANY.phone}</p>
              <p className="mt-0.5">erpool.se · {areaName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => window.alert("PDF-export kommer i en senare version (demo).")}
          className="btn-secondary flex h-9 flex-1 items-center justify-center rounded-md text-xs font-medium"
        >
          Ladda ner PDF
        </button>
        <button
          type="button"
          onClick={() => window.alert("Utskick beställs via er kontaktperson (demo).")}
          className="btn-primary flex h-9 flex-1 items-center justify-center rounded-md text-xs font-medium"
        >
          Beställ utskick
        </button>
      </div>
    </aside>
  );
}
