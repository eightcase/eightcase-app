/**
 * Supabase Storage layout (bucket: `visualizations`).
 * Upload helpers will use these paths when real AI + storage are connected.
 */
export const VISUALIZATION_STORAGE_BUCKET = "visualizations";

export type VisualizationStoragePaths = {
  bucket: typeof VISUALIZATION_STORAGE_BUCKET;
  original: string;
  generated: string;
  metadata: string;
};

export function buildVisualizationStoragePaths(input: {
  companyId: string;
  leadId: string;
  revisionNumber: number;
}): VisualizationStoragePaths {
  const base = `${input.companyId}/${input.leadId}/rev-${String(input.revisionNumber).padStart(3, "0")}`;
  return {
    bucket: VISUALIZATION_STORAGE_BUCKET,
    original: `${base}/original.jpg`,
    generated: `${base}/generated.jpg`,
    metadata: `${base}/generation.json`,
  };
}

export function publicStorageUrl(supabaseUrl: string, path: string): string {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${VISUALIZATION_STORAGE_BUCKET}/${path}`;
}
