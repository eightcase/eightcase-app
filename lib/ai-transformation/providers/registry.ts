import type {
  AITransformationProvider,
  TransformationProviderId,
} from "@/lib/ai-transformation/types";
import { falTransformationProvider } from "@/lib/ai-transformation/providers/fal";
import { mockTransformationProvider } from "@/lib/ai-transformation/providers/mock-provider";
import { openaiImagesTransformationProvider } from "@/lib/ai-transformation/providers/openai-images";
import { runwareTransformationProvider } from "@/lib/ai-transformation/providers/runware";

/** Client-safe registry (no Replicate/sharp — those load only on server). */
const PROVIDERS: Partial<Record<TransformationProviderId, AITransformationProvider>> = {
  mock: mockTransformationProvider,
  fal: falTransformationProvider,
  "openai-images": openaiImagesTransformationProvider,
  runware: runwareTransformationProvider,
};

export function isReplicateConfigured(): boolean {
  return Boolean(process.env.REPLICATE_API_TOKEN?.trim());
}

export function getTransformationProvider(
  id: TransformationProviderId,
): AITransformationProvider {
  const provider = PROVIDERS[id];
  if (provider) return provider;
  return mockTransformationProvider;
}

export function listTransformationProviders(): AITransformationProvider[] {
  return Object.values(PROVIDERS).filter(Boolean) as AITransformationProvider[];
}

export function resolveActiveProviderId(): TransformationProviderId {
  const preferred = process.env.AI_TRANSFORMATION_PROVIDER as TransformationProviderId | undefined;
  if (preferred === "replicate" && isReplicateConfigured()) return "replicate";
  if (preferred && preferred !== "replicate") {
    if (preferred === "mock") return "mock";
    if (PROVIDERS[preferred]?.isConfigured()) return preferred;
  }
  if (isReplicateConfigured()) return "replicate";
  if (falTransformationProvider.isConfigured()) return "fal";
  if (openaiImagesTransformationProvider.isConfigured()) return "openai-images";
  if (runwareTransformationProvider.isConfigured()) return "runware";
  return "mock";
}
