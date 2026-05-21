"use client";

import Image from "next/image";
import { useState } from "react";
import type { AITransformationResult } from "@/lib/ai-transformation/types";
import { BeforeAfterPresentation } from "@/components/visualisera/before-after-presentation";
import { PropertyPreview } from "@/components/visualisera/property-preview";

type AiTransformationResultProps = {
  transformation: AITransformationResult;
  address: string;
  styleLabel: string;
  realAiEnabled: boolean;
};

function isDisplayableUrl(url: string | null): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/");
}

export function AiTransformationResult({
  transformation,
  address,
  styleLabel,
  realAiEnabled,
}: AiTransformationResultProps) {
  const [split, setSplit] = useState(50);
  const showGenerated =
    realAiEnabled &&
    transformation.status === "completed" &&
    isDisplayableUrl(transformation.generatedImageUrl);

  if (!showGenerated) {
    return (
      <div>
        <BeforeAfterPresentation styleLabel={styleLabel} />
        <p className="mt-3 text-sm leading-relaxed text-ec-text-muted">
          AI-visualisering är avstängd eller inte klar — visar konceptuell mock-vy.
        </p>
      </div>
    );
  }

  const beforeUrl = transformation.beforeImageUrl;
  const afterUrl = transformation.generatedImageUrl!;

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-ec-sage/40 bg-ec-sage/10 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-ec-sage">
          AI-genererad · {transformation.providerId}
        </span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ec-border shadow-[var(--ec-shadow-lg)] sm:aspect-[16/10] sm:rounded-3xl">
        {isDisplayableUrl(beforeUrl) ? (
          <Image
            src={beforeUrl}
            alt="Fastighet före"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <PropertyPreview address={address} className="absolute inset-0" label="Före" />
        )}
        <div
          className="absolute inset-0 overflow-hidden transition-[clip-path] duration-300"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <Image
            src={afterUrl}
            alt="Fastighet med pool"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div
          className="absolute bottom-0 top-0 z-10 w-0.5 bg-ec-cream shadow-lg"
          style={{ left: `${split}%` }}
        />
        <input
          type="range"
          min={10}
          max={90}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          className="absolute inset-0 z-20 cursor-ew-resize opacity-0"
          aria-label="Jämför före och efter"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ec-ink/85 to-transparent px-4 pb-4 pt-16">
          <p className="text-sm font-medium text-ec-cream">{styleLabel}</p>
          <p className="text-xs text-ec-cream/75">Satellitbild → AI-visualiserad pool</p>
        </div>
      </div>
    </div>
  );
}
