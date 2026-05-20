import type { HomeMessages } from "@/lib/i18n/messages";

type ProofStripProps = {
  proof: HomeMessages["proof"];
};

export function ProofStrip({ proof }: ProofStripProps) {
  return (
    <div className="border-y border-ec-border bg-ec-bg-subtle/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 sm:flex-row sm:px-10">
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
          {proof.metrics.map((m) => (
            <div key={m.label}>
              <p className="font-display text-2xl text-ec-ink sm:text-3xl">{m.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-ec-text-dim">
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 text-center sm:text-right">
          <div className="flex -space-x-2">
            {proof.avatars.map((a) => (
              <span
                key={a.initials}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ec-bg-subtle bg-ec-bg-elevated text-[10px] font-medium text-ec-sage shadow-sm"
              >
                {a.initials}
              </span>
            ))}
          </div>
          <div>
            <p className="text-sm font-medium text-ec-ink">{proof.rating} ★</p>
            <p className="text-xs text-ec-text-dim">{proof.ratingLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
