import type {
  PropertyImageContext,
  PropertyImageProvider,
  PropertyImageProviderInput,
} from "@/lib/property-image/types";

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export const mockPropertyImageProvider: PropertyImageProvider = {
  id: "mock",
  async resolve(input: PropertyImageProviderInput): Promise<PropertyImageContext> {
    const address = input.address.trim() || "Sverige";
    const hash = hashString(address);
    const lat = 55.55 + (hash % 1000) / 10000;
    const lng = 12.85 + ((hash >> 6) % 1000) / 10000;

    return {
      address,
      coordinates: { lat, lng },
      imageUrl: null,
      source: "mock",
      displaySource: "mock",
      capturedAt: new Date().toISOString(),
    };
  },
};
