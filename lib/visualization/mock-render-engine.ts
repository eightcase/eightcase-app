import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";
import { EDITOR_FEATURES } from "@/lib/visualization/editor-features";
import { inferPropertyVibe, type PropertyVibe } from "@/lib/visualization/property-context";
import type { VisualizationRenderDescriptor } from "@/lib/visualization/types";

/** Token bundle for CSS composition — future AI returns URLs + same tokens. */
export type BackyardComposition = {
  renderSeed: number;
  poolWidthPct: number;
  poolHeightPct: number;
  poolOffsetXPct: number;
  poolOffsetYPct: number;
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  lawn: string;
  lawnAccent: string;
  deck: string;
  deckEdge: string;
  waterTop: string;
  waterDeep: string;
  waterShine: string;
  hedge: string;
  tree: string;
  lightWarmth: number;
  landscaping: number;
  materialLabel: string;
  lightingLabel: string;
  hasPool: boolean;
  hasSpa: boolean;
  hasPergola: boolean;
  hasStoneDeck: boolean;
  hasOutdoorKitchen: boolean;
  hasLighting: boolean;
};

const SIZE_SCALE: Record<PoolSize, { w: number; h: number }> = {
  Kompakt: { w: 42, h: 22 },
  Mellan: { w: 52, h: 28 },
  Stor: { w: 62, h: 32 },
  Lyx: { w: 72, h: 36 },
};

const STYLE_PALETTES: Record<
  PoolStyle,
  Pick<
    BackyardComposition,
    | "deck"
    | "deckEdge"
    | "waterTop"
    | "waterDeep"
    | "waterShine"
    | "hedge"
    | "tree"
    | "materialLabel"
  >
> = {
  Modern: {
    deck: "#8a9188",
    deckEdge: "#6e756c",
    waterTop: "#5a8f9a",
    waterDeep: "#2d5560",
    waterShine: "rgba(200,230,240,0.35)",
    hedge: "#4a5c48",
    tree: "#3d4f3b",
    materialLabel: "Betong & sten",
  },
  Naturlig: {
    deck: "#9a7d5c",
    deckEdge: "#7a6348",
    waterTop: "#4a7d72",
    waterDeep: "#2a4f48",
    waterShine: "rgba(180,220,200,0.3)",
    hedge: "#5a6b4a",
    tree: "#455a3d",
    materialLabel: "Trä & natursten",
  },
  Resort: {
    deck: "#c4b59a",
    deckEdge: "#a89678",
    waterTop: "#3db8c4",
    waterDeep: "#1a7a88",
    waterShine: "rgba(220,250,255,0.45)",
    hedge: "#6b8f5a",
    tree: "#5a7a48",
    materialLabel: "Travertin & teak",
  },
  Familj: {
    deck: "#a89278",
    deckEdge: "#8a7560",
    waterTop: "#4d8fa8",
    waterDeep: "#2e5f78",
    waterShine: "rgba(200,230,255,0.32)",
    hedge: "#5c7a52",
    tree: "#4a6842",
    materialLabel: "Värmebehandlat trä",
  },
};

const VIBE_SKY: Record<PropertyVibe["id"], [string, string, string]> = {
  modern_villa: ["#8fa4b8", "#b8c8d8", "#e8eef4"],
  coastal: ["#6a9ec4", "#9ec8e0", "#e6f2fa"],
  nordic_minimal: ["#9aa8a0", "#c5d0c8", "#eef2ee"],
  luxury: ["#7a8a9a", "#b0bcc8", "#f0f2f5"],
  family_garden: ["#8aab88", "#c5dcc0", "#f2f8ef"],
  classic_suburban: ["#8a9ab0", "#c0ccd8", "#eef2f6"],
};

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i += 1) {
    h = (h << 5) - h + key.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function featureFlags(featureIds: string[]) {
  const set = new Set(featureIds);
  return {
    hasSpa: set.has("spabad"),
    hasPergola: set.has("pooltak"),
    hasStoneDeck: set.has("stenplattor"),
    hasOutdoorKitchen: set.has("utekok"),
    hasLighting: set.has("belysning"),
  };
}

export function composeBackyard(
  descriptor: VisualizationRenderDescriptor,
  vibe?: PropertyVibe,
): BackyardComposition {
  const propertyVibe = vibe ?? inferPropertyVibe(descriptor.address, descriptor.style);
  const palette = STYLE_PALETTES[descriptor.style];
  const size = SIZE_SCALE[descriptor.size];
  const flags = featureFlags(descriptor.featureIds);
  const seed = hashKey(descriptor.renderKey);
  const [skyTop, skyMid, skyBottom] = VIBE_SKY[propertyVibe.id];

  const offsetJitter = (seed % 7) - 3;
  const deck =
    flags.hasStoneDeck && descriptor.style !== "Modern"
      ? lighten(palette.deck, 0.08)
      : flags.hasStoneDeck
        ? "#b8b4a8"
        : palette.deck;

  const landscaping = Math.min(
    1,
    0.35 +
      (flags.hasSpa ? 0.1 : 0) +
      (descriptor.size === "Lyx" ? 0.2 : descriptor.size === "Stor" ? 0.12 : 0) +
      (propertyVibe.id === "family_garden" ? 0.15 : 0),
  );

  const lightWarmth =
    0.45 +
    (flags.hasLighting ? 0.35 : 0) +
    (descriptor.style === "Resort" ? 0.15 : 0) +
    ((seed % 10) / 100);

  return {
    renderSeed: seed,
    poolWidthPct: size.w + (seed % 5) - 2,
    poolHeightPct: size.h + (seed % 3) - 1,
    poolOffsetXPct: 48 + offsetJitter,
    poolOffsetYPct: 38 + ((seed >> 3) % 5) - 2,
    skyTop,
    skyMid,
    skyBottom,
    lawn: propertyVibe.id === "coastal" ? "#7a9a6a" : "#6b8f5c",
    lawnAccent: propertyVibe.id === "nordic_minimal" ? "#8aa080" : "#5a7a4e",
    deck,
    deckEdge: palette.deckEdge,
    waterTop: palette.waterTop,
    waterDeep: palette.waterDeep,
    waterShine: palette.waterShine,
    hedge: palette.hedge,
    tree: palette.tree,
    lightWarmth,
    landscaping,
    materialLabel: flags.hasStoneDeck ? "Stenplattor & " + palette.materialLabel.toLowerCase() : palette.materialLabel,
    lightingLabel: flags.hasLighting ? "Varm kvällsbelysning" : "Dagsljus",
    hasPool: true,
    ...flags,
  };
}

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, ((n >> 16) & 255) + 255 * amount);
  const g = Math.min(255, ((n >> 8) & 255) + 255 * amount);
  const b = Math.min(255, (n & 255) + 255 * amount);
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

export function compositionForBefore(composition: BackyardComposition): BackyardComposition {
  return {
    ...composition,
    hasPool: false,
    hasSpa: false,
    hasPergola: false,
    hasOutdoorKitchen: false,
    hasLighting: false,
    lightWarmth: 0.25,
    landscaping: composition.landscaping * 0.55,
    lawn: "#5a6348",
    lawnAccent: "#4a5240",
    skyTop: "#6a7080",
    skyMid: "#9098a8",
    skyBottom: "#c8ccd4",
  };
}
