import type { LeadCrmStatus } from "@/lib/admin/lead-crm";

const STYLES: Record<LeadCrmStatus, string> = {
  Ny: "border-ec-border bg-ec-bg-subtle text-ec-text-muted",
  Kontaktad: "border-ec-sage/40 bg-ec-sage/10 text-ec-sage",
  Bokad: "border-ec-forest/35 bg-ec-forest/10 text-ec-forest",
  Vunnen: "border-emerald-600/30 bg-emerald-50 text-emerald-800",
  Förlorad: "border-stone-400/30 bg-stone-100 text-stone-600",
};

export function CrmLeadStatusBadge({ status }: { status: LeadCrmStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
