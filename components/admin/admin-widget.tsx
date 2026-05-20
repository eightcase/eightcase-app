"use client";

import { MOCK_COMPANY } from "@/lib/admin/mock-data";

export function AdminWidget() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-ec-warm">Widget</h1>
        <p className="text-sm text-ec-text-muted">Hemsida och inbäddad visualisering</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="admin-panel p-6">
          <h2 className="font-display text-xl text-ec-warm">
            Lägg Eightcase på er hemsida
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ec-text-muted">
            Lägg Eightcase på er hemsida och låt besökare skapa sin egen visualisering
            — direkt från er sajt, med ert varumärke i fokus.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ec-text-muted">
            <li>✓ Inbäddad visualiseringsfunnel</li>
            <li>✓ Leads till ert admin</li>
            <li>✓ Anpassad färg och logotyp</li>
          </ul>
          <button
            type="button"
            onClick={() =>
              window.alert("Widget-konfiguration kommer i en senare version (demo).")
            }
            className="btn-primary mt-6 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
          >
            Konfigurera widget
          </button>
        </div>
        <div className="admin-panel p-4">
          <p className="mb-3 text-xs uppercase tracking-wider text-ec-text-dim">
            Förhandsvisning
          </p>
          <div className="rounded border border-ec-border bg-ec-bg-subtle p-3">
            <div className="mb-2 flex items-center gap-1.5 border-b border-ec-border pb-2">
              <div className="h-1.5 w-1.5 rounded-full bg-ec-stone/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-ec-stone/40" />
              <div className="h-1.5 w-1.5 rounded-full bg-ec-stone/40" />
              <span className="ml-1 text-[9px] text-ec-text-dim">erpool.se</span>
            </div>
            <div
              className="rounded p-3"
              style={{ backgroundColor: `${MOCK_COMPANY.primaryColor}18` }}
            >
              <p className="text-xs text-ec-warm">Se din framtida pool</p>
              <div className="mt-2 h-16 rounded bg-gradient-to-br from-ec-forest/30 to-ec-forest-deep/50" />
              <button
                type="button"
                className="mt-2 w-full rounded-full py-1.5 text-[10px] font-medium text-ec-cream"
                style={{ backgroundColor: MOCK_COMPANY.primaryColor }}
              >
                Starta visualisering
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
