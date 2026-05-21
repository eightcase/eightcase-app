import { analyzePropertyMock } from "@/lib/property-analysis/mock-analyzer";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import type {
  FinalImageGenerationProvider,
  PoolPlacementProvider,
  ProviderResult,
  SatelliteAnalysisProvider,
  SideViewConcept,
  SideViewGenerationProvider,
  VisualizationPipelineContext,
} from "@/lib/ai-visualization/providers/types";
import type { VisualizationRender } from "@/lib/ai-visualization/pipeline";

function ok<T>(data: T, provider: string): ProviderResult<T> {
  return { success: true, data, provider };
}

export const mockSatelliteAnalysisProvider: SatelliteAnalysisProvider = {
  id: "mock-satellite-analysis",
  async analyze(input) {
    const analysis = analyzePropertyMock({
      address: input.address,
      propertyImage: input.propertyImage,
      style: input.style,
      size: input.size,
    });
    return ok(analysis, mockSatelliteAnalysisProvider.id);
  },
};

export const mockPoolPlacementProvider: PoolPlacementProvider = {
  id: "mock-pool-placement",
  async suggest(input) {
    return ok(input.analysis.suggestedPoolPlacement, mockPoolPlacementProvider.id);
  },
};

export const mockSideViewGenerationProvider: SideViewGenerationProvider = {
  id: "mock-side-view",
  async generate(input) {
    const sideView: SideViewConcept = {
      title: `Sidovy · ${input.style} ${input.size}`,
      summary: `AI-konceptvy från trädgården med ${input.features.length ? input.features.join(", ") : "basutförande"}.`,
      depthMeters: input.size === "Lyx" ? 2.2 : input.size === "Stor" ? 1.9 : 1.6,
      waterColor: input.style === "Resort" ? "#3db8c4" : "#4a7d72",
      deckMaterial: input.style === "Modern" ? "betong" : "trä",
      features: input.features,
      renderKey: `${input.propertyAnalysis.suggestedPoolPlacement.xPct}-${input.style}-${input.size}`,
    };
    return ok(sideView, mockSideViewGenerationProvider.id);
  },
};

export const mockFinalImageGenerationProvider: FinalImageGenerationProvider = {
  id: "mock-final-render",
  async generate(input) {
    const key = `${input.propertyImage.imageUrl}:${input.sideView.renderKey}`;
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) hash = (hash << 5) - hash + key.charCodeAt(i);
    const render: VisualizationRender = {
      source: "mock",
      beforeImageUrl: `mock://render/before/${Math.abs(hash)}`,
      afterImageUrl: `mock://render/after/${Math.abs(hash)}`,
    };
    return ok(render, mockFinalImageGenerationProvider.id);
  },
};

export async function runMockProviderPipeline(input: {
  address: string;
  style: import("@/lib/visualisera/types").PoolStyle;
  size: import("@/lib/visualisera/types").PoolSize;
  features: string[];
  propertyImage: import("@/lib/property-image/types").PropertyImageContext;
  concept: import("@/lib/ai-visualization/pipeline").PoolConcept;
}): Promise<{
  propertyAnalysis: PropertyAnalysis;
  sideView: SideViewConcept;
  render: VisualizationRender;
}> {
  const analysisResult = await mockSatelliteAnalysisProvider.analyze({
    address: input.address,
    propertyImage: input.propertyImage,
    style: input.style,
    size: input.size,
  });
  const propertyAnalysis = analysisResult.data!;

  const ctx: VisualizationPipelineContext = {
    address: input.address,
    style: input.style,
    size: input.size,
    features: input.features,
    propertyImage: input.propertyImage,
    propertyAnalysis,
    concept: input.concept,
  };

  const sideResult = await mockSideViewGenerationProvider.generate(ctx);
  const sideView = sideResult.data!;

  const renderResult = await mockFinalImageGenerationProvider.generate({
    ...ctx,
    sideView,
  });

  return {
    propertyAnalysis,
    sideView,
    render: renderResult.data!,
  };
}
