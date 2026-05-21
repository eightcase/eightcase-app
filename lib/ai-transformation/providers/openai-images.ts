import type {
  AITransformationProvider,
  ProviderTransformResult,
  TransformationInput,
} from "@/lib/ai-transformation/types";

/**
 * Future: OpenAI Images edit / generations API with mask.
 * Env: OPENAI_API_KEY
 */
export const openaiImagesTransformationProvider: AITransformationProvider = {
  id: "openai-images",
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY?.trim()),
  async transform(_input: TransformationInput): Promise<ProviderTransformResult> {
    return {
      success: false,
      result: null,
      message: "OpenAI Images provider not connected — set OPENAI_API_KEY and implement adapter.",
    };
  },
};
