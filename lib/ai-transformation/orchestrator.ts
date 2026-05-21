import { isRealAiTransformationEnabled } from "@/lib/ai-transformation/config";
import {
  createTransformationJob,
  transitionJobStatus,
} from "@/lib/ai-transformation/generation-job";
import { buildTransformationInput } from "@/lib/ai-transformation/prompt-builder";
import { buildSkippedTransformationResult } from "@/lib/ai-transformation/providers/mock-provider";
import {
  getTransformationProvider,
  resolveActiveProviderId,
} from "@/lib/ai-transformation/providers/registry";
import type {
  AITransformationResult,
  TransformationJob,
  TransformationProviderId,
} from "@/lib/ai-transformation/types";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type { PropertyImageContext } from "@/lib/property-image/types";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";

export type RunTransformationPipelineInput = {
  address: string;
  propertyImage: PropertyImageContext;
  propertyAnalysis: PropertyAnalysis;
  style: PoolStyle;
  size: PoolSize;
  features: string[];
  leadId?: string;
  /** Override provider for tests; defaults from env + registry. */
  providerId?: TransformationProviderId;
};

export type TransformationPipelineOutput = {
  job: TransformationJob;
  result: AITransformationResult;
  realAiEnabled: boolean;
};

/**
 * Async generation scaffold: queued → generating → completed | failed | skipped.
 * When ENABLE_REAL_AI_VISUALIZATION is false, returns skipped mock (no paid API calls).
 */
export async function runTransformationPipeline(
  input: RunTransformationPipelineInput,
): Promise<TransformationPipelineOutput> {
  const realAiEnabled = isRealAiTransformationEnabled();
  const propertyImageUrl =
    input.propertyImage.imageUrl ??
    `mock://property/${input.propertyAnalysis.coordinates.lat}-${input.propertyAnalysis.coordinates.lng}`;
  const propertyImageSource =
    input.propertyImage.source === "google-static" ? "google-static" : "mock";

  const transformInput = buildTransformationInput({
    address: input.address,
    propertyImageUrl,
    propertyImageSource,
    propertyAnalysis: input.propertyAnalysis,
    style: input.style,
    size: input.size,
    features: input.features,
  });

  const providerId = input.providerId ?? resolveActiveProviderId();
  const jobId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let job = createTransformationJob({
    id: jobId,
    leadId: input.leadId,
    providerId,
    transformInput,
  });

  if (!realAiEnabled) {
    const result = buildSkippedTransformationResult(transformInput);
    job = transitionJobStatus(job, "skipped", result);
    return { job, result, realAiEnabled: false };
  }

  const provider = getTransformationProvider(providerId);
  const configured =
    providerId === "replicate"
      ? Boolean(process.env.REPLICATE_API_TOKEN?.trim())
      : provider.isConfigured();

  if (!configured) {
    const result: AITransformationResult = {
      ...buildSkippedTransformationResult(transformInput),
      status: "failed",
      providerId,
      errorMessage: `${provider.id} is not configured`,
      completedAt: new Date().toISOString(),
    };
    job = transitionJobStatus(job, "failed", result);
    return { job, result, realAiEnabled: true };
  }

  if (providerId === "replicate") {
    const result: AITransformationResult = {
      ...buildSkippedTransformationResult(transformInput),
      status: "failed",
      providerId: "replicate",
      errorMessage: "Replicate runs on the server via POST /api/ai-transformation",
      completedAt: new Date().toISOString(),
    };
    job = transitionJobStatus(job, "failed", result);
    return { job, result, realAiEnabled: true };
  }

  job = transitionJobStatus(job, "generating");
  const response = await provider.transform(transformInput);

  if (!response.success || !response.result) {
    const failed: AITransformationResult = {
      ...buildSkippedTransformationResult(transformInput),
      status: "failed",
      providerId,
      errorMessage: response.message ?? "Transformation failed",
      completedAt: new Date().toISOString(),
    };
    job = transitionJobStatus(job, "failed", failed);
    return { job, result: failed, realAiEnabled: true };
  }

  job = transitionJobStatus(job, "completed", response.result);
  return { job, result: response.result, realAiEnabled: true };
}
