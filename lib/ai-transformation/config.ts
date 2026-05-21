/**
 * Server-side flag — use in API routes and server actions.
 * When false, orchestrator uses mock/CSS fallback without calling paid providers.
 */
export function isRealAiTransformationEnabledServer(): boolean {
  return process.env.ENABLE_REAL_AI_VISUALIZATION === "true";
}

/**
 * Client-safe flag for funnel/result UI (must mirror server intent in deployment).
 */
export function isRealAiTransformationEnabledClient(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_REAL_AI_VISUALIZATION === "true";
}

export function isRealAiTransformationEnabled(): boolean {
  if (typeof window !== "undefined") {
    return isRealAiTransformationEnabledClient();
  }
  return (
    isRealAiTransformationEnabledServer() || isRealAiTransformationEnabledClient()
  );
}
