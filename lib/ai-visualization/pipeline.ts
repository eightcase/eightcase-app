import type { DrainageAssessment } from "@/lib/drainage/types";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import { runMockProviderPipeline } from "@/lib/ai-visualization/providers/mock-providers";
import type { SideViewConcept } from "@/lib/ai-visualization/providers/types";
import { fetchPropertyImageContext } from "@/lib/property-image/client";
import type { PropertyImageContext } from "@/lib/property-image/types";
import type { FunnelState, PoolSize, PoolStyle, PriceEstimate } from "@/lib/visualisera/types";

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
  propertyAnalysis: PropertyAnalysis;
  sideView: SideViewConcept;
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
  /** Set when loaded from Supabase (`leads.crm_status`). */
  crmStatus?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  preferredContactMethod?: string | null;
  consentGiven?: boolean;
  consentTimestamp?: string | null;
  leadSource?: string | null;
  lastActivityAt?: string | null;
  emailSentAt?: string | null;
  revisionCount?: number;
  lastVersionLabel?: string | null;
};

export function attachContactToLead(
  lead: PreparedLead,
  contact: {
    name: string;
    email: string;
    phone: string;
    preferredContactMethod: string;
    consentGiven: boolean;
    consentTimestamp: string;
  },
): PreparedLead {
  return {
    ...lead,
    contactName: contact.name,
    contactEmail: contact.email,
    contactPhone: contact.phone,
    preferredContactMethod: contact.preferredContactMethod,
    consentGiven: contact.consentGiven,
    consentTimestamp: contact.consentTimestamp,
  };
}

/**
 * Future production pipeline:
 * address -> coordinates -> satellite image -> style/features -> pool concept -> render -> pricing
 */
export async function runAIVizPipeline(input: {
  address: string;
  style: NonNullable<FunnelState["style"]>;
  size?: PoolSize | null;
  features: string[];
}): Promise<AIPipelineResult> {
  const style = input.style;
  const size = input.size ?? "Mellan";

  const propertyCtx = await fetchPropertyImageContext(input.address);
  const coordinates = propertyCtx.coordinates;
  const propertyImage = propertyContextToAsset(propertyCtx);

  const concept = await buildPoolConcept({
    style,
    features: input.features,
    address: input.address,
  });

  const { propertyAnalysis, sideView, render } = await runMockProviderPipeline({
    address: input.address,
    style,
    size,
    features: input.features,
    propertyImage: propertyCtx,
    concept,
  });

  return {
    address: input.address,
    coordinates,
    propertyImage,
    propertyAnalysis,
    sideView,
    concept,
    render,
    generatedAt: new Date().toISOString(),
  };
}

function propertyContextToAsset(ctx: PropertyImageContext): PropertyImageAsset {
  return {
    source: ctx.source === "google-static" ? "google-static" : "mock",
    imageUrl: ctx.imageUrl ?? `mock://property-satellite/${ctx.coordinates.lat}-${ctx.coordinates.lng}`,
    capturedAt: ctx.capturedAt,
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

export function prepareMockLead(input: {
  state: FunnelState;
  estimate: PriceEstimate;
  valueIncrease: { min: number; max: number };
  drainageAssessment: DrainageAssessment | null;
  pipeline: AIPipelineResult | null;
  leadId?: string;
  leadSource?: string;
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
    id: input.leadId ?? `lead_${Date.now()}`,
    createdAt: new Date().toISOString(),
    leadSource: input.leadSource ?? "visualisera_demo",
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
