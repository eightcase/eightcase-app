"use client";

import { useState } from "react";
import { BeforeAfterPresentation } from "@/components/visualisera/before-after-presentation";
import { PropertySatelliteAnalysis } from "@/components/visualisera/property-satellite-analysis";
import { SideViewConceptCard } from "@/components/visualisera/side-view-concept-card";
import {
  VisualizationCanvas,
  type ComparisonMode,
} from "@/components/visualization/visualization-canvas";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type { SideViewConcept } from "@/lib/ai-visualization/providers/types";
import type { VisualizationRenderViewModel } from "@/lib/visualization/render-layer";

export type VisualizationViewTab = "top-view" | "side-view" | "before-after";

type VisualizationViewTabsProps = {
  analysis: PropertyAnalysis;
  sideView: SideViewConcept;
  backyardViewModel: VisualizationRenderViewModel;
  styleLabel: string;
  isUpdating?: boolean;
};

export function VisualizationViewTabs({
  analysis,
  sideView,
  backyardViewModel,
  styleLabel,
  isUpdating = false,
}: VisualizationViewTabsProps) {
  const [tab, setTab] = useState<VisualizationViewTab>("top-view");
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("after");

  const tabs: { id: VisualizationViewTab; label: string }[] = [
    { id: "top-view", label: "Topvy" },
    { id: "side-view", label: "Sidovy" },
    { id: "before-after", label: "Före / efter" },
  ];

  return (
    <section className="mt-6 sm:mt-8">
      <div className="flex flex-wrap gap-2 border-b border-ec-border-subtle pb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-3.5 py-2 text-xs font-medium transition sm:px-4 ${
              tab === t.id
                ? "border-ec-forest/45 bg-ec-forest/10 text-ec-forest"
                : "border-transparent text-ec-text-muted hover:text-ec-warm"
            }`}
          >
            {t.label}
          </button>
        ))}
        {isUpdating ? (
          <span className="ml-auto self-center text-[11px] text-ec-sage">Uppdaterar visualisering…</span>
        ) : null}
      </div>

      <div className={`mt-4 transition-opacity duration-300 ${isUpdating ? "opacity-80" : ""}`}>
        {tab === "top-view" ? (
          <PropertySatelliteAnalysis analysis={analysis} />
        ) : null}
        {tab === "side-view" ? (
          <SideViewConceptCard sideView={sideView} analysis={analysis} />
        ) : null}
        {tab === "before-after" ? (
          <div className="space-y-4">
            <BeforeAfterPresentation styleLabel={styleLabel} />
            <VisualizationCanvas
              viewModel={backyardViewModel}
              mode={comparisonMode}
              onModeChange={setComparisonMode}
              isUpdating={isUpdating}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
