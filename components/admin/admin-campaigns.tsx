import Link from "next/link";
import { CampaignFlyerPreview } from "@/components/admin/campaign-flyer-preview";
import { CampaignStatusBadge } from "@/components/admin/campaign-status-badge";
import { MOCK_CAMPAIGNS } from "@/lib/admin/mock-data";
import { ROUTES } from "@/lib/platform/zones";

function formatNumber(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

export function AdminCampaigns() {
  const featuredCampaign = MOCK_CAMPAIGNS[0];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-medium text-ec-warm">Kampanjer</h1>
          <p className="text-sm text-ec-text-muted">QR-flyers och lokala områdeskampanjer</p>
        </div>
        <Link
          href={ROUTES.admin.campaignNew}
          className="btn-primary inline-flex h-9 items-center rounded-md px-4 text-sm font-medium"
        >
          Skapa ny kampanj
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-3">
          {MOCK_CAMPAIGNS.map((campaign) => (
            <article key={campaign.id} className="admin-panel p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium text-ec-warm">{campaign.name}</h3>
                  <p className="mt-1 text-xs text-ec-text-muted">{campaign.area}</p>
                </div>
                <CampaignStatusBadge status={campaign.status} />
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <Metric label="Förväntad räckvidd" value={formatNumber(campaign.expectedReach)} />
                <Metric label="Est. scan-rate" value={`${campaign.estimatedScanRate} %`} />
                <Metric label="Est. leads" value={formatNumber(campaign.estimatedLeads)} />
                <Metric label="Leads nu" value={formatNumber(campaign.leads)} emphasize />
              </dl>

              <dl className="mt-3 grid grid-cols-3 gap-3 text-xs text-ec-text-muted">
                <div>
                  <dt>Scans</dt>
                  <dd className="mt-0.5 font-medium tabular-nums text-ec-warm">
                    {formatNumber(campaign.scans)}
                  </dd>
                </div>
                <div>
                  <dt>Avslutade funnels</dt>
                  <dd className="mt-0.5 font-medium tabular-nums text-ec-warm">
                    {formatNumber(campaign.completedFunnels)}
                  </dd>
                </div>
                <div>
                  <dt>Bokade samtal</dt>
                  <dd className="mt-0.5 font-medium tabular-nums text-ec-sage">
                    {formatNumber(campaign.bookedCalls)}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {featuredCampaign ? <CampaignFlyerPreview campaign={featuredCampaign} /> : null}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div>
      <dt className="text-ec-text-dim">{label}</dt>
      <dd
        className={`mt-0.5 font-medium tabular-nums ${
          emphasize ? "text-ec-sage" : "text-ec-warm"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
