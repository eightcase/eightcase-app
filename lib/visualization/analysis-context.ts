import { mockSideViewGenerationProvider } from "@/lib/ai-visualization/providers/mock-providers";
import type { PoolConcept } from "@/lib/ai-visualization/pipeline";
import type { SideViewConcept } from "@/lib/ai-visualization/providers/types";
import { analyzePropertyMock } from "@/lib/property-analysis/mock-analyzer";
import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import { fetchPropertyImageContext } from "@/lib/property-image/client";
import type { VisualizationEditorState } from "@/lib/visualization/types";

function editorToConcept(editor: VisualizationEditorState): PoolConcept {
  return {
    title: `${editor.style} · ${editor.size}`,
    promptSummary: `${editor.style} pool, ${editor.size}, ${editor.featureIds.join(", ") || "bas"}`,
    style: editor.style,
    features: editor.featureIds,
  };
}

/** Resolve satellite analysis + side-view concept for editor / revisit page. */
export async function resolveVisualizationAnalysis(
  editor: VisualizationEditorState,
): Promise<{ propertyAnalysis: PropertyAnalysis; sideView: SideViewConcept }> {
  const propertyImage = await fetchPropertyImageContext(editor.address);
  const propertyAnalysis = analyzePropertyMock({
    address: editor.address,
    propertyImage,
    style: editor.style,
    size: editor.size,
  });
  const concept = editorToConcept(editor);
  const sideResult = await mockSideViewGenerationProvider.generate({
    address: editor.address,
    style: editor.style,
    size: editor.size,
    features: editor.featureIds,
    propertyImage,
    propertyAnalysis,
    concept,
  });
  return {
    propertyAnalysis,
    sideView: sideResult.data!,
  };
}
