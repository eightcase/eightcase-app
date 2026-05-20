type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
};

export function MetricCard({ label, value, hint, highlight }: MetricCardProps) {
  return (
    <div
      className={`admin-panel p-4 ${
        highlight ? "border-ec-sage/25 ring-1 ring-ec-sage/15" : ""
      }`}
    >
      <p className="text-xs uppercase tracking-wider text-ec-text-dim">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-ec-warm">{value}</p>
      {hint ? <p className="mt-2 text-xs text-ec-text-muted">{hint}</p> : null}
    </div>
  );
}
