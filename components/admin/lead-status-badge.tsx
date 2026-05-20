import type { LeadStatus } from "@/lib/admin/mock-data";

const STYLES: Record<LeadStatus, string> = {
  Het: "border-amber-600/30 bg-amber-50 text-amber-800",
  Varm: "border-ec-sage/40 bg-ec-sage/10 text-ec-sage",
  Ny: "border-ec-border bg-ec-bg-subtle text-ec-text-muted",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
