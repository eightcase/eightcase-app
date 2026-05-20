import { calculateEstimate } from "@/lib/visualisera/pricing";
import type { FunnelState, PoolSize, PoolStyle } from "@/lib/visualisera/types";
import {
  editorFeatureIdsToPricingFeatures,
  pricingFeaturesToEditorIds,
} from "@/lib/visualization/editor-features";
import type {
  VisualizationEditorState,
  VisualizationRenderDescriptor,
  VisualizationSnapshot,
} from "@/lib/visualization/types";

export function createDefaultEditorState(address: string): VisualizationEditorState {
  return {
    address,
    style: "Modern",
    size: "Mellan",
    featureIds: [],
    revision: 1,
    updatedAt: new Date().toISOString(),
  };
}

export function editorStateToFunnelState(editor: VisualizationEditorState): FunnelState {
  return {
    address: editor.address,
    style: editor.style,
    size: editor.size,
    features: editorFeatureIdsToPricingFeatures(editor.featureIds),
    budget: null,
    timeline: null,
  };
}

export function funnelStateToEditorState(
  state: FunnelState,
  revision = 1,
): VisualizationEditorState {
  return {
    address: state.address,
    style: state.style ?? "Modern",
    size: state.size ?? "Mellan",
    featureIds: pricingFeaturesToEditorIds(state.features),
    revision,
    updatedAt: new Date().toISOString(),
  };
}

export function calculateValueIncrease(estimate: { min: number; max: number }): {
  min: number;
  max: number;
} {
  const mid = (estimate.min + estimate.max) / 2;
  return {
    min: Math.round(mid * 0.12),
    max: Math.round(mid * 0.18),
  };
}

export function buildRenderDescriptor(editor: VisualizationEditorState): VisualizationRenderDescriptor {
  return {
    address: editor.address,
    style: editor.style,
    size: editor.size,
    featureIds: editor.featureIds,
    renderKey: `${editor.style}:${editor.size}:${editor.featureIds.sort().join(",")}:${editor.revision}`,
  };
}

export function buildVisualizationSnapshot(
  editor: VisualizationEditorState,
  versionLabel?: string,
): VisualizationSnapshot {
  const funnel = editorStateToFunnelState(editor);
  const estimate = calculateEstimate(funnel);
  const valueIncrease = calculateValueIncrease(estimate);
  const label = versionLabel ?? `Version ${editor.revision}`;

  return {
    editor,
    estimate,
    valueIncrease,
    render: buildRenderDescriptor(editor),
    meta: {
      revision: editor.revision,
      versionLabel: label,
      updatedAt: editor.updatedAt,
    },
  };
}

export function applyEditorPatch(
  current: VisualizationEditorState,
  patch: Partial<Pick<VisualizationEditorState, "style" | "size" | "featureIds">>,
): VisualizationEditorState {
  let featureIds = current.featureIds;
  if (patch.featureIds !== undefined) featureIds = patch.featureIds;

  return {
    ...current,
    ...patch,
    featureIds,
    revision: current.revision + 1,
    updatedAt: new Date().toISOString(),
  };
}

export function toggleEditorFeature(
  current: VisualizationEditorState,
  featureId: string,
): VisualizationEditorState {
  const has = current.featureIds.includes(featureId);
  const featureIds = has
    ? current.featureIds.filter((id) => id !== featureId)
    : [...current.featureIds, featureId];
  return applyEditorPatch(current, { featureIds });
}

export function visualizationPagePath(leadId: string): string {
  return `/visualisering/${leadId}`;
}
