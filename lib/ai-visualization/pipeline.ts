import type { DrainageAssessment } from "@/lib/drainage/types";
import type { FunnelState, PriceEstimate } from "@/lib/visualisera/types";

export type Coordinates = {
  lat: number;
  lng: number;
};

export type PropertyImageAsset = {
  source: "mock" | "google-static";
  imageUrl: string;
  capturedAt: string;
};

export type PoolConcept = {
  title: string;
  promptSummary: string;
  style: NonNullable<FunnelState["style"]>;
  features: string[];
};

export type VisualizationRender = {
  source: "mock" | "ai-renderer";
  beforeImageUrl: string;
  afterImageUrl: string;
};

export type AIPipelineResult = {
  address: string;
  coordinates: Coordinates;
  propertyImage: PropertyImageAsset;
  concept: PoolConcept;
  render: VisualizationRender;
  generatedAt: string;
};

export type PreparedLead = {
  id: string;
  createdAt: string;
  address: string;
  style: string | null;
  size: string | null;
  features: string[];
  budget: string | null;
  timeline: string | null;
  estimatedPrice: {
    min: number;
    max: number;
  };
  estimatedPropertyValueIncrease: {
    min: number;
    max: number;
  };
  drainageUpsell: DrainageAssessment | null;
  pipeline: AIPipelineResult | null;
  signature: string;
};

/**
 * Future production pipeline:
 * address -> coordinates -> satellite image -> style/features -> pool concept -> render -> pricing
 */
export async function runAIVizPipeline(input: {
  address: string;
  style: NonNullable<FunnelState["style"]>;
  features: string[];
}): Promise<AIPipelineResult> {
  const coordinates = await geocodeAddress(input.address);
  const propertyImage = await fetchPropertyImage(coordinates);
  const concept = await buildPoolConcept({
    style: input.style,
    features: input.features,
    address: input.address,
  });
  const render = await renderPoolVisualization({
    propertyImage,
    concept,
  });

  return {
    address: input.address,
    coordinates,
    propertyImage,
    concept,
    render,
    generatedAt: new Date().toISOString(),
  };
}

async function geocodeAddress(address: string): Promise<Coordinates> {
  // TODO (Google Maps Geocoding): replace mock coordinate generation with real geocoding.
  const hash = hashString(address || "stockholm");
  const lat = 55.55 + (hash % 1000) / 10000;
  const lng = 12.85 + ((hash >> 6) % 1000) / 10000;
  return { lat, lng };
}

async function fetchPropertyImage(coords: Coordinates): Promise<PropertyImageAsset> {
  // TODO (Google Static Maps): call Google Maps Static API using coords and desired zoom/size.
  const fakeToken = `${coords.lat.toFixed(4)}-${coords.lng.toFixed(4)}`;
  return {
    source: "mock",
    imageUrl: `mock://property-satellite/${fakeToken}`,
    capturedAt: new Date().toISOString(),
  };
}

async function buildPoolConcept(input: {
  style: NonNullable<FunnelState["style"]>;
  features: string[];
  address: string;
}): Promise<PoolConcept> {
  // TODO (LLM planning): generate richer concept prompt from property context and style choices.
  return {
    title: `${input.style} poolförslag`,
    promptSummary: `Poolkoncept för ${input.address} med fokus på ${input.style.toLowerCase()} känsla.`,
    style: input.style,
    features: input.features,
  };
}

async function renderPoolVisualization(input: {
  propertyImage: PropertyImageAsset;
  concept: PoolConcept;
}): Promise<VisualizationRender> {
  // TODO (Image generation): send concept + property image into real rendering model.
  const key = hashString(`${input.propertyImage.imageUrl}:${input.concept.title}`);
  return {
    source: "mock",
    beforeImageUrl: `mock://render/before/${key}`,
    afterImageUrl: `mock://render/after/${key}`,
  };
}

export function prepareMockLead(input: {
  state: FunnelState;
  estimate: PriceEstimate;
  valueIncrease: { min: number; max: number };
  drainageAssessment: DrainageAssessment | null;
  pipeline: AIPipelineResult | null;
}): PreparedLead {
  const signature = JSON.stringify({
    address: input.state.address,
    style: input.state.style,
    size: input.state.size,
    features: input.state.features,
    budget: input.state.budget,
    timeline: input.state.timeline,
    estimate: input.estimate,
    valueIncrease: input.valueIncrease,
    drainageRisk: input.drainageAssessment?.riskLevel ?? null,
    generatedAt: input.pipeline?.generatedAt ?? null,
  });

  return {
    id: `lead_${Date.now()}`,
    createdAt: new Date().toISOString(),
    address: input.state.address,
    style: input.state.style,
    size: input.state.size,
    features: input.state.features,
    budget: input.state.budget,
    timeline: input.state.timeline,
    estimatedPrice: {
      min: input.estimate.min,
      max: input.estimate.max,
    },
    estimatedPropertyValueIncrease: input.valueIncrease,
    drainageUpsell: input.drainageAssessment,
    pipeline: input.pipeline,
    signature,
  };
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
