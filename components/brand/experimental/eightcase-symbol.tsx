import type { ExperimentalLogoSize } from "@/components/brand/experimental/types";
import { getExperimentalLogoMetrics } from "@/components/brand/experimental/types";

type EightcaseSymbolProps = {
  size?: ExperimentalLogoSize;
  className?: string;
  loading?: boolean;
};

/**
 * Standalone mark: roof + infinity (8) — favicon / loader / app icon ready.
 */
export function EightcaseSymbol({
  size = "md",
  className = "",
  loading = false,
}: EightcaseSymbolProps) {
  const symbolSize = getExperimentalLogoMetrics(size).symbol;

  return (
    <svg
      viewBox="0 0 48 56"
      width={symbolSize}
      height={(symbolSize * 56) / 48}
      className={`${loading ? "ec-symbol-loading" : ""} ${className}`.trim()}
      role="img"
      aria-label="Eightcase"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Eightcase</title>
      {/* Roof */}
      <path
        className="ec-symbol-roof"
        d="M6 22 L24 8 L42 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="ec-symbol-roof"
        d="M10 22 h28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* Infinity / 8 */}
      <path
        className="ec-symbol-infinity"
        d="M24 30
           C17.5 23.5 10.5 23.5 10.5 30
           C10.5 36.5 17.5 36.5 24 30
           C30.5 23.5 37.5 23.5 37.5 30
           C37.5 36.5 30.5 36.5 24 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
