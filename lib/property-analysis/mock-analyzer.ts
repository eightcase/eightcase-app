import type { PropertyImageContext } from "@/lib/property-image/types";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";
import type { PropertyAnalysis, SuggestedPoolPlacement } from "@/lib/property-analysis/types";

type AnalyzePropertyInput = {
  address: string;
  propertyImage: PropertyImageContext;
  style?: PoolStyle | null;
  size?: PoolSize | null;
};

function hashKey(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const SIZE_POOL: Record<PoolSize, { w: number; h: number }> = {
  Kompakt: { w: 14, h: 10 },
  Mellan: { w: 18, h: 12 },
  Stor: { w: 22, h: 14 },
  Lyx: { w: 26, h: 16 },
};

/**
 * Deterministic mock analysis from address + image metadata.
 * Replace with vision-model provider when ready.
 */
export function analyzePropertyMock(input: AnalyzePropertyInput): PropertyAnalysis {
  const address = input.address.trim() || "Sverige";
  const seed = hashKey(`${address}:${input.propertyImage.coordinates.lat}:${input.propertyImage.coordinates.lng}`);
  const size = input.size ?? "Mellan";
  const style = input.style ?? "Modern";
  const poolDims = SIZE_POOL[size];

  const houseX = 28 + (seed % 12);
  const houseY = 22 + ((seed >> 4) % 8);
  const backyardX = 52 + ((seed >> 2) % 10);
  const backyardY = 48 + ((seed >> 6) % 8);

  const placement: SuggestedPoolPlacement = {
    xPct: backyardX - poolDims.w / 2,
    yPct: backyardY,
    widthPct: poolDims.w,
    heightPct: poolDims.h,
    label: "Rekommenderad poolplacering",
    orientation: seed % 3 === 0 ? "söder" : seed % 3 === 1 ? "väster" : "öster",
    poolSizeHint: size,
  };

  const q = address.toLowerCase();
  const coastal = /malmö|helsing|kust|strand|sjö/.test(q);
  const confidence = 0.62 + (seed % 20) / 100 + (input.propertyImage.source === "google-static" ? 0.12 : 0);

  const notes = [
    input.propertyImage.source === "google-static"
      ? "Satellitbild från Google Maps används som underlag."
      : "Simulerad fastighetsbild tills satellitdata är tillgänglig.",
    `Tomt analyserad för ${style.toLowerCase()} pool i ${size.toLowerCase()} storlek.`,
    coastal
      ? "Kustnära läge — vind och saltpåverkan beaktas i placering."
      : "Skyddad trädgårdszon identifierad bakom bostadshus.",
    `Uppskattad träffsäkerhet på placering: ${Math.round(Math.min(confidence, 0.95) * 100)} %.`,
  ];

  return {
    address,
    coordinates: input.propertyImage.coordinates,
    propertyImageUrl: input.propertyImage.imageUrl,
    propertyImageSource: input.propertyImage.source,
    displayImageSource: input.propertyImage.displaySource,
    detectedHouseZone: {
      xPct: houseX,
      yPct: houseY,
      widthPct: 32 + (seed % 6),
      heightPct: 26 + (seed % 4),
      label: "Bostad",
    },
    possibleBackyardZone: {
      xPct: backyardX - 18,
      yPct: backyardY - 8,
      widthPct: 42,
      heightPct: 38,
      label: "Möjlig trädgårdsyta",
    },
    suggestedPoolPlacement: placement,
    confidence: Math.min(0.95, confidence),
    notes,
    analyzedAt: new Date().toISOString(),
    provider: "mock",
  };
}

export function analyzePropertyFromEditor(input: {
  address: string;
  style: PoolStyle;
  size: PoolSize;
  featureIds: string[];
}): PropertyAnalysis {
  const seed = hashKey(`${input.address}:${input.style}:${input.size}:${input.featureIds.join(",")}`);
  const mockImage: PropertyImageContext = {
    address: input.address,
    coordinates: {
      lat: 55.55 + (seed % 1000) / 10000,
      lng: 12.85 + ((seed >> 6) % 1000) / 10000,
    },
    imageUrl: null,
    source: "mock",
    displaySource: "mock",
    capturedAt: new Date().toISOString(),
  };
  return analyzePropertyMock({
    address: input.address,
    propertyImage: mockImage,
    style: input.style,
    size: input.size,
  });
}
