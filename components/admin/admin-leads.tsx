import { LeadStatusBadge } from "@/components/admin/lead-status-badge";
import { MOCK_LEADS } from "@/lib/admin/mock-data";

export function AdminLeads() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-lg font-medium text-ec-warm">Leads</h1>
        <p className="text-sm text-ec-text-muted">
          Kvalificerade förfrågningar från visualiseringsfunneln
        </p>
      </div>
      <div className="admin-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-ec-border bg-ec-bg-subtle/80 text-xs uppercase tracking-wider text-ec-text-dim">
                <th className="px-4 py-2.5 font-medium">Namn</th>
                <th className="px-4 py-2.5 font-medium">Adress</th>
                <th className="px-4 py-2.5 font-medium">Stil</th>
                <th className="px-4 py-2.5 font-medium">Budget</th>
                <th className="px-4 py-2.5 font-medium">Tidsplan</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADS.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-ec-border-subtle hover:bg-ec-bg-subtle/50"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-ec-warm">{lead.name}</span>
                    <p className="mt-0.5 text-xs text-ec-text-dim">{lead.campaign}</p>
                  </td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.address}</td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.style}</td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.budget}</td>
                  <td className="px-4 py-3 text-ec-text-muted">{lead.timeline}</td>
                  <td className="px-4 py-3">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
