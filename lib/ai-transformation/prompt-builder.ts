import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type { DesignVibe, TransformationInput } from "@/lib/ai-transformation/types";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";

const PROMPT_VERSION = "v1-nordic-property-transform";

const VIBE_COPY: Record<DesignVibe, string> = {
  "luxury-nordic":
    "luxury Nordic backyard, understated Scandinavian elegance, cool natural light, premium materials",
  "natural-retreat":
    "natural Nordic garden retreat, stone and timber, soft greenery, calm organic atmosphere",
  "resort-escape":
    "private resort-style Nordic backyard, refined lounge zones, turquoise water accent, evening ambience",
  "family-cozy":
    "welcoming family backyard, safe pool edges, warm lighting, durable family-friendly surfaces",
};

const STYLE_TO_VIBE: Record<PoolStyle, DesignVibe> = {
  Modern: "luxury-nordic",
  Naturlig: "natural-retreat",
  Resort: "resort-escape",
  Familj: "family-cozy",
};

const SIZE_HINT: Record<PoolSize, string> = {
  Kompakt: "compact in-ground pool (~6–8 m²)",
  Mellan: "medium in-ground pool (~12–16 m²)",
  Stor: "generous in-ground pool (~20–28 m²)",
  Lyx: "large bespoke in-ground pool (30 m²+)",
};

export function poolStyleToDesignVibe(style: PoolStyle): DesignVibe {
  return STYLE_TO_VIBE[style];
}

export function buildTransformationPrompt(input: {
  address: string;
  style: PoolStyle;
  size: PoolSize;
  features: string[];
  designVibe: DesignVibe;
  propertyAnalysis: PropertyAnalysis;
}): { prompt: string; promptVersion: string; modelHint: string } {
  const vibe = VIBE_COPY[input.designVibe];
  const placement = input.propertyAnalysis.suggestedPoolPlacement;
  const featureLine =
    input.features.length > 0
      ? `Optional upgrades integrated naturally: ${input.features.join(", ")}.`
      : "No extra upgrades beyond core pool and deck.";

  const zones = [
    `Preserve existing house footprint (${placement.orientation} garden orientation).`,
    `Place pool within backyard zone at approximately ${Math.round(placement.xPct)}% x / ${Math.round(placement.yPct)}% y on satellite view.`,
    "Preserve camera perspective and roof geometry from source satellite photo.",
    "Integrate pool naturally into existing lawn and hardscape — no floating objects.",
  ];

  const prompt = [
    "Photorealistic property visualization edit on real satellite/aerial backyard photo.",
    vibe,
    SIZE_HINT[input.size],
    `${input.style} pool design language for Swedish residential property near ${input.address.split(",")[0]}.`,
    "Realistic in-ground swimming pool with believable water, coping, and surrounding deck.",
    ...zones,
    featureLine,
    "Maintain existing trees, fences, and neighboring structures unless subtly adjusted for composition.",
    "High-end marketing quality, soft Nordic daylight, no text overlays, no cartoon style.",
  ].join(" ");

  return {
    prompt,
    promptVersion: PROMPT_VERSION,
    modelHint: "image-to-image-inpaint-v1",
  };
}

export function buildTransformationInput(input: {
  address: string;
  propertyImageUrl: string;
  propertyImageSource: "mock" | "google-static";
  propertyAnalysis: PropertyAnalysis;
  style: PoolStyle;
  size: PoolSize;
  features: string[];
}): TransformationInput {
  const designVibe = poolStyleToDesignVibe(input.style);
  const { prompt } = buildTransformationPrompt({
    address: input.address,
    style: input.style,
    size: input.size,
    features: input.features,
    designVibe,
    propertyAnalysis: input.propertyAnalysis,
  });

  return {
    address: input.address,
    propertyImageUrl: input.propertyImageUrl,
    propertyImageSource: input.propertyImageSource,
    propertyAnalysis: input.propertyAnalysis,
    style: input.style,
    size: input.size,
    features: input.features,
    designVibe,
    prompt,
  };
}
