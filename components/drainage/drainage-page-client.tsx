"use client";

import { useState } from "react";
import Link from "next/link";
import { DrainageFunnel } from "@/components/drainage/drainage-funnel";
import { CONTRACTOR_BRAND } from "@/lib/brand/contractor";
import { ROUTES } from "@/lib/platform/zones";

export function DrainagePageClient() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div className="zone-funnel min-h-screen px-6 py-12">
        <div className="mx-auto max-w-lg">
          <Link href={ROUTES.marketing.home} className="text-sm text-ec-text-muted hover:text-ec-warm">
            ← Eightcase
          </Link>
          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
            Dräneringsanalys
          </p>
          <h1 className="font-display mt-4 text-3xl text-ec-warm">
            Bedöm dräneringsbehov för din fastighet
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ec-text-muted">
            Få en indikativ riskbedömning och kostnadsnivå — särskilt värdefullt om markarbete
            redan planeras.
          </p>
          <p className="mt-2 text-xs text-ec-text-dim">{CONTRACTOR_BRAND.tagline}</p>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="btn-funnel mt-8 flex h-12 w-full items-center justify-center text-sm font-medium"
          >
            Starta analys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="zone-funnel min-h-screen px-6 py-8">
      <div className="mx-auto max-w-lg">
        <DrainageFunnel
          origin="drainage"
          poolEstimate={null}
          onClose={() => setStarted(false)}
        />
      </div>
    </div>
  );
}
