import { isRealAiTransformationEnabled } from "@/lib/ai-transformation/config";
import { runTransformationPipeline } from "@/lib/ai-transformation/orchestrator";
import type { TransformationPipelineOutput } from "@/lib/ai-transformation/orchestrator";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type { PropertyImageContext } from "@/lib/property-image/types";
import type { PoolSize, PoolStyle } from "@/lib/visualisera/types";

export type ResolveTransformationInput = {
  address: string;
  propertyImage: PropertyImageContext;
  propertyAnalysis: PropertyAnalysis;
  style: PoolStyle;
  size: PoolSize;
  features: string[];
  leadId?: string;
};

/**
 * Browser: POST /api/ai-transformation when real AI is on (keeps REPLICATE_API_TOKEN server-side).
 * Server: run orchestrator directly.
 */
export async function resolveTransformation(
  input: ResolveTransformationInput,
): Promise<TransformationPipelineOutput> {
  if (!isRealAiTransformationEnabled()) {
    return runTransformationPipeline(input);
  }

  if (typeof window !== "undefined") {
    const response = await fetch("/api/ai-transformation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: input.address,
        style: input.style,
        size: input.size,
        features: input.features,
        leadId: input.leadId,
      }),
    });

    if (!response.ok) {
      const errBody = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: string;
      };
      throw new Error(
        errBody.message ?? errBody.error ?? `AI transformation failed (${response.status})`,
      );
    }

    const data = (await response.json()) as TransformationPipelineOutput & {
      job: TransformationPipelineOutput["job"];
      result: TransformationPipelineOutput["result"];
      enabled?: boolean;
    };

    return {
      job: data.job,
      result: data.result,
      realAiEnabled: data.realAiEnabled ?? data.enabled ?? true,
    };
  }

  return runTransformationPipeline({
    ...input,
    providerId: "replicate",
  });
}
