"use client";

import { useEffect } from "react";
import { DrainageFunnel } from "@/components/drainage/drainage-funnel";
import type { PriceEstimate } from "@/lib/visualisera/types";
import type { UpsellOrigin } from "@/lib/upsell/types";

type DrainageOverlayProps = {
  open: boolean;
  onClose: () => void;
  origin: UpsellOrigin;
  poolEstimate: PriceEstimate | null;
  onComplete?: (assessment: import("@/lib/drainage/types").DrainageAssessment) => void;
};

export function DrainageOverlay({
  open,
  onClose,
  origin,
  poolEstimate,
  onComplete,
}: DrainageOverlayProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="upsell-overlay-backdrop absolute inset-0 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Stäng"
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="drainage-funnel-title"
        className="upsell-overlay-panel zone-funnel relative flex max-h-[94vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl sm:max-h-[90vh] sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-ec-border bg-ec-bg-elevated px-5 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-ec-sage">
              Dräneringsanalys
            </p>
            <p id="drainage-funnel-title" className="text-sm text-ec-text-muted">
              {origin === "pool" ? "Kompletterar din poolvisualisering" : "Fristående bedömning"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-ec-border text-ec-text-muted transition hover:bg-ec-bg-subtle hover:text-ec-ink"
            aria-label="Stäng"
          >
            ×
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
          <DrainageFunnel
            origin={origin}
            poolEstimate={poolEstimate}
            onClose={onClose}
            onComplete={onComplete}
          />
        </div>
      </div>
    </div>
  );
}
