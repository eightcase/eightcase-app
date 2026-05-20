import { EightcaseSymbol } from "@/components/brand/experimental/eightcase-symbol";
import { EightcaseWordmark } from "@/components/brand/experimental/eightcase-wordmark";
import type { EightcaseExperimentalLogoProps } from "@/components/brand/experimental/types";
import "@/components/brand/experimental/brand-experimental.css";

/**
 * Experimental Scandinavian luxury property-tech identity.
 * Use only where explicitly opted in — does not replace global branding yet.
 */
export function EightcaseExperimentalLogo({
  variant = "lockup-horizontal",
  size = "md",
  className = "",
  loading = false,
}: EightcaseExperimentalLogoProps) {
  if (variant === "wordmark") {
    return <EightcaseWordmark size={size} className={className} />;
  }

  if (variant === "symbol") {
    return (
      <EightcaseSymbol size={size} className={className} loading={loading} />
    );
  }

  if (variant === "lockup-stacked") {
    return (
      <span
        className={`inline-flex flex-col items-center gap-2.5 text-ec-ink ${className}`}
      >
        <EightcaseSymbol size={size} loading={loading} />
        <EightcaseWordmark size={size} />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 text-ec-ink ${className}`}
    >
      <EightcaseSymbol size={size} loading={loading} />
      <EightcaseWordmark size={size} />
    </span>
  );
}
