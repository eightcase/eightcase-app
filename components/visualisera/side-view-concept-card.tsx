"use client";

import type { CSSProperties } from "react";
import type { SideViewConcept } from "@/lib/ai-visualization/providers/types";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";

type SideViewConceptCardProps = {
  sideView: SideViewConcept;
  analysis?: PropertyAnalysis | null;
  className?: string;
};

export function SideViewConceptCard({
  sideView,
  analysis,
  className = "",
}: SideViewConceptCardProps) {
  const depthPct = Math.min(85, sideView.depthMeters * 35);

  return (
    <div className={`funnel-card overflow-hidden p-0 ${className}`}>
      <div className="border-b border-ec-border-subtle px-4 py-3 sm:px-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
          Sidovy · koncept
        </p>
        <p className="mt-1 font-display text-lg text-ec-warm sm:text-xl">{sideView.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-ec-text-muted">{sideView.summary}</p>
      </div>

      <div
        className="relative aspect-[16/9] bg-gradient-to-b from-[#b8c8d8] to-[#e8eef4]"
        style={{ "--side-water": sideView.waterColor } as CSSProperties}
      >
        <div className="absolute inset-x-[8%] bottom-0 h-[18%] rounded-t-lg bg-[#6b7a62]/90" />
        <div
          className="absolute bottom-[16%] left-[12%] right-[12%] rounded-t-md border border-black/10"
          style={{
            height: `${depthPct}%`,
            background: `linear-gradient(180deg, ${sideView.deckMaterial === "betong" ? "#9a9a96" : "#9a7d5c"} 0%, ${sideView.deckMaterial === "betong" ? "#7a7a76" : "#7a6348"} 100%)`,
          }}
        />
        <div
          className="absolute bottom-[18%] left-[22%] right-[22%] overflow-hidden rounded-t-xl border border-ec-cream/20"
          style={{ height: `${depthPct * 0.55}%` }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${sideView.waterColor} 0%, #1e3a42 100%)`,
            }}
          />
          <div className="absolute inset-x-[10%] top-[15%] h-[20%] rounded-full bg-white/25 blur-md" />
        </div>
        {analysis ? (
          <div className="absolute left-3 top-3 rounded-md bg-ec-ink/50 px-2 py-1 text-[10px] text-ec-cream backdrop-blur-sm">
            Orientering: {analysis.suggestedPoolPlacement.orientation}
          </div>
        ) : null}
      </div>

      <p className="border-t border-ec-border-subtle px-4 py-3 text-[11px] leading-relaxed text-ec-text-dim sm:px-5">
        Första vyn baseras på satellitbild. Sidovyn är en AI-genererad konceptvy — inte en
        exakt bygglovsritning.
      </p>
    </div>
  );
}
