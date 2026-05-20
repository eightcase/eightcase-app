import { MOCK_COMPANY } from "@/lib/admin/mock-data";

export function AdminSettings() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-ec-warm">Inställningar</h1>
        <p className="text-sm text-ec-text-muted">
          Varumärke i widget, flyers och kundkommunikation
        </p>
      </div>
      <div className="admin-panel grid gap-8 p-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-ec-text-dim">Företagslogotyp</p>
          <div className="mt-3 flex h-24 w-40 items-center justify-center rounded border border-dashed border-ec-border bg-ec-bg-subtle">
            <span className="font-display text-lg text-ec-text-muted">SP</span>
          </div>
          <p className="mt-2 text-xs text-ec-text-dim">Ladda upp SVG eller PNG (demo)</p>
        </div>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-ec-text-dim">Företagsnamn</dt>
            <dd className="mt-1 text-ec-warm">{MOCK_COMPANY.companyName}</dd>
          </div>
          <div>
            <dt className="text-ec-text-dim">Kontakt-e-post</dt>
            <dd className="mt-1 text-ec-warm">{MOCK_COMPANY.email}</dd>
          </div>
          <div>
            <dt className="text-ec-text-dim">Telefon</dt>
            <dd className="mt-1 text-ec-warm">{MOCK_COMPANY.phone}</dd>
          </div>
          <div>
            <dt className="text-ec-text-dim">Primärfärg</dt>
            <dd className="mt-2 flex items-center gap-3">
              <span
                className="h-8 w-8 rounded border border-ec-border"
                style={{ backgroundColor: MOCK_COMPANY.primaryColor }}
              />
              <span className="font-mono text-ec-warm">{MOCK_COMPANY.primaryColor}</span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
