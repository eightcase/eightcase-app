import type { BrandSize, BrandTone } from "@/components/brand/types";
import { getBrandMetrics, TONE_CLASS } from "@/components/brand/types";

type EightcaseSymbolProps = {
  size?: BrandSize;
  tone?: BrandTone;
  className?: string;
};

/** Standalone mark: roof + infinity (8). */
export function EightcaseSymbol({
  size = "md",
  tone = "forest",
  className = "",
}: EightcaseSymbolProps) {
  const symbolSize = getBrandMetrics(size).symbol;

  return (
    <svg
      viewBox="0 0 48 56"
      width={symbolSize}
      height={(symbolSize * 56) / 48}
      className={`${TONE_CLASS[tone]} ${className}`.trim()}
      role="img"
      aria-label="Eightcase"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Eightcase</title>
      <path
        d="M6 22 L24 8 L42 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 22 h28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
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
