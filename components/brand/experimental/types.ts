export type ExperimentalLogoSize = "sm" | "md" | "lg";

export type ExperimentalLogoVariant =
  | "wordmark"
  | "symbol"
  | "lockup-horizontal"
  | "lockup-stacked";

export type EightcaseExperimentalLogoProps = {
  variant?: ExperimentalLogoVariant;
  size?: ExperimentalLogoSize;
  className?: string;
  /** Infinity draw animation — for loaders / splash */
  loading?: boolean;
};

const SIZE_MAP = {
  sm: { wordmark: { w: 128, h: 28 }, symbol: 20 },
  md: { wordmark: { w: 154, h: 34 }, symbol: 24 },
  lg: { wordmark: { w: 182, h: 40 }, symbol: 30 },
} as const;

export function getExperimentalLogoMetrics(size: ExperimentalLogoSize) {
  return SIZE_MAP[size];
}
