import { DRAINAGE_UPSELL } from "@/lib/drainage/constants";

type DrainageUpsellSectionProps = {
  onOpen: () => void;
  completed?: boolean;
};

export function DrainageUpsellSection({ onOpen, completed }: DrainageUpsellSectionProps) {
  return (
    <section className="funnel-result-reveal funnel-result-reveal-delay-4 mt-12 border-t border-ec-border pt-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
        Rådgivning · markarbete
      </p>
      <h2 className="font-display mt-4 text-2xl leading-snug text-ec-warm sm:text-[1.65rem]">
        {DRAINAGE_UPSELL.headline}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-ec-text-muted">
        {DRAINAGE_UPSELL.subheadline}
      </p>
      {completed ? (
        <p className="mt-4 text-sm text-ec-sage">Dräneringsanalys genomförd — se sammanfattning ovan.</p>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className="btn-secondary mt-6 inline-flex h-11 items-center rounded-full px-6 text-sm font-medium"
        >
          {DRAINAGE_UPSELL.cta}
        </button>
      )}
    </section>
  );
}
