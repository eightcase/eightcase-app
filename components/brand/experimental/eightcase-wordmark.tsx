import { EightcaseGMark, EIGHTCASE_G_BASELINE } from "@/components/brand/experimental/eightcase-g-mark";
import type { ExperimentalLogoSize } from "@/components/brand/experimental/types";
import { getExperimentalLogoMetrics } from "@/components/brand/experimental/types";

type EightcaseWordmarkProps = {
  size?: ExperimentalLogoSize;
  className?: string;
};

/**
 * Editorial lowercase “eightcase” — Instrument Serif with a custom Didone g.
 * The g’s deep loop is the only hidden “8”; the word reads as eightcase, not ei8htcase.
 */
export function EightcaseWordmark({ size = "md", className }: EightcaseWordmarkProps) {
  const { wordmark } = getExperimentalLogoMetrics(size);
  const fontSize = size === "sm" ? 20 : size === "md" ? 24 : 28;
  const baseline = size === "sm" ? 18 : size === "md" ? 22 : 26;
  const gScale = size === "sm" ? 0.48 : size === "md" ? 0.56 : 0.66;
  const gWidth = 42 * gScale;
  // Tight kerning: g tucks under “i”, “h” follows the stem
  const prefixWidth = size === "sm" ? 19.5 : size === "md" ? 23 : 27;
  const suffixX = prefixWidth + gWidth - (size === "sm" ? 5 : size === "md" ? 6 : 7);
  const gY = baseline - EIGHTCASE_G_BASELINE * gScale;

  return (
    <svg
      viewBox={`0 0 ${wordmark.w} ${wordmark.h}`}
      width={wordmark.w}
      height={wordmark.h}
      className={className}
      role="img"
      aria-label="eightcase"
      overflow="visible"
    >
      <title>eightcase</title>
      <text
        x="0"
        y={baseline}
        fill="currentColor"
        fontSize={fontSize}
        fontFamily="var(--font-serif), 'Instrument Serif', Georgia, serif"
        letterSpacing="-0.06em"
      >
        ei
      </text>
      <g transform={`translate(${prefixWidth}, ${gY}) scale(${gScale})`}>
        <EightcaseGMark fill="currentColor" />
      </g>
      <text
        x={suffixX}
        y={baseline}
        fill="currentColor"
        fontSize={fontSize}
        fontFamily="var(--font-serif), 'Instrument Serif', Georgia, serif"
        letterSpacing="-0.06em"
      >
        htcase
      </text>
    </svg>
  );
}
