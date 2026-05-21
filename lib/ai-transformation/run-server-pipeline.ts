import "server-only";

import {
  createTransformationJob,
  transitionJobStatus,
} from "@/lib/ai-transformation/generation-job";
import { buildTransformationInput } from "@/lib/ai-transformation/prompt-builder";
import { buildSkippedTransformationResult } from "@/lib/ai-transformation/providers/mock-provider";
import type { TransformationPipelineOutput } from "@/lib/ai-transformation/orchestrator";
import type { RunTransformationPipelineInput } from "@/lib/ai-transformation/orchestrator";
import { runReplicateTransformation } from "@/lib/ai-transformation/replicate/run";
import type { AITransformationResult } from "@/lib/ai-transformation/types";

/**
 * Server-only pipeline entry for Replicate (API route).
 */
export async function runServerTransformationPipeline(
  input: RunTransformationPipelineInput,
): Promise<TransformationPipelineOutput> {
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

  const providerId = input.providerId ?? "replicate";
  const jobId = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let job = createTransformationJob({
    id: jobId,
    leadId: input.leadId,
    providerId,
    transformInput,
  });

  if (!process.env.REPLICATE_API_TOKEN?.trim()) {
    const result: AITransformationResult = {
      ...buildSkippedTransformationResult(transformInput),
      status: "failed",
      providerId: "replicate",
      errorMessage: "REPLICATE_API_TOKEN is not set",
      completedAt: new Date().toISOString(),
    };
    job = transitionJobStatus(job, "failed", result);
    return { job, result, realAiEnabled: true };
  }

  job = transitionJobStatus(job, "generating");
  const response = await runReplicateTransformation(transformInput);

  if (!response.success || !response.result) {
    const failed: AITransformationResult = {
      ...(response.result ?? buildSkippedTransformationResult(transformInput)),
      status: "failed",
      providerId: "replicate",
      errorMessage: response.message ?? "Replicate transformation failed",
      completedAt: new Date().toISOString(),
    };
    job = transitionJobStatus(job, "failed", failed);
    return { job, result: failed, realAiEnabled: true };
  }

  job = transitionJobStatus(job, "completed", response.result);
  return { job, result: response.result, realAiEnabled: true };
}
