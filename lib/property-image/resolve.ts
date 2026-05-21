import { mockPropertyImageProvider } from "@/lib/property-image/mock-provider";
import { googleMapsPropertyImageProvider } from "@/lib/property-image/google-maps-provider";
import { isGoogleMapsConfigured } from "@/lib/property-image/config";
import type { PropertyImageContext } from "@/lib/property-image/types";

/**
 * Server-side resolver: mock fallback when Google is missing or fails.
 */
export async function resolvePropertyImageContext(
  address: string,
): Promise<PropertyImageContext> {
  const trimmed = address.trim();
  if (!trimmed) {
    return mockPropertyImageProvider.resolve({ address: "Sverige" });
  }

  if (isGoogleMapsConfigured()) {
    try {
      return await googleMapsPropertyImageProvider.resolve({ address: trimmed });
    } catch {
      return mockPropertyImageProvider.resolve({ address: trimmed });
    }
  }

  return mockPropertyImageProvider.resolve({ address: trimmed });
}
