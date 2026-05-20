"use client";

import { useEffect, useState } from "react";
import { VisualizationEditor } from "@/components/visualization/visualization-editor";
import { getLatestDemoVisualization } from "@/lib/admin/demo-leads";
import {
  loadLeadForVisualization,
  persistVisualizationRevision,
  touchLead,
} from "@/lib/leads/lead-persistence";
import {
  createDefaultEditorState,
  funnelStateToEditorState,
} from "@/lib/visualization/state";
import type { VisualizationEditorState } from "@/lib/visualization/types";
import type { FunnelState } from "@/lib/visualisera/types";

type VisualizationPageClientProps = {
  leadId: string;
};

export function VisualizationPageClient({ leadId }: VisualizationPageClientProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editor, setEditor] = useState<VisualizationEditorState | null>(null);
  const [storage, setStorage] = useState<"supabase" | "demo" | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { lead, storage: store } = await loadLeadForVisualization(leadId);
      if (cancelled) return;
      if (!lead) {
        setError("Visualiseringen kunde inte hittas.");
        setLoading(false);
        return;
      }
      setStorage(store);
      void touchLead(leadId, store);

      const demoViz = store === "demo" ? getLatestDemoVisualization(leadId) : null;
      if (demoViz) {
        setEditor(demoViz.editor);
      } else if (lead.style && lead.size) {
        setEditor(
          funnelStateToEditorState({
            address: lead.address,
            style: lead.style as FunnelState["style"],
            size: lead.size as FunnelState["size"],
            features: lead.features,
            budget: lead.budget as FunnelState["budget"],
            timeline: lead.timeline as FunnelState["timeline"],
          }),
        );
      } else {
        setEditor(createDefaultEditorState(lead.address));
      }
      setLoading(false);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  if (loading) {
    return (
      <div className="zone-funnel flex min-h-screen items-center justify-center px-4">
        <div className="funnel-card max-w-md p-8 text-center">
          <p className="text-sm text-ec-text-muted">Laddar din visualisering…</p>
        </div>
      </div>
    );
  }

  if (error || !editor) {
    return (
      <div className="zone-funnel flex min-h-screen items-center justify-center px-4">
        <div className="funnel-card max-w-md p-8 text-center">
          <p className="font-medium text-ec-warm">{error ?? "Något gick fel"}</p>
          <a href="/visualisera" className="btn-funnel mt-6 inline-flex h-11 items-center px-6 text-sm">
            Starta ny visualisering
          </a>
        </div>
      </div>
    );
  }

  return (
    <VisualizationEditor
      leadId={leadId}
      initialEditor={editor}
      onSaveRevision={async (next) => {
        setEditor(next);
        const result = await persistVisualizationRevision(leadId, next, storage);
        return { success: result.success, message: result.message };
      }}
    />
  );
}
