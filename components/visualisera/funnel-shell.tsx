import type { FunnelStep } from "@/lib/visualisera/types";
import { FUNNEL_PROGRESS_STEPS } from "@/lib/visualisera/constants";
import { CONTRACTOR_BRAND } from "@/lib/brand/contractor";

type FunnelMode = "steps" | "immersive" | "result";

type FunnelShellProps = {
  step: FunnelStep;
  progressIndex: number;
  stepKey: string;
  onBack?: () => void;
  children: React.ReactNode;
};

function modeForStep(step: FunnelStep): FunnelMode {
  if (step === "loading") return "immersive";
  if (step === "result") return "result";
  return "steps";
}

export function FunnelShell({
  step,
  progressIndex,
  stepKey,
  onBack,
  children,
}: FunnelShellProps) {
  const mode = modeForStep(step);
  const showProgress = mode === "steps";
  const progressPct =
    ((progressIndex + 1) / FUNNEL_PROGRESS_STEPS.length) * 100;

  const mainClass =
    mode === "immersive"
      ? "relative z-10 mx-auto max-w-lg px-0 pb-8 pt-0"
      : mode === "result"
        ? "relative z-10 mx-auto max-w-xl px-5 pb-24 pt-6 sm:px-6"
        : "relative z-10 mx-auto max-w-lg px-5 pb-20 pt-8";

  return (
    <div className="zone-funnel relative min-h-screen font-sans text-ec-text">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--zone-glow),transparent_55%)]"
        aria-hidden
      />

      {mode !== "immersive" ? (
        <header className="relative z-10 border-b border-ec-border bg-ec-bg-elevated/80">
          <div className="mx-auto flex max-w-lg items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ec-forest text-xs font-medium text-ec-cream">
                {CONTRACTOR_BRAND.shortName}
              </span>
              <p className="text-sm text-ec-text-muted">
                <span className="font-medium text-ec-ink">{CONTRACTOR_BRAND.name}</span>
              </p>
            </div>
            {onBack && showProgress ? (
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-ec-text-muted transition hover:text-ec-forest"
              >
                Tillbaka
              </button>
            ) : (
              <span className="w-14" />
            )}
          </div>
          <p className="mx-auto max-w-lg px-5 pb-3 text-center text-xs text-ec-text-dim">
            {CONTRACTOR_BRAND.tagline}
          </p>
        </header>
      ) : null}

      {showProgress ? (
        <div className="relative z-10 mx-auto max-w-lg px-5 pt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-ec-text-dim">
            <span>
              Steg {progressIndex + 1} av {FUNNEL_PROGRESS_STEPS.length}
            </span>
            <span className="text-ec-text-muted">
              {FUNNEL_PROGRESS_STEPS[progressIndex]}
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-ec-border">
            <div
              className="h-full rounded-full bg-ec-sage transition-all duration-700 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      ) : null}

      <main className={mainClass}>
        <div key={stepKey} className={mode === "immersive" ? "" : "funnel-step-enter"}>
          {children}
        </div>
      </main>

      {mode !== "immersive" ? (
        <footer className="relative z-10 pb-6 text-center">
          <p className="text-[10px] text-ec-text-dim">Powered by Eightcase</p>
        </footer>
      ) : null}
    </div>
  );
}
