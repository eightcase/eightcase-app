import type { AITransformationResult } from "@/lib/ai-transformation/types";
import type { PoolSize, PoolStyle, PriceEstimate } from "@/lib/visualisera/types";

/** Canonical editor document — future AI render jobs read this shape. */
export type VisualizationEditorState = {
  address: string;
  style: PoolStyle;
  size: PoolSize;
  /** Editor feature ids (stenplattor, spabad, …) */
  featureIds: string[];
  revision: number;
  updatedAt: string;
};

/** Descriptor passed to render layer (mock today, AI provider later). */
export type VisualizationRenderDescriptor = {
  address: string;
  style: PoolStyle;
  size: PoolSize;
  featureIds: string[];
  /** Stable key for cache busting when AI is enabled */
  renderKey: string;
};

export type VisualizationRevisionMeta = {
  revision: number;
  versionLabel: string;
  updatedAt: string;
};

export type VisualizationSnapshot = {
  editor: VisualizationEditorState;
  estimate: PriceEstimate;
  valueIncrease: { min: number; max: number };
  render: VisualizationRenderDescriptor;
  transformation?: AITransformationResult | null;
  meta: VisualizationRevisionMeta;
};

export type LeadActivityMeta = {
  lastActivityAt: string | null;
  emailSentAt: string | null;
  revisionCount: number;
  lastVersionLabel: string | null;
};
