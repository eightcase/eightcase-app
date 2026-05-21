import type { AITransformationResult, GenerationMetadata } from "@/lib/ai-transformation/types";

export type AiGenerationDbFields = {
  ai_generation_status: string | null;
  ai_generation_provider: string | null;
  ai_generated_preview_url: string | null;
  ai_generation_started_at: string | null;
  ai_generation_completed_at: string | null;
  ai_generation_metadata: Record<string, unknown> | null;
};

type StoredMetadata = GenerationMetadata & {
  fullResult?: AITransformationResult;
};

export function aiTransformationFromDbFields(
  row: Partial<AiGenerationDbFields>,
): AITransformationResult | null {
  if (!row.ai_generation_status) return null;

  const metadata = (row.ai_generation_metadata ?? {}) as StoredMetadata;
  if (metadata.fullResult) {
    return {
      ...metadata.fullResult,
      generatedImageUrl:
        row.ai_generated_preview_url ?? metadata.fullResult.generatedImageUrl,
    };
  }

  return {
    status: row.ai_generation_status as AITransformationResult["status"],
    providerId: (row.ai_generation_provider ??
      "mock") as AITransformationResult["providerId"],
    originalImageUrl: metadata.storagePaths?.original ?? "",
    generatedImageUrl: row.ai_generated_preview_url ?? null,
    beforeImageUrl: metadata.storagePaths?.original ?? "",
    afterImageUrl: row.ai_generated_preview_url ?? "",
    prompt: "",
    metadata,
    queuedAt: row.ai_generation_started_at ?? row.ai_generation_completed_at ?? "",
    startedAt: row.ai_generation_started_at ?? null,
    completedAt: row.ai_generation_completed_at ?? null,
    errorMessage: null,
  };
}

export function aiTransformationToDbFields(
  tx: AITransformationResult | null | undefined,
): Partial<AiGenerationDbFields> {
  if (!tx) {
    return {
      ai_generation_status: null,
      ai_generation_provider: null,
      ai_generated_preview_url: null,
      ai_generation_started_at: null,
      ai_generation_completed_at: null,
      ai_generation_metadata: null,
    };
  }

  return {
    ai_generation_status: tx.status,
    ai_generation_provider: tx.providerId,
    ai_generated_preview_url: tx.generatedImageUrl,
    ai_generation_started_at: tx.startedAt ?? tx.queuedAt,
    ai_generation_completed_at: tx.completedAt,
    ai_generation_metadata: {
      ...tx.metadata,
      fullResult: tx,
    } as GenerationMetadata & { fullResult: AITransformationResult },
  };
}
