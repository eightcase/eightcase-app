/** Editor toggles shown on /visualisering — mapped to pricing keys. */
export const EDITOR_FEATURES = [
  { id: "stenplattor", label: "Stenplattor", pricingFeature: "Stenplattor" },
  { id: "spabad", label: "Spabad", pricingFeature: "Spabad" },
  { id: "pooltak", label: "Pooltak", pricingFeature: "Pooltak" },
  { id: "utekok", label: "Utekök", pricingFeature: "Utekök" },
  { id: "belysning", label: "Belysning", pricingFeature: "Poolbelysning" },
] as const;

export type EditorFeatureId = (typeof EDITOR_FEATURES)[number]["id"];

export function editorFeatureIdsToPricingFeatures(ids: string[]): string[] {
  const out: string[] = [];
  for (const id of ids) {
    const row = EDITOR_FEATURES.find((f) => f.id === id);
    if (row && !out.includes(row.pricingFeature)) out.push(row.pricingFeature);
  }
  return out;
}

export function pricingFeaturesToEditorIds(features: string[]): string[] {
  const ids: string[] = [];
  for (const feature of features) {
    const row = EDITOR_FEATURES.find((f) => f.pricingFeature === feature);
    if (row && !ids.includes(row.id)) ids.push(row.id);
  }
  return ids;
}
