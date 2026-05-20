import type { DrainageAssessment } from "@/lib/drainage/types";
import { formatKr, formatRange } from "@/lib/drainage/assessment";
import type { PriceEstimate } from "@/lib/visualisera/types";
import { formatPriceRange } from "@/lib/visualisera/pricing";

export type CoordinatedSummary = {
  poolRange: string | null;
  drainageRange: string;
  combinedRange: string;
  separateRange: string;
  savingsKr: number;
  savingsPercent: number;
  savingsLabel: string;
};

export function buildCoordinatedSummary(
  pool: PriceEstimate | null,
  drainage: DrainageAssessment,
): CoordinatedSummary {
  return {
    poolRange: pool ? formatPriceRange(pool) : null,
    drainageRange: formatRange(drainage.drainageMin, drainage.drainageMax),
    combinedRange: formatRange(drainage.combinedMin, drainage.combinedMax),
    separateRange: formatRange(drainage.separateTotalMin, drainage.separateTotalMax),
    savingsKr: drainage.coordinatedSavingsKr,
    savingsPercent: drainage.coordinatedSavingsPercent,
    savingsLabel: `Du kan potentiellt spara ${formatKr(drainage.coordinatedSavingsKr)} kr genom samordnat markarbete (ca ${drainage.coordinatedSavingsPercent} %).`,
  };
}
