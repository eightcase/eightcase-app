import {
  composeBackyard,
  compositionForBefore,
  type BackyardComposition,
} from "@/lib/visualization/mock-render-engine";
import { inferPropertyVibe, PREMIUM_COPY } from "@/lib/visualization/property-context";
import type { VisualizationRenderDescriptor } from "@/lib/visualization/types";

/**
 * Render layer contract — swap mock engine for an AI provider later.
 * View model carries composition tokens (CSS today, image URLs tomorrow).
 */
export type VisualizationRenderLayer = {
  readonly provider: "mock" | "ai";
  describe(descriptor: VisualizationRenderDescriptor): VisualizationRenderViewModel;
};

export type VisualizationRenderViewModel = {
  headline: string;
  subline: string;
  emotionalLine: string;
  persistLine: string;
  propertyVibeLabel: string;
  propertyTagline: string;
  materialSummary: string;
  featureSummary: string;
  composition: BackyardComposition;
  compositionBefore: BackyardComposition;
  renderKey: string;
};

export const mockVisualizationRenderLayer: VisualizationRenderLayer = {
  provider: "mock",
  describe(descriptor) {
    const vibe = inferPropertyVibe(descriptor.address, descriptor.style);
    const composition = composeBackyard(descriptor, vibe);
    const before = compositionForBefore(composition);

    const featureLabels = descriptor.featureIds.length
      ? descriptor.featureIds
          .map((id) => {
            const labels: Record<string, string> = {
              stenplattor: "stenplattor",
              spabad: "spabad",
              pooltak: "pooltak",
              utekok: "utekök",
              belysning: "belysning",
            };
            return labels[id] ?? id;
          })
          .join(" · ")
      : "inga tillval";

    const shortAddress = descriptor.address.split(",")[0] ?? descriptor.address;

    return {
      headline: `${descriptor.style} · ${descriptor.size}`,
      subline: `${shortAddress} · ${vibe.label}`,
      emotionalLine: PREMIUM_COPY.heroSubtitle,
      persistLine: PREMIUM_COPY.persistNote,
      propertyVibeLabel: vibe.label,
      propertyTagline: vibe.tagline,
      materialSummary: `${composition.materialLabel} · ${composition.lightingLabel}`,
      featureSummary: featureLabels,
      composition,
      compositionBefore: before,
      renderKey: descriptor.renderKey,
    };
  },
};
