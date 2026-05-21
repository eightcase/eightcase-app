import type {
  AITransformationProvider,
  ProviderTransformResult,
  TransformationInput,
} from "@/lib/ai-transformation/types";

/**
 * Future: Runware image inference API.
 * Env: RUNWARE_API_KEY
 */
export const runwareTransformationProvider: AITransformationProvider = {
  id: "runware",
  isConfigured: () => Boolean(process.env.RUNWARE_API_KEY?.trim()),
  async transform(_input: TransformationInput): Promise<ProviderTransformResult> {
    return {
      success: false,
      result: null,
      message: "Runware provider not connected — set RUNWARE_API_KEY and implement adapter.",
    };
  },
};
