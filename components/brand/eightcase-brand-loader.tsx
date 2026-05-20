"use client";

import type { EightcaseBrandLoaderProps } from "@/components/brand/types";
import { getBrandMetrics, TONE_CLASS } from "@/components/brand/types";
import "@/components/brand/brand.css";

/**
 * Branded loader: vertical 8 → rotate → infinity → roof → icon.
 */
export function EightcaseBrandLoader({
  size = "md",
  tone = "forest",
  className = "",
  loop = true,
  label = "Laddar",
}: EightcaseBrandLoaderProps) {
  const loaderSize = getBrandMetrics(size).loader;

  return (
    <div
      className={`ec-brand-loader inline-flex flex-col items-center ${TONE_CLASS[tone]} ${className}`.trim()}
      data-loop={loop ? "true" : "false"}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <svg
        viewBox="0 0 48 56"
        width={loaderSize}
        height={(loaderSize * 56) / 48}
        aria-hidden
      >
        <path
          className="ec-loader-infinity"
          d="M24 30
             C17.5 23.5 10.5 23.5 10.5 30
             C10.5 36.5 17.5 36.5 24 30
             C30.5 23.5 37.5 23.5 37.5 30
             C37.5 36.5 30.5 36.5 24 30"
        />
        <g className="ec-loader-eight-wrap">
          <g className="ec-loader-eight">
            <ellipse cx="24" cy="19" rx="5.2" ry="7.2" />
            <ellipse cx="24" cy="35" rx="5.2" ry="7.2" />
          </g>
        </g>
        <g className="ec-loader-roof">
          <path d="M6 22 L24 8 L42 22" />
          <path d="M10 22 h28" opacity="0.35" />
        </g>
      </svg>
    </div>
  );
}
