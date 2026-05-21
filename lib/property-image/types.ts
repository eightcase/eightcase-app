export type PropertyImageSource = "mock" | "google-static";

export type Coordinates = {
  lat: number;
  lng: number;
};

/** Result from PropertyImageProvider — consumed by UI and AI pipeline. */
export type PropertyImageContext = {
  address: string;
  coordinates: Coordinates;
  /** Remote URL when Google Static Maps is used; null → render CSS mock layers */
  imageUrl: string | null;
  source: PropertyImageSource;
  /** UI badge: "mock" | "Google Maps" */
  displaySource: "mock" | "Google Maps";
  capturedAt: string;
};

export type PropertyImageProviderInput = {
  address: string;
};

export type PropertyImageProvider = {
  readonly id: PropertyImageSource;
  resolve(input: PropertyImageProviderInput): Promise<PropertyImageContext>;
};
