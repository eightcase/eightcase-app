import { MetricCard } from "@/components/admin/metric-card";
import { DASHBOARD_METRICS } from "@/lib/admin/mock-data";

function formatNumber(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

export function AdminOverview() {
  const metrics = DASHBOARD_METRICS;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-ec-ink">Dashboard</h1>
        <p className="text-sm text-ec-text-muted">Senaste 30 dagarna</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Aktiva kampanjer" value={String(metrics.activeCampaigns)} />
        <MetricCard label="QR-scans" value={formatNumber(metrics.qrScans)} />
        <MetricCard
          label="Visualiseringar skapade"
          value={formatNumber(metrics.visualizations)}
        />
        <MetricCard
          label="Bokade konsultationer"
          value={formatNumber(metrics.bookedConsultations)}
          highlight
        />
        <MetricCard
          label="Konverteringsgrad"
          value={`${metrics.conversionRate} %`}
          hint="Avslutade visualiseringar → bokat samtal"
        />
      </div>
    </div>
  );
}
