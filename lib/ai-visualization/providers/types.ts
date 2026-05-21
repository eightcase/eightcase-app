import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type { PropertyImageContext } from "@/lib/property-image/types";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";
import type { PoolConcept, VisualizationRender } from "@/lib/ai-visualization/pipeline";

/** Shared context passed through the visualization pipeline. */
export type VisualizationPipelineContext = {
  address: string;
  style: PoolStyle;
  size: PoolSize;
  features: string[];
  propertyImage: PropertyImageContext;
  propertyAnalysis: PropertyAnalysis;
  concept: PoolConcept;
};

export type ProviderResult<T> = {
  success: boolean;
  data: T | null;
  provider: string;
  message?: string;
};

/**
 * Future: vision model reads satellite image → zones + placement.
 */
export type SatelliteAnalysisProvider = {
  readonly id: string;
  analyze(input: {
    address: string;
    propertyImage: PropertyImageContext;
    style: PoolStyle;
    size: PoolSize;
  }): Promise<ProviderResult<PropertyAnalysis>>;
};

/**
 * Future: refine pool placement from analysis + user choices.
 */
export type PoolPlacementProvider = {
  readonly id: string;
  suggest(input: {
    analysis: PropertyAnalysis;
    style: PoolStyle;
    size: PoolSize;
    features: string[];
  }): Promise<ProviderResult<PropertyAnalysis["suggestedPoolPlacement"]>>;
};

export type SideViewConcept = {
  title: string;
  summary: string;
  depthMeters: number;
  waterColor: string;
  deckMaterial: string;
  features: string[];
  renderKey: string;
};

/**
 * Future: generative side elevation from property + pool params.
 */
export type SideViewGenerationProvider = {
  readonly id: string;
  generate(input: VisualizationPipelineContext): Promise<ProviderResult<SideViewConcept>>;
};

/**
 * Future: final photoreal before/after from satellite + concept.
 */
export type FinalImageGenerationProvider = {
  readonly id: string;
  generate(input: VisualizationPipelineContext & {
    sideView: SideViewConcept;
  }): Promise<ProviderResult<VisualizationRender>>;
};
