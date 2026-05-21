"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatedMetrics } from "@/components/visualization/animated-metrics";
import { VisualizationViewTabs } from "@/components/visualization/visualization-view-tabs";
import type { SideViewConcept } from "@/lib/ai-visualization/providers/types";
import { resolveVisualizationAnalysis } from "@/lib/visualization/analysis-context";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import { EDITOR_FEATURES } from "@/lib/visualization/editor-features";
import { mockVisualizationRenderLayer } from "@/lib/visualization/render-layer";
import { PREMIUM_COPY } from "@/lib/visualization/property-context";
import {
  applyEditorPatch,
  buildVisualizationSnapshot,
  toggleEditorFeature,
} from "@/lib/visualization/state";
import type { VisualizationEditorState } from "@/lib/visualization/types";
import { POOL_STYLES, POOL_SIZES } from "@/lib/visualisera/constants";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";

type VisualizationEditorProps = {
  leadId: string;
  initialEditor: VisualizationEditorState;
  onSaveRevision: (editor: VisualizationEditorState) => Promise<{ success: boolean; message: string }>;
};

export function VisualizationEditor({
  leadId,
  initialEditor,
  onSaveRevision,
}: VisualizationEditorProps) {
  const [editor, setEditor] = useState(initialEditor);
  const [propertyAnalysis, setPropertyAnalysis] = useState<PropertyAnalysis | null>(null);
  const [sideView, setSideView] = useState<SideViewConcept | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [versionFlash, setVersionFlash] = useState(false);

  const snapshot = useMemo(() => buildVisualizationSnapshot(editor), [editor]);
  const viewModel = useMemo(
    () => mockVisualizationRenderLayer.describe(snapshot.render),
    [snapshot.render],
  );

  useEffect(() => {
    let cancelled = false;
    setAnalysisLoading(true);
    void resolveVisualizationAnalysis(editor).then((ctx) => {
      if (cancelled) return;
      setPropertyAnalysis(ctx.propertyAnalysis);
      setSideView(ctx.sideView);
      setAnalysisLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [editor.address, editor.style, editor.size, editor.featureIds.join(",")]);

  const persist = useCallback(
    async (next: VisualizationEditorState) => {
      setSaving(true);
      setSaveMessage(null);
      const result = await onSaveRevision(next);
      setSaving(false);
      if (result.success) {
        setVersionFlash(true);
        setSaveMessage("Version uppdaterad");
        window.setTimeout(() => setVersionFlash(false), 2400);
      } else {
        setSaveMessage(result.message);
      }
    },
    [onSaveRevision],
  );

  const patch = (next: VisualizationEditorState) => {
    setEditor(next);
    void persist(next);
  };

  return (
    <div className="zone-funnel min-h-screen text-ec-text">
      <div className="mx-auto max-w-5xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-10">
        <header className="text-center sm:text-left">
          <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-ec-sage sm:text-[11px]">
            Din framtida bakgård
          </p>
          <h1 className="font-display mt-3 text-[1.75rem] leading-[1.1] text-ec-warm sm:text-4xl">
            {PREMIUM_COPY.heroTitle}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ec-text-muted sm:mx-0">
            {viewModel.propertyTagline}. {viewModel.persistLine}
          </p>
        </header>

        {versionFlash ? (
          <div
            className="mx-auto mt-4 max-w-md rounded-full border border-ec-sage/40 bg-ec-sage/10 px-4 py-2 text-center text-sm font-medium text-ec-sage sm:ml-0"
            role="status"
          >
            Version uppdaterad
          </div>
        ) : null}

        {propertyAnalysis && sideView ? (
          <VisualizationViewTabs
            analysis={propertyAnalysis}
            sideView={sideView}
            backyardViewModel={viewModel}
            styleLabel={`${editor.style} · ${editor.size}`}
            isUpdating={saving || analysisLoading}
          />
        ) : (
          <div className="mt-8 rounded-2xl border border-ec-border-subtle bg-ec-bg-subtle/40 px-6 py-12 text-center text-sm text-ec-text-muted">
            {analysisLoading ? "Laddar fastighetsanalys…" : "Kunde inte ladda visualisering."}
          </div>
        )}

        <AnimatedMetrics
          estimate={snapshot.estimate}
          valueIncrease={snapshot.valueIncrease}
          isUpdating={saving}
        />

        <section
          className={`viz-editor-panel funnel-card mt-6 p-4 sm:mt-8 sm:p-6 ${saving ? "viz-editor-panel--busy" : ""}`}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
              Justera din visualisering
            </h2>
            {saving ? (
              <span className="text-[11px] text-ec-sage">{PREMIUM_COPY.updating}</span>
            ) : null}
          </div>

          <EditorChipGroup
            label="Storlek"
            disabled={saving}
            options={POOL_SIZES.map((size) => ({
              id: size,
              label: size,
              active: editor.size === size,
              onClick: () => patch(applyEditorPatch(editor, { size: size as PoolSize })),
            }))}
          />

          <EditorChipGroup
            label="Stil & material"
            disabled={saving}
            className="mt-5"
            options={POOL_STYLES.map((style) => ({
              id: style,
              label: style,
              active: editor.style === style,
              onClick: () => patch(applyEditorPatch(editor, { style: style as PoolStyle })),
            }))}
          />

          <div className="mt-5">
            <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
              Tillval
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EDITOR_FEATURES.map((feature) => {
                const on = editor.featureIds.includes(feature.id);
                return (
                  <button
                    key={feature.id}
                    type="button"
                    disabled={saving}
                    onClick={() => patch(toggleEditorFeature(editor, feature.id))}
                    className={`rounded-xl border px-3 py-3.5 text-left text-sm font-medium transition-all duration-300 active:scale-[0.98] ${
                      on
                        ? "border-ec-sage/50 bg-ec-sage/12 text-ec-warm shadow-sm"
                        : "border-ec-border-subtle bg-ec-bg-elevated text-ec-text-muted"
                    }`}
                  >
                    {feature.label}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-ec-text-dim" aria-live="polite">
            {saveMessage ?? viewModel.materialSummary}
          </p>
        </section>

        <footer className="mt-8 flex flex-col items-center gap-3 border-t border-ec-border-subtle pt-8 sm:flex-row sm:justify-between">
          <Link
            href="/visualisera"
            className="btn-secondary inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium sm:w-auto sm:px-8"
          >
            Ny visualisering
          </Link>
          <p className="text-[11px] text-ec-text-dim">Sparad · {leadId.slice(0, 8)}…</p>
        </footer>
      </div>
    </div>
  );
}

function EditorChipGroup({
  label,
  options,
  disabled,
  className = "",
}: {
  label: string;
  options: {
    id: string;
    label: string;
    active: boolean;
    onClick: () => void;
  }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            disabled={disabled}
            onClick={opt.onClick}
            className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-300 active:scale-[0.97] sm:px-4 ${
              opt.active
                ? "border-ec-forest/45 bg-ec-forest/12 text-ec-forest"
                : "border-ec-border bg-ec-bg-elevated text-ec-text-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
