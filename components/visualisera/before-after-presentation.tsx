"use client";

import { useState } from "react";
import { PoolScene } from "@/components/pool-scene";

type BeforeAfterPresentationProps = {
  styleLabel: string;
  className?: string;
};

export function BeforeAfterPresentation({ styleLabel, className = "" }: BeforeAfterPresentationProps) {
  const [mode, setMode] = useState<"split" | "before" | "after">("split");
  const [split, setSplit] = useState(50);

  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap gap-2">
        {(
          [
            { id: "before" as const, label: "Före" },
            { id: "split" as const, label: "Jämför" },
            { id: "after" as const, label: "Efter" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              mode === tab.id
                ? "border-ec-forest/40 bg-ec-forest/10 text-ec-forest"
                : "border-ec-border text-ec-text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-ec-border shadow-[var(--ec-shadow-lg)] sm:aspect-[16/10] sm:rounded-3xl">
        {mode === "before" ? <PoolScene variant="before" /> : null}
        {mode === "after" ? <PoolScene variant="after" /> : null}
        {mode === "split" ? (
          <>
            <PoolScene variant="before" />
            <div
              className="absolute inset-0 overflow-hidden transition-[clip-path] duration-300"
              style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
            >
              <PoolScene variant="after" />
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
          </>
        ) : null}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ec-ink/80 to-transparent px-4 pb-4 pt-16">
          <p className="text-sm font-medium text-ec-cream">{styleLabel}</p>
          <p className="text-xs text-ec-cream/75">Konceptuell före/efter-vy</p>
        </div>
      </div>
    </div>
  );
}
