import type { BrandSize, BrandTone } from "@/components/brand/types";
import { getBrandMetrics, TONE_CLASS } from "@/components/brand/types";

type EightcaseWordmarkProps = {
  size?: BrandSize;
  tone?: BrandTone;
  className?: string;
};

/**
 * Editorial uppercase wordmark — EI8HTCASE (8 replaces G).
 */
export function EightcaseWordmark({
  size = "md",
  tone = "forest",
  className = "",
}: EightcaseWordmarkProps) {
  const textSize = getBrandMetrics(size).wordmark;

  return (
    <span
      className={`font-display inline-block font-normal uppercase leading-none ${textSize} ${TONE_CLASS[tone]} ${className}`.trim()}
      aria-label="Eightcase"
    >
      EI8HTCASE
    </span>
  );
}
