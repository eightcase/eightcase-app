"use client";

import { useCallback, useRef, useState } from "react";
import type { HomeMessages } from "@/lib/i18n/messages";
import { PoolScene } from "./pool-scene";

type BeforeAfterSliderProps = {
  beforeAfter: HomeMessages["beforeAfter"];
  sliderHint: string;
};

export function BeforeAfterSlider({
  beforeAfter,
  sliderHint,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    containerRef.current?.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const onPointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="group relative aspect-[4/3] w-full cursor-ew-resize overflow-hidden rounded-2xl border border-ec-border-subtle shadow-[var(--ec-shadow-lg)] sm:aspect-[21/9]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label={`${beforeAfter.before.label} / ${beforeAfter.after.label}`}
      >
        {/* After — full width underneath */}
        <PoolScene variant="after" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(6,9,8,0.5)_100%)]" />

        {/* Before — clipped */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <PoolScene variant="before" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(6,9,8,0.55)_100%)]" />
        </div>

        {/* Divider + handle */}
        <div
          className="absolute inset-y-0 z-20 w-px bg-white/30"
          style={{ left: `${position}%` }}
          aria-hidden
        >
          <div className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ec-cream/30 bg-ec-forest/85 shadow-[var(--ec-shadow-lg)] backdrop-blur-sm transition group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5 text-ec-sage"
              aria-hidden
            >
              <path d="M8 8l-4 4 4 4M16 8l4 4-4 4" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="pointer-events-none absolute top-6 left-6 z-10 rounded-full border border-ec-cream/20 bg-ec-forest/80 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-ec-cream/80 uppercase backdrop-blur-sm">
          {beforeAfter.before.label}
        </span>
        <span className="pointer-events-none absolute top-6 right-6 z-10 rounded-full border border-ec-sage/40 bg-ec-sage/30 px-4 py-1.5 text-[11px] font-medium tracking-[0.2em] text-ec-cream uppercase backdrop-blur-sm">
          {beforeAfter.after.label}
        </span>

        {/* Bottom captions */}
        <div className="pointer-events-none absolute right-6 bottom-6 left-6 z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <p className="max-w-xs text-sm leading-relaxed text-ec-text-muted/90">
            {beforeAfter.before.body}
          </p>
          <p className="max-w-xs text-right text-sm leading-relaxed text-ec-sage-muted sm:text-ec-text-muted">
            {beforeAfter.after.body}
          </p>
        </div>
      </div>

      {/* Accessible range control */}
      <label className="sr-only" htmlFor="before-after-range">
        {sliderHint}
      </label>
      <input
        id="before-after-range"
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        className="compare-range mt-6 w-full"
      />
      <p className="mt-3 text-center text-[11px] tracking-[0.2em] text-ec-text-dim uppercase">
        {sliderHint}
      </p>
    </div>
  );
}

