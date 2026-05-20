import { EightcaseSymbol } from "@/components/brand/eightcase-symbol";
import { EightcaseWordmark } from "@/components/brand/eightcase-wordmark";
import type { EightcaseLogoProps } from "@/components/brand/types";
import { getBrandMetrics } from "@/components/brand/types";

/**
 * Eightcase brand lockups — wordmark, symbol, or combined.
 */
export function EightcaseLogo({
  variant = "lockup-horizontal",
  size = "md",
  tone = "forest",
  className = "",
}: EightcaseLogoProps) {
  const { lockupGap, lockupStackGap } = getBrandMetrics(size);

  if (variant === "wordmark") {
    return <EightcaseWordmark size={size} tone={tone} className={className} />;
  }

  if (variant === "symbol") {
    return <EightcaseSymbol size={size} tone={tone} className={className} />;
  }

  if (variant === "lockup-stacked") {
    return (
      <span
        className={`inline-flex flex-col items-center ${lockupStackGap} ${className}`.trim()}
      >
        <EightcaseSymbol size={size} tone={tone} />
        <EightcaseWordmark size={size} tone={tone} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center ${lockupGap} ${className}`.trim()}>
      <EightcaseSymbol size={size} tone={tone} className="shrink-0" />
      <EightcaseWordmark size={size} tone={tone} className="shrink-0" />
    </span>
  );
}
