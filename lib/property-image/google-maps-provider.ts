import { getGoogleMapsApiKey } from "@/lib/property-image/config";
import type {
  Coordinates,
  PropertyImageContext,
  PropertyImageProvider,
  PropertyImageProviderInput,
} from "@/lib/property-image/types";

const STATIC_MAP_SIZE = "640x400";
const STATIC_MAP_ZOOM = 19;
const STATIC_MAP_SCALE = 2;

/**
 * Google Maps Static API + Geocoding API (server-side only).
 * @see https://developers.google.com/maps/documentation/maps-static/overview
 * @see https://developers.google.com/maps/documentation/geocoding/overview
 */
export const googleMapsPropertyImageProvider: PropertyImageProvider = {
  id: "google-static",
  async resolve(input: PropertyImageProviderInput): Promise<PropertyImageContext> {
    const address = input.address.trim();
    if (!address) {
      throw new Error("Address required for geocoding");
    }

    const apiKey = getGoogleMapsApiKey();
    if (!apiKey) {
      throw new Error("GOOGLE_MAPS_API_KEY is not configured");
    }

    const coordinates = await geocodeWithGoogle(address, apiKey);
    const imageUrl = buildStaticSatelliteUrl(coordinates, apiKey);

    return {
      address,
      coordinates,
      imageUrl,
      source: "google-static",
      displaySource: "Google Maps",
      capturedAt: new Date().toISOString(),
    };
  },
};

async function geocodeWithGoogle(address: string, apiKey: string): Promise<Coordinates> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("region", "se");

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Geocoding HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    status: string;
    results?: { geometry: { location: { lat: number; lng: number } } }[];
    error_message?: string;
  };

  if (data.status !== "OK" || !data.results?.[0]) {
    throw new Error(data.error_message ?? `Geocoding status: ${data.status}`);
  }

  const loc = data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
}

export function buildStaticSatelliteUrl(coords: Coordinates, apiKey: string): string {
  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("center", `${coords.lat},${coords.lng}`);
  url.searchParams.set("zoom", String(STATIC_MAP_ZOOM));
  url.searchParams.set("size", STATIC_MAP_SIZE);
  url.searchParams.set("scale", String(STATIC_MAP_SCALE));
  url.searchParams.set("maptype", "satellite");
  url.searchParams.set("key", apiKey);
  return url.toString();
}
