"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EightcaseBrandLoader } from "@/components/brand";
import {
  ContinueButton,
  FeatureCard,
  OptionCard,
  StepHeadline,
} from "@/components/visualisera/step-ui";
import { PoolUpsellSection } from "@/components/drainage/pool-upsell-section";
import {
  DRAINAGE_ANALYSIS_MS,
  DRAINAGE_ANALYSIS_STEPS,
  DRAINAGE_SYMPTOMS,
  HOUSE_AGE_OPTIONS,
} from "@/lib/drainage/constants";
import { assessDrainage } from "@/lib/drainage/assessment";
import type { DrainageFunnelStep, DrainageState, HouseAge, RiskLevel } from "@/lib/drainage/types";
import { initialDrainageState } from "@/lib/drainage/types";
import { buildCoordinatedSummary } from "@/lib/upsell/coordinated";
import type { UpsellOrigin } from "@/lib/upsell/types";
import type { PriceEstimate } from "@/lib/visualisera/types";

const STEP_ORDER: DrainageFunnelStep[] = ["age", "symptoms", "analyzing", "result"];

type DrainageFunnelProps = {
  origin: UpsellOrigin;
  poolEstimate: PriceEstimate | null;
  onClose: () => void;
  onComplete?: (assessment: ReturnType<typeof assessDrainage>) => void;
};

export function DrainageFunnel({
  origin,
  poolEstimate,
  onClose,
  onComplete,
}: DrainageFunnelProps) {
  const [step, setStep] = useState<DrainageFunnelStep>("age");
  const [state, setState] = useState<DrainageState>(initialDrainageState);
  const [analysisIndex, setAnalysisIndex] = useState(0);
  const hasCompletedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const assessment = useMemo(
    () => (step === "result" ? assessDrainage(state, poolEstimate) : null),
    [step, state, poolEstimate],
  );

  const goNext = useCallback(() => {
    const i = STEP_ORDER.indexOf(step);
    if (i >= 0 && i < STEP_ORDER.length - 1) setStep(STEP_ORDER[i + 1]!);
  }, [step]);

  const goBack = useCallback(() => {
    const i = STEP_ORDER.indexOf(step);
    if (i > 0 && step !== "analyzing") setStep(STEP_ORDER[i - 1]!);
  }, [step]);

  useEffect(() => {
    if (step !== "analyzing") return;
    setAnalysisIndex(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    DRAINAGE_ANALYSIS_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setAnalysisIndex(i), i * DRAINAGE_ANALYSIS_MS));
    });
    timers.push(
      setTimeout(() => {
        setStep("result");
      }, DRAINAGE_ANALYSIS_STEPS.length * DRAINAGE_ANALYSIS_MS + 300),
    );
    return () => timers.forEach(clearTimeout);
  }, [step]);

  useEffect(() => {
    if (step !== "result") {
      hasCompletedRef.current = false;
      return;
    }
    if (!assessment || hasCompletedRef.current) return;
    hasCompletedRef.current = true;
    onCompleteRef.current?.(assessment);
  }, [step, assessment]);

  const toggleSymptom = (symptom: string) => {
    setState((s) => {
      if (symptom === "Ingen märkbar problematik") {
        return { ...s, symptoms: ["Ingen märkbar problematik"] };
      }
      const withoutNone = s.symptoms.filter((x) => x !== "Ingen märkbar problematik");
      const next = withoutNone.includes(symptom)
        ? withoutNone.filter((x) => x !== symptom)
        : [...withoutNone, symptom];
      return { ...s, symptoms: next };
    });
  };

  return (
    <div key={step} className="funnel-step-enter">
      {step !== "analyzing" && step !== "result" ? (
        <button
          type="button"
          onClick={step === "age" ? onClose : goBack}
          className="mb-6 text-sm text-ec-text-muted transition hover:text-ec-warm"
        >
          {step === "age" ? "Stäng" : "← Tillbaka"}
        </button>
      ) : null}

      {step === "age" && (
        <>
          <StepHeadline
            title="Husets ålder"
            subtitle="Hjälper oss bedöma hur dräneringen kan ha åldrats."
          />
          <div className="grid gap-2">
            {HOUSE_AGE_OPTIONS.map((age) => (
              <OptionCard
                key={age}
                label={age}
                selected={state.houseAge === age}
                onSelect={() => setState((s) => ({ ...s, houseAge: age as HouseAge }))}
              />
            ))}
          </div>
          <ContinueButton disabled={!state.houseAge} onClick={goNext}>
            Fortsätt
          </ContinueButton>
        </>
      )}

      {step === "symptoms" && (
        <>
          <StepHeadline title="Har du upplevt något av detta?" />
          <div className="grid gap-2">
            {DRAINAGE_SYMPTOMS.map((symptom) => (
              <FeatureCard
                key={symptom}
                label={symptom}
                checked={state.symptoms.includes(symptom)}
                onToggle={() => toggleSymptom(symptom)}
              />
            ))}
          </div>
          <ContinueButton
            disabled={state.symptoms.length === 0}
            onClick={goNext}
          >
            Beräkna risk
          </ContinueButton>
        </>
      )}

      {step === "analyzing" && (
        <DrainageAnalysisStep activeIndex={analysisIndex} />
      )}

      {step === "result" && assessment ? (
        <DrainageResultStep
          assessment={assessment}
          origin={origin}
          poolEstimate={poolEstimate}
          onBook={() =>
            window.alert("Tack! Rådgivning bokas i en riktig version (demo).")
          }
        />
      ) : null}
    </div>
  );
}

function DrainageAnalysisStep({ activeIndex }: { activeIndex: number }) {
  const progress = ((activeIndex + 1) / DRAINAGE_ANALYSIS_STEPS.length) * 100;

  return (
    <div className="py-4">
      <div className="mb-8 flex justify-center">
        <EightcaseBrandLoader size="lg" tone="forest" loop label="Analyserar din tomt" />
      </div>
      <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-xl border border-ec-border loading-preview-dark">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(100,110,95,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(100,110,95,0.12) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(80,90,70,0.25),transparent_55%)]" />
        <div className="funnel-loading-scan pointer-events-none absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-ec-sage/50 to-transparent" />
        <div className="absolute bottom-3 left-3 rounded bg-ec-forest/70 px-2 py-1 text-[9px] text-ec-cream/80 backdrop-blur-sm">
          AI · tomtanalys
        </div>
      </div>

      <p className="text-center text-[11px] uppercase tracking-[0.28em] text-ec-sage">
        Riskbedömning
      </p>
      <h2 className="font-display mt-3 text-center text-2xl text-ec-warm">
        Analyserar din tomt
      </h2>

      <div className="mx-auto mt-8 max-w-xs">
        <div className="mb-2 flex justify-between text-[11px] text-ec-text-dim">
          <span>Bearbetar</span>
          <span>{Math.round(progress)} %</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-ec-border">
          <div
            className="funnel-progress-shimmer relative h-full rounded-full bg-ec-sage/70 transition-[width] duration-[2400ms] ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ul className="mt-10 space-y-2">
        {DRAINAGE_ANALYSIS_STEPS.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li
              key={s.label}
              className={`rounded-xl px-4 py-3 transition-all duration-500 ${
                active ? "funnel-card text-ec-warm" : done ? "text-ec-sage" : "text-ec-text-dim"
              }`}
            >
              <span className="text-sm font-medium">{s.label}</span>
              {(active || done) && (
                <span className="mt-0.5 block text-xs text-ec-text-muted">{s.detail}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DrainageResultStep({
  assessment,
  origin,
  poolEstimate,
  onBook,
}: {
  assessment: ReturnType<typeof assessDrainage>;
  origin: UpsellOrigin;
  poolEstimate: PriceEstimate | null;
  onBook: () => void;
}) {
  const summary = buildCoordinatedSummary(poolEstimate, assessment);
  const riskClass = riskBadgeClass(assessment.riskLevel);

  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
        Din bedömning
      </p>
      <h2 className="font-display mt-3 text-2xl text-ec-warm">Dräneringsanalys</h2>

      <div className={`mt-6 inline-flex rounded-full border px-4 py-1.5 text-sm font-medium ${riskClass}`}>
        Risknivå: {assessment.riskLevel}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ec-text-muted">
        {assessment.recommendation}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm text-ec-text-muted">
        {assessment.problemZones.map((z) => (
          <li key={z} className="flex gap-2">
            <span className="text-ec-sage">·</span>
            {z}
          </li>
        ))}
      </ul>

      <div className="funnel-card mt-8 p-5">
        <p className="text-xs uppercase tracking-wider text-ec-text-dim">
          Uppskattad dräneringskostnad
        </p>
        <p className="font-display mt-2 text-2xl text-ec-warm">{summary.drainageRange}</p>
      </div>

      {poolEstimate ? (
        <>
          <div className="funnel-card mt-3 p-5">
            <p className="text-xs uppercase tracking-wider text-ec-text-dim">
              Sammanlagt pool + dränering
            </p>
            <p className="font-display mt-2 text-2xl text-ec-warm">{summary.combinedRange}</p>
            <p className="mt-2 text-xs text-ec-text-muted">
              Pool: {summary.poolRange}
            </p>
          </div>
          <div className="mt-4 rounded-xl border border-ec-sage/20 bg-ec-sage/5 px-4 py-4">
            <p className="text-sm leading-relaxed text-ec-warm">{summary.savingsLabel}</p>
            <p className="mt-1 text-xs text-ec-text-muted">
              Jämfört med separata markarbeten (uppskattning ca {summary.separateRange}).
            </p>
          </div>
        </>
      ) : (
        <p className="mt-4 text-sm text-ec-text-muted">
          Lägg till poolvisualisering för att se samordnad besparing på markarbete.
        </p>
      )}

      <button
        type="button"
        onClick={onBook}
        className="btn-funnel mt-8 flex h-12 w-full items-center justify-center text-sm font-medium"
      >
        Boka rådgivning
      </button>

      {origin === "drainage" && !poolEstimate ? <PoolUpsellSection /> : null}
    </div>
  );
}

function riskBadgeClass(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    Låg: "risk-badge-lag",
    Måttlig: "risk-badge-mattlig",
    Förhöjd: "risk-badge-forhojd",
    Hög: "risk-badge-hog",
  };
  return map[level];
}
