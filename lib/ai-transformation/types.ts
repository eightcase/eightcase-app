import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";

export type TransformationProviderId =
  | "mock"
  | "replicate"
  | "fal"
  | "openai-images"
  | "runware";

export type GenerationStatus =
  | "queued"
  | "generating"
  | "completed"
  | "failed"
  | "skipped";

export type DesignVibe = "luxury-nordic" | "natural-retreat" | "resort-escape" | "family-cozy";

export type TransformationInput = {
  address: string;
  propertyImageUrl: string;
  propertyImageSource: "mock" | "google-static";
  propertyAnalysis: PropertyAnalysis;
  style: PoolStyle;
  size: PoolSize;
  features: string[];
  designVibe: DesignVibe;
  prompt: string;
};

export type GenerationMetadata = {
  promptVersion: string;
  modelHint: string | null;
  placementOrientation: string;
  confidence: number;
  revisionNumber?: number;
  storagePaths?: {
    original: string;
    generated: string;
    metadata: string;
  };
};

export type AITransformationResult = {
  status: GenerationStatus;
  providerId: TransformationProviderId;
  originalImageUrl: string;
  generatedImageUrl: string | null;
  beforeImageUrl: string;
  afterImageUrl: string;
  prompt: string;
  metadata: GenerationMetadata;
  queuedAt: string;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
};

export type ProviderTransformResult = {
  success: boolean;
  result: AITransformationResult | null;
  message?: string;
};

/**
 * Provider-ready contract for inpainting / image-to-image pool placement on satellite photos.
 * Implementations: mock (dev), Replicate, Fal.ai, OpenAI Images, Runware.
 */
export type AITransformationProvider = {
  readonly id: TransformationProviderId;
  isConfigured(): boolean;
  transform(input: TransformationInput): Promise<ProviderTransformResult>;
};

export type TransformationJob = {
  id: string;
  leadId?: string;
  status: GenerationStatus;
  providerId: TransformationProviderId;
  input: TransformationInput;
  result: AITransformationResult | null;
  createdAt: string;
  updatedAt: string;
};
