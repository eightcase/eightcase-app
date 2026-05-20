export const HOUSE_AGE_OPTIONS = ["0–10 år", "10–25 år", "25–40 år", "40+ år"] as const;

export const DRAINAGE_SYMPTOMS = [
  "Fukt i källare",
  "Dålig lukt",
  "Sprickor",
  "Dålig avrinning",
  "Ingen märkbar problematik",
] as const;

export const DRAINAGE_ANALYSIS_STEPS = [
  { label: "Analyserar markförhållanden", detail: "Jordart och grundvattennivå" },
  { label: "Beräknar dräneringsrisk", detail: "Husålder och symptom" },
  { label: "Identifierar möjliga problemzoner", detail: "Grund och fasad" },
] as const;

export const DRAINAGE_ANALYSIS_MS = 2600;

/** Copy when drainage is primary and pool is the cross-sell. */
export const POOL_UPSELL = {
  headline: "Planerar du pool i samma markarbete?",
  subheadline:
    "Om du överväger pool kan en samordnad planering minska både störning och total kostnad för markarbete.",
  cta: "Se poolvisualisering",
} as const;

/** Copy when pool is primary and drainage is the cross-sell. */
export const DRAINAGE_UPSELL = {
  headline: "Passa på att modernisera dräneringen när markarbete redan utförs.",
  subheadline:
    "Eftersom markarbete redan planeras kan en samordnad dränering ofta minska den totala arbetskostnaden.",
  cta: "Se dräneringsanalys",
} as const;
