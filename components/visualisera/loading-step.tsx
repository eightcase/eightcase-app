"use client";

import { useEffect, useState } from "react";
import { EightcaseBrandLoader } from "@/components/brand";
import { PoolScene } from "@/components/pool-scene";
import { LOADING_STEPS } from "@/lib/visualisera/constants";

type LoadingStepProps = {
  activeIndex: number;
};

export function LoadingStep({ activeIndex }: LoadingStepProps) {
  const [progress, setProgress] = useState(0);
  const total = LOADING_STEPS.length;
  const current = LOADING_STEPS[activeIndex];

  useEffect(() => {
    const base = (activeIndex / total) * 100;
    setProgress(base);
    const t = requestAnimationFrame(() => {
      setProgress(((activeIndex + 1) / total) * 100);
    });
    return () => cancelAnimationFrame(t);
  }, [activeIndex, total]);

  return (
    <div className="relative -mx-5 -mt-4 min-h-[calc(100vh-8rem)] sm:-mx-6">
      <div className="absolute inset-0 overflow-hidden">
        <LoadingMapPreview phase={activeIndex} />
        <div className="absolute inset-0 bg-gradient-to-b from-ec-forest-deep/55 via-ec-forest/75 to-ec-forest-deep/95" />
      </div>

      <div className="relative z-10 flex flex-col px-1 pt-6">
        <div className="mb-8 flex justify-center">
          <EightcaseBrandLoader
            size="lg"
            tone="cream"
            loop
            label="Skapar din visualisering"
          />
        </div>
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.32em] text-ec-sage">
          AI-visualisering
        </p>
        <h2 className="font-display mt-4 text-center text-3xl leading-tight text-ec-cream">
          Skapar din framtida pool
        </h2>
        {current ? (
          <p className="mx-auto mt-3 max-w-xs text-center text-sm text-ec-cream/75 transition-opacity duration-700">
            {current.label}
          </p>
        ) : null}

        <div className="mx-auto mt-10 w-full max-w-sm">
          <div className="mb-2 flex justify-between text-[11px] text-ec-cream/60">
            <span>Bearbetar</span>
            <span>{Math.round(progress)} %</span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-ec-border">
            <div
              className="funnel-progress-shimmer relative h-full rounded-full bg-gradient-to-r from-ec-sage/80 to-ec-sage-muted transition-[width] duration-[2800ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <ul className="mx-auto mt-12 w-full max-w-sm space-y-2">
          {LOADING_STEPS.map((step, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <li
                key={step.label}
                className={`rounded-xl px-4 py-3.5 transition-all duration-500 ${
                  active
                    ? "funnel-card scale-[1.02] text-ec-ink"
                    : done
                      ? "text-ec-sage-light"
                      : "text-ec-cream/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs transition ${
                      done
                        ? "bg-ec-sage/20 text-ec-sage"
                        : active
                          ? "border border-ec-sage/40 bg-ec-sage/15 text-ec-sage"
                          : "border border-ec-border"
                    }`}
                  >
                    {done ? "✓" : active ? (
                      <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-ec-sage" />
                    ) : (
                      "·"
                    )}
                  </span>
                  <div>
                    <span className="block text-sm font-medium">{step.label}</span>
                    {(active || done) && (
                      <span className="mt-0.5 block text-xs text-ec-text-muted">
                        {step.detail}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function LoadingMapPreview({ phase }: { phase: number }) {
  const showPool = phase >= 2;

  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: showPool ? 0.3 : 1 }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,110,95,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(100,110,95,0.15) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(160,150,130,0.25),transparent_50%)]" />
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ec-warm bg-ec-warm/80 shadow-lg" />
      </div>

      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: showPool ? 1 : 0 }}
      >
        <PoolScene variant="after" />
        <div className="funnel-loading-scan pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-ec-sage/60 to-transparent" />
      </div>
    </div>
  );
}

