import type {
  AITransformationResult,
  GenerationStatus,
  TransformationInput,
  TransformationJob,
  TransformationProviderId,
} from "@/lib/ai-transformation/types";

export function createTransformationJob(input: {
  id: string;
  leadId?: string;
  providerId: TransformationProviderId;
  transformInput: TransformationInput;
}): TransformationJob {
  const now = new Date().toISOString();
  return {
    id: input.id,
    leadId: input.leadId,
    status: "queued",
    providerId: input.providerId,
    input: input.transformInput,
    result: null,
    createdAt: now,
    updatedAt: now,
  };
}

export function transitionJobStatus(
  job: TransformationJob,
  status: GenerationStatus,
  result?: AITransformationResult | null,
): TransformationJob {
  return {
    ...job,
    status,
    result: result ?? job.result,
    updatedAt: new Date().toISOString(),
  };
}

export function generationStatusLabel(status: GenerationStatus): string {
  switch (status) {
    case "queued":
      return "Köad";
    case "generating":
      return "Genererar";
    case "completed":
      return "Klar";
    case "failed":
      return "Misslyckades";
    case "skipped":
      return "Mock (AI av)";
    default:
      return status;
  }
}
