import "server-only";

import Replicate from "replicate";
import { buildVisualizationStoragePaths } from "@/lib/ai-transformation/storage-paths";
import type {
  AITransformationResult,
  ProviderTransformResult,
  TransformationInput,
} from "@/lib/ai-transformation/types";
import {
  bufferToDataUri,
  prepareImageAndMask,
} from "@/lib/ai-transformation/replicate/build-mask";

const DEFAULT_MODEL = "black-forest-labs/flux-fill-dev";

function getReplicateModel(): string {
  return process.env.REPLICATE_MODEL?.trim() || DEFAULT_MODEL;
}

function extractOutputUrl(output: unknown): string | null {
  if (!output) return null;
  if (typeof output === "string" && output.startsWith("http")) return output;
  if (Array.isArray(output)) {
    for (const item of output) {
      const url = extractOutputUrl(item);
      if (url) return url;
    }
    return null;
  }
  if (typeof output === "object") {
    const file = output as { url?: () => string | URL };
    if (typeof file.url === "function") {
      const href = file.url();
      return typeof href === "string" ? href : href.toString();
    }
  }
  return null;
}

export async function runReplicateTransformation(
  input: TransformationInput,
): Promise<ProviderTransformResult> {
  const token = process.env.REPLICATE_API_TOKEN?.trim();
  if (!token) {
    return {
      success: false,
      result: null,
      message: "REPLICATE_API_TOKEN is not set",
    };
  }

  if (!input.propertyImageUrl.startsWith("http")) {
    return {
      success: false,
      result: null,
      message:
        "Replicate requires a real property image URL (Google Maps satellite). Mock images cannot be transformed.",
    };
  }

  const queuedAt = new Date().toISOString();
  const startedAt = new Date().toISOString();

  try {
    const { imageBuffer, maskBuffer } = await prepareImageAndMask({
      imageUrl: input.propertyImageUrl,
      placement: input.propertyAnalysis.suggestedPoolPlacement,
    });

    const replicate = new Replicate({ auth: token });
    const model = getReplicateModel();

    const output = await replicate.run(model as `${string}/${string}`, {
      input: {
        prompt: input.prompt,
        image: bufferToDataUri(imageBuffer, "image/jpeg"),
        mask: bufferToDataUri(maskBuffer, "image/png"),
        output_format: "jpg",
        output_quality: 90,
        num_inference_steps: 28,
        guidance: 30,
      },
    });

    const generatedUrl = extractOutputUrl(output);
    if (!generatedUrl) {
      return {
        success: false,
        result: null,
        message: "Replicate returned no image URL",
      };
    }

    const companyId = process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ID ?? "demo";
    const leadKey = input.address.slice(0, 24).replace(/\W/g, "_");
    const storagePaths = buildVisualizationStoragePaths({
      companyId,
      leadId: leadKey,
      revisionNumber: 1,
    });

    const completedAt = new Date().toISOString();
    const result: AITransformationResult = {
      status: "completed",
      providerId: "replicate",
      originalImageUrl: input.propertyImageUrl,
      generatedImageUrl: generatedUrl,
      beforeImageUrl: input.propertyImageUrl,
      afterImageUrl: generatedUrl,
      prompt: input.prompt,
      metadata: {
        promptVersion: "v1-nordic-property-transform",
        modelHint: model,
        placementOrientation:
          input.propertyAnalysis.suggestedPoolPlacement.orientation,
        confidence: input.propertyAnalysis.confidence,
        storagePaths,
      },
      queuedAt,
      startedAt,
      completedAt,
      errorMessage: null,
    };

    return { success: true, result };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Replicate prediction failed";
    const failed: AITransformationResult = {
      status: "failed",
      providerId: "replicate",
      originalImageUrl: input.propertyImageUrl,
      generatedImageUrl: null,
      beforeImageUrl: input.propertyImageUrl,
      afterImageUrl: input.propertyImageUrl,
      prompt: input.prompt,
      metadata: {
        promptVersion: "v1-nordic-property-transform",
        modelHint: getReplicateModel(),
        placementOrientation:
          input.propertyAnalysis.suggestedPoolPlacement.orientation,
        confidence: input.propertyAnalysis.confidence,
      },
      queuedAt,
      startedAt,
      completedAt: new Date().toISOString(),
      errorMessage: message,
    };
    return { success: false, result: failed, message };
  }
}
