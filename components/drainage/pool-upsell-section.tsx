import Link from "next/link";
import { POOL_UPSELL } from "@/lib/drainage/constants";
import { ROUTES } from "@/lib/platform/zones";

type PoolUpsellSectionProps = {
  /** When true, user already has pool estimate from linked journey. */
  linked?: boolean;
};

export function PoolUpsellSection({ linked }: PoolUpsellSectionProps) {
  return (
    <section className="mt-10 border-t border-ec-border pt-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
        Rådgivning · pool
      </p>
      <h2 className="font-display mt-4 text-2xl leading-snug text-ec-warm">
        {POOL_UPSELL.headline}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ec-text-muted">
        {POOL_UPSELL.subheadline}
      </p>
      <Link
        href={ROUTES.funnel.visualisera}
        className="btn-secondary mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-medium"
      >
        {POOL_UPSELL.cta}
      </Link>
      {linked ? (
        <p className="mt-3 text-xs text-ec-text-dim">
          Du kan även fortsätta med poolvisualisering i samma projekt.
        </p>
      ) : null}
    </section>
  );
}
