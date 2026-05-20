"use client";

import { useEffect, useState } from "react";
import { BackyardScene } from "@/components/visualization/backyard-scene";
import type { BackyardComposition } from "@/lib/visualization/mock-render-engine";
import { PREMIUM_COPY } from "@/lib/visualization/property-context";
import type { VisualizationRenderViewModel } from "@/lib/visualization/render-layer";

export type ComparisonMode = "after" | "before" | "split";

type VisualizationCanvasProps = {
  viewModel: VisualizationRenderViewModel;
  mode: ComparisonMode;
  onModeChange: (mode: ComparisonMode) => void;
  isUpdating?: boolean;
};

export function VisualizationCanvas({
  viewModel,
  mode,
  onModeChange,
  isUpdating = false,
}: VisualizationCanvasProps) {
  const [split, setSplit] = useState(52);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false);
    const t = window.setTimeout(() => setFadeIn(true), 40);
    return () => window.clearTimeout(t);
  }, [viewModel.renderKey]);

  return (
    <section className="viz-canvas mt-6 sm:mt-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="font-display text-xl leading-snug text-ec-warm sm:text-2xl">
            {PREMIUM_COPY.heroTitle}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ec-text-muted">
            {viewModel.emotionalLine}. {viewModel.persistLine}
          </p>
        </div>
        <ComparisonTabs mode={mode} onModeChange={onModeChange} />
      </div>

      <div className="viz-canvas__frame relative overflow-hidden rounded-2xl border border-ec-border-subtle shadow-[var(--ec-shadow-lg)] sm:rounded-3xl">
        <div
          className={`viz-canvas__stage relative aspect-[4/5] w-full sm:aspect-[16/10] ${fadeIn ? "viz-canvas__stage--in" : ""}`}
          key={viewModel.renderKey}
        >
          {mode === "before" ? (
            <BackyardScene composition={viewModel.compositionBefore} />
          ) : null}

          {mode === "after" ? (
            <BackyardScene composition={viewModel.composition} />
          ) : null}

          {mode === "split" ? (
            <SplitCompare
              before={viewModel.compositionBefore}
              after={viewModel.composition}
              split={split}
              onSplitChange={setSplit}
            />
          ) : null}

          <CanvasOverlay viewModel={viewModel} mode={mode} />

          {isUpdating ? (
            <div className="viz-canvas__updating" aria-live="polite">
              <div className="viz-canvas__updating-pulse" />
              <p>{PREMIUM_COPY.updating}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ComparisonTabs({
  mode,
  onModeChange,
}: {
  mode: ComparisonMode;
  onModeChange: (m: ComparisonMode) => void;
}) {
  const tabs: { id: ComparisonMode; label: string }[] = [
    { id: "before", label: PREMIUM_COPY.beforeLabel },
    { id: "split", label: "Jämför" },
    { id: "after", label: PREMIUM_COPY.afterLabel },
  ];

  return (
    <div className="flex rounded-full border border-ec-border bg-ec-bg-elevated p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onModeChange(tab.id)}
          className={`rounded-full px-3 py-2 text-xs font-medium transition sm:px-4 ${
            mode === tab.id
              ? "bg-ec-forest text-ec-cream shadow-sm"
              : "text-ec-text-muted hover:text-ec-warm"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function SplitCompare({
  before,
  after,
  split,
  onSplitChange,
}: {
  before: BackyardComposition;
  after: BackyardComposition;
  split: number;
  onSplitChange: (n: number) => void;
}) {
  return (
    <div className="absolute inset-0">
      <BackyardScene composition={before} />
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
      >
        <BackyardScene composition={after} />
      </div>
      <div
        className="viz-canvas__split-handle"
        style={{ left: `${split}%` }}
        aria-hidden
      />
      <input
        type="range"
        min={8}
        max={92}
        value={split}
        onChange={(e) => onSplitChange(Number(e.target.value))}
        className="viz-canvas__split-input"
        aria-label="Dra för att jämföra före och efter"
      />
      <span className="viz-canvas__split-label viz-canvas__split-label--before">Före</span>
      <span className="viz-canvas__split-label viz-canvas__split-label--after">Efter</span>
    </div>
  );
}

function CanvasOverlay({
  viewModel,
  mode,
}: {
  viewModel: VisualizationRenderViewModel;
  mode: ComparisonMode;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
      <div className="viz-canvas__gradient" />
      <div className="relative z-10 p-4 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-ec-cream/70">
              {viewModel.propertyVibeLabel}
            </p>
            <p className="font-display mt-1 text-xl text-ec-cream sm:text-2xl">
              {viewModel.headline}
            </p>
            <p className="mt-1 text-xs text-ec-cream/75 sm:text-sm">{viewModel.subline}</p>
          </div>
          {mode === "after" || mode === "split" ? (
            <span className="rounded-full border border-ec-cream/25 bg-ec-ink/30 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ec-cream/90 backdrop-blur-sm">
              {viewModel.materialSummary}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
