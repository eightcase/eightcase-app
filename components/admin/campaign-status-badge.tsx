import type { CampaignStatus } from "@/lib/admin/mock-data";

const STYLES: Record<CampaignStatus, string> = {
  Aktiv: "border-ec-sage/40 bg-ec-sage/10 text-ec-sage",
  Pågående: "border-amber-600/25 bg-amber-50 text-amber-900/90",
  Klar: "border-ec-border bg-ec-bg-subtle text-ec-text-muted",
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
