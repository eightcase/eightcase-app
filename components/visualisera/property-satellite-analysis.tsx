"use client";

import type { PropertyAnalysis } from "@/lib/property-analysis/types";
import { PropertyPreview } from "@/components/visualisera/property-preview";
import type { PropertyImageContext } from "@/lib/property-image/types";

type PropertySatelliteAnalysisProps = {
  analysis: PropertyAnalysis;
  className?: string;
  showLegend?: boolean;
};

function ZoneBox({
  zone,
  variant,
}: {
  zone: { xPct: number; yPct: number; widthPct: number; heightPct: number; label?: string };
  variant: "house" | "garden" | "pool";
}) {
  const styles =
    variant === "house"
      ? "border-white/50 bg-white/10"
      : variant === "garden"
        ? "border-ec-sage/50 bg-ec-sage/15"
        : "border-ec-forest bg-ec-forest/40 shadow-lg shadow-ec-forest/30";

  return (
    <div
      className={`pointer-events-none absolute rounded-lg border-2 border-dashed ${styles} transition-all duration-700`}
      style={{
        left: `${zone.xPct}%`,
        top: `${zone.yPct}%`,
        width: `${zone.widthPct}%`,
        height: `${zone.heightPct}%`,
      }}
      aria-hidden
    >
      {zone.label ? (
        <span className="absolute -top-5 left-0 whitespace-nowrap text-[9px] font-semibold uppercase tracking-wider text-ec-cream drop-shadow-md sm:text-[10px]">
          {zone.label}
        </span>
      ) : null}
      {variant === "pool" ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="h-[55%] w-[75%] rounded-[40%] border border-ec-cream/30 bg-ec-sage/35" />
        </span>
      ) : null}
    </div>
  );
}

export function PropertySatelliteAnalysis({
  analysis,
  className = "",
  showLegend = true,
}: PropertySatelliteAnalysisProps) {
  const imageContext: PropertyImageContext = {
    address: analysis.address,
    coordinates: analysis.coordinates,
    imageUrl: analysis.propertyImageUrl,
    source: analysis.propertyImageSource,
    displaySource: analysis.displayImageSource,
    capturedAt: analysis.analyzedAt,
  };

  return (
    <div className={className}>
      <div className="relative overflow-hidden rounded-2xl border border-ec-border shadow-[var(--ec-shadow-lg)] sm:rounded-3xl">
        <PropertyPreview
          address={analysis.address}
          context={imageContext}
          className="aspect-[4/5] sm:aspect-[16/10]"
          label="Satellitvy"
        />
        <div className="pointer-events-none absolute inset-0">
          <ZoneBox zone={analysis.detectedHouseZone} variant="house" />
          <ZoneBox zone={analysis.possibleBackyardZone} variant="garden" />
          <ZoneBox zone={analysis.suggestedPoolPlacement} variant="pool" />
        </div>
        <div className="absolute right-2 top-2 z-20 rounded-full border border-ec-forest/40 bg-ec-forest/85 px-2.5 py-1 text-[10px] font-medium text-ec-cream backdrop-blur-sm">
          {Math.round(analysis.confidence * 100)} % träffsäkerhet
        </div>
      </div>

      {showLegend ? (
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-ec-text-muted sm:text-xs">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-white/60 bg-white/20" />
            Bostad
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-ec-sage/60 bg-ec-sage/20" />
            Trädgård
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm border border-ec-forest bg-ec-forest/50" />
            Pool
          </span>
        </div>
      ) : null}
    </div>
  );
}
