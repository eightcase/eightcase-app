import type {
  AITransformationProvider,
  AITransformationResult,
  ProviderTransformResult,
  TransformationInput,
} from "@/lib/ai-transformation/types";
import { buildVisualizationStoragePaths } from "@/lib/ai-transformation/storage-paths";

function hashKey(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

async function simulateGenerationDelay(): Promise<void> {
  await new Promise((r) => setTimeout(r, 400));
}

function buildMockResult(input: TransformationInput, status: "completed" | "skipped"): AITransformationResult {
  const key = hashKey(`${input.propertyImageUrl}:${input.prompt}`);
  const companyId = process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ID ?? "demo";
  const leadId = hashKey(input.address).toString(36);
  const storagePaths = buildVisualizationStoragePaths({
    companyId,
    leadId,
    revisionNumber: 1,
  });

  const original = input.propertyImageUrl;
  const generated =
    status === "completed"
      ? `mock://ai-transform/generated/${key}`
      : null;

  const now = new Date().toISOString();

  return {
    status,
    providerId: "mock",
    originalImageUrl: original,
    generatedImageUrl: generated,
    beforeImageUrl: original,
    afterImageUrl: generated ?? `mock://ai-transform/after/${key}`,
    prompt: input.prompt,
    metadata: {
      promptVersion: "v1-nordic-property-transform",
      modelHint: "mock-inpaint",
      placementOrientation: input.propertyAnalysis.suggestedPoolPlacement.orientation,
      confidence: input.propertyAnalysis.confidence,
      storagePaths,
    },
    queuedAt: now,
    startedAt: now,
    completedAt: now,
    errorMessage: null,
  };
}

export const mockTransformationProvider: AITransformationProvider = {
  id: "mock",
  isConfigured: () => true,
  async transform(input): Promise<ProviderTransformResult> {
    await simulateGenerationDelay();
    const result = buildMockResult(input, "completed");
    return { success: true, result };
  },
};

export function buildSkippedTransformationResult(input: TransformationInput): AITransformationResult {
  return buildMockResult(input, "skipped");
}
