export type BrandSize = "sm" | "md" | "lg" | "xl";

export type BrandTone = "forest" | "ink" | "cream";

export type BrandLogoVariant =
  | "wordmark"
  | "symbol"
  | "lockup-horizontal"
  | "lockup-stacked";

export type EightcaseLogoProps = {
  variant?: BrandLogoVariant;
  size?: BrandSize;
  tone?: BrandTone;
  className?: string;
};

export type EightcaseBrandLoaderProps = {
  size?: BrandSize;
  tone?: BrandTone;
  className?: string;
  /** Loop the full sequence (for long-running AI / progress) */
  loop?: boolean;
  /** Accessible label */
  label?: string;
};

const METRICS = {
  sm: {
    wordmark: "text-[13px] tracking-[-0.09em]",
    symbol: 22,
    loader: 40,
    lockupGap: "gap-2",
    lockupStackGap: "gap-2.5",
  },
  md: {
    wordmark: "text-base tracking-[-0.09em]",
    symbol: 28,
    loader: 52,
    lockupGap: "gap-2.5",
    lockupStackGap: "gap-3",
  },
  lg: {
    wordmark: "text-lg sm:text-xl tracking-[-0.085em]",
    symbol: 34,
    loader: 64,
    lockupGap: "gap-3",
    lockupStackGap: "gap-3.5",
  },
  xl: {
    wordmark: "text-xl sm:text-2xl tracking-[-0.08em]",
    symbol: 40,
    loader: 72,
    lockupGap: "gap-3.5",
    lockupStackGap: "gap-4",
  },
} as const;

export function getBrandMetrics(size: BrandSize) {
  return METRICS[size];
}

export const TONE_CLASS: Record<BrandTone, string> = {
  forest: "text-ec-forest",
  ink: "text-ec-ink",
  cream: "text-ec-cream",
};
