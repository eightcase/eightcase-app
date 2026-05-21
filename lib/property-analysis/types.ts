import type { PropertyImageSource } from "@/lib/property-image/types";
import type { Coordinates } from "@/lib/ai-visualization/pipeline";

/** Normalized rectangle on satellite/top-view (percent of container). */
export type AnalysisZone = {
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  label?: string;
};

export type SuggestedPoolPlacement = AnalysisZone & {
  label: string;
  orientation: "söder" | "väster" | "öster";
  poolSizeHint: string;
};

/**
 * Output of property analysis — consumed by UI and future vision models.
 * address → coordinates → image → zones → placement
 */
export type PropertyAnalysis = {
  address: string;
  coordinates: Coordinates;
  propertyImageUrl: string | null;
  propertyImageSource: PropertyImageSource;
  displayImageSource: "mock" | "Google Maps";
  detectedHouseZone: AnalysisZone;
  possibleBackyardZone: AnalysisZone;
  suggestedPoolPlacement: SuggestedPoolPlacement;
  /** 0–1 confidence in placement suggestion */
  confidence: number;
  notes: string[];
  analyzedAt: string;
  provider: "mock" | "vision-model";
};
