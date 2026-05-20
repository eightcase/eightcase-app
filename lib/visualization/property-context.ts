import type { PoolStyle } from "@/lib/visualisera/types";

export type PropertyVibeId =
  | "modern_villa"
  | "coastal"
  | "nordic_minimal"
  | "luxury"
  | "family_garden"
  | "classic_suburban";

export type PropertyVibe = {
  id: PropertyVibeId;
  label: string;
  tagline: string;
};

const VIBES: Record<PropertyVibeId, PropertyVibe> = {
  modern_villa: {
    id: "modern_villa",
    label: "Modern villa",
    tagline: "Ren arkitektur och avskalad elegans",
  },
  coastal: {
    id: "coastal",
    label: "Kustnära",
    tagline: "Ljus, luft och närhet till vattnet",
  },
  nordic_minimal: {
    id: "nordic_minimal",
    label: "Nordisk minimalism",
    tagline: "Naturliga material och stilla helhet",
  },
  luxury: {
    id: "luxury",
    label: "Lyxträdgård",
    tagline: "Exklusiv känsla med genomtänkta detaljer",
  },
  family_garden: {
    id: "family_garden",
    label: "Familjeträdgård",
    tagline: "Varm, inbjudande och levande utemiljö",
  },
  classic_suburban: {
    id: "classic_suburban",
    label: "Klassiskt villaområde",
    tagline: "Tidlös svensk trädgård med poolfokus",
  },
};

function hashAddress(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function inferPropertyVibe(address: string, style: PoolStyle): PropertyVibe {
  const q = address.toLowerCase();

  if (/strand|kust|hav|sjö|malmö|helsing|trelle|halmstad|bohus|skåne/.test(q)) {
    return VIBES.coastal;
  }
  if (/liding|saltsjö|djursholm|nacka|danderyd|premium|lyx/.test(q)) {
    return VIBES.luxury;
  }
  if (/villa|höjden|berg|udden/.test(q)) {
    return VIBES.modern_villa;
  }
  if (/lund|täby|sollent|villa vägen|familj|park/.test(q)) {
    return VIBES.family_garden;
  }
  if (style === "Naturlig" || style === "Modern") {
    return VIBES.nordic_minimal;
  }
  if (style === "Resort") {
    return VIBES.luxury;
  }
  if (style === "Familj") {
    return VIBES.family_garden;
  }

  const pick = hashAddress(q) % 3;
  if (pick === 0) return VIBES.classic_suburban;
  if (pick === 1) return VIBES.modern_villa;
  return VIBES.nordic_minimal;
}

export const PREMIUM_COPY = {
  heroTitle: "Så här skulle din framtida trädgård kunna kännas",
  heroSubtitle: "Anpassad efter din tomt och dina val",
  persistNote: "Din visualisering sparas och kan uppdateras när som helst",
  updating: "Uppdaterar visualisering…",
  beforeLabel: "Idag",
  afterLabel: "Efter",
} as const;
