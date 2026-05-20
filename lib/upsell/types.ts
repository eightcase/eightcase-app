import type { PriceEstimate } from "@/lib/visualisera/types";
import type { DrainageAssessment } from "@/lib/drainage/types";

/** Which primary journey the user started — drives cross-sell direction. */
export type UpsellOrigin = "pool" | "drainage";

export type LinkedProjectEstimates = {
  origin: UpsellOrigin;
  pool: PriceEstimate | null;
  drainage: DrainageAssessment | null;
};
