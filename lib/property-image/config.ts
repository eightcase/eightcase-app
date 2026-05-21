/**
 * Google Maps (server-only).
 * - Geocoding API: address → coordinates
 * - Static Maps API: coordinates → satellite image URL
 *
 * Enable Maps JavaScript API is NOT required for Phase 1.
 */
export function getGoogleMapsApiKey(): string | null {
  const key = process.env.GOOGLE_MAPS_API_KEY?.trim();
  return key || null;
}

export function isGoogleMapsConfigured(): boolean {
  return Boolean(getGoogleMapsApiKey());
}

/** Optional public flag for UI hints only (never put the secret key here). */
export function isGoogleMapsEnabledPublicHint(): boolean {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_ENABLED === "true";
}
