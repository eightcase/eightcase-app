import type {
  AITransformationProvider,
  ProviderTransformResult,
  TransformationInput,
} from "@/lib/ai-transformation/types";

/**
 * Future: Fal.ai generative edit endpoint.
 * Env: FAL_KEY, FAL_MODEL_ID
 */
export const falTransformationProvider: AITransformationProvider = {
  id: "fal",
  isConfigured: () => Boolean(process.env.FAL_KEY?.trim()),
  async transform(_input: TransformationInput): Promise<ProviderTransformResult> {
    return {
      success: false,
      result: null,
      message: "Fal.ai provider not connected — set FAL_KEY and implement adapter.",
    };
  },
};
