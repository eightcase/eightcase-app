"use client";

import { useEffect, useRef, useState } from "react";
import type { PriceEstimate } from "@/lib/visualisera/types";
import { formatMonthlyRange, formatPriceRange } from "@/lib/visualisera/pricing";

function formatKr(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

type AnimatedMetricsProps = {
  estimate: PriceEstimate;
  valueIncrease: { min: number; max: number };
  isUpdating?: boolean;
};

export function AnimatedMetrics({ estimate, valueIncrease, isUpdating }: AnimatedMetricsProps) {
  const [pulse, setPulse] = useState(false);
  const prevKey = useRef("");

  const key = `${estimate.min}-${estimate.max}-${valueIncrease.min}`;

  useEffect(() => {
    if (prevKey.current && prevKey.current !== key) {
      setPulse(true);
      const t = window.setTimeout(() => setPulse(false), 600);
      return () => window.clearTimeout(t);
    }
    prevKey.current = key;
  }, [key]);

  return (
    <div
      className={`mt-6 grid gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 ${pulse ? "viz-metrics--pulse" : ""} ${isUpdating ? "viz-metrics--dim" : ""}`}
    >
      <div className="funnel-card p-4 sm:p-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-ec-text-dim">
          Uppskattat pris
        </p>
        <p className="font-display mt-2 text-lg text-ec-warm transition-all duration-500 sm:text-xl">
          {formatPriceRange(estimate)}
        </p>
        <p className="mt-2 text-xs text-ec-text-muted">Uppdateras när du justerar valen</p>
      </div>
      <div className="funnel-card p-4 sm:p-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-ec-text-dim">
          Värdeökning fastighet
        </p>
        <p className="font-display mt-2 text-lg text-ec-warm transition-all duration-500 sm:text-xl">
          {formatKr(valueIncrease.min)} – {formatKr(valueIncrease.max)} kr
        </p>
        <p className="mt-2 text-xs text-ec-text-muted">
          Ca {formatMonthlyRange(estimate)} i finansiering
        </p>
      </div>
    </div>
  );
}
