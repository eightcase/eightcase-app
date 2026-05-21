export const POOL_STYLES = ["Modern", "Naturlig", "Resort", "Familj"] as const;
export const POOL_SIZES = ["Kompakt", "Mellan", "Stor", "Lyx"] as const;
export const FEATURES = [
  "Poolbelysning",
  "Pooltak",
  "Spabad",
  "Trädäck",
  "Värmesystem",
  "Utekök",
] as const;
export const BUDGET_OPTIONS = ["500k–750k", "750k–1M", "1M+"] as const;
export const TIMELINE_OPTIONS = [
  "Så snart som möjligt",
  "Inom 3 månader",
  "Inom 6–12 månader",
  "Bara nyfiken",
] as const;

export const LOADING_STEPS = [
  {
    label: "Analyserar tomtgräns",
    detail: "Satellitbild och fastighetsdata från Google Maps",
  },
  {
    label: "Identifierar möjlig poolplacering",
    detail: "Bostad, trädgård och lämplig yta",
  },
  {
    label: "Skapar vy från trädgården",
    detail: "Sidovy och koncept utifrån dina val",
  },
  {
    label: "Beräknar offert",
    detail: "Storlek, tillval och marknad",
  },
] as const;

/** Total loading duration target (~12s cinematic pace). */
export const LOADING_STEP_MS = 3000;

export const FUNNEL_PROGRESS_STEPS = [
  "Adress",
  "Stil",
  "Storlek",
  "Tillval",
  "Budget",
] as const;
