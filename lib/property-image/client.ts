import type { PropertyImageContext } from "@/lib/property-image/types";

/**
 * Browser-safe fetch via API route (keeps GOOGLE_MAPS_API_KEY on server).
 */
export async function fetchPropertyImageContext(
  address: string,
): Promise<PropertyImageContext> {
  const params = new URLSearchParams({ address: address.trim() || "Sverige" });
  const res = await fetch(`/api/property-image?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Kunde inte hämta fastighetsbild");
  }
  return res.json() as Promise<PropertyImageContext>;
}
