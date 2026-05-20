"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DrainageOverlay } from "@/components/drainage/drainage-overlay";
import { AddressStep } from "@/components/visualisera/address-step";
import { FunnelShell } from "@/components/visualisera/funnel-shell";
import { LoadingStep } from "@/components/visualisera/loading-step";
import { ResultStep } from "@/components/visualisera/result-step";
import { StyleStep } from "@/components/visualisera/style-step";
import {
  ContinueButton,
  FeatureCard,
  OptionCard,
  StepHeadline,
} from "@/components/visualisera/step-ui";
import {
  BUDGET_OPTIONS,
  FEATURES,
  LOADING_STEP_MS,
  LOADING_STEPS,
  POOL_SIZES,
  TIMELINE_OPTIONS,
} from "@/lib/visualisera/constants";
import {
  calculateEstimate,
  formatMonthlyRange,
  formatPriceRange,
} from "@/lib/visualisera/pricing";
import {
  prepareMockLead,
  runAIVizPipeline,
  type AIPipelineResult,
  type PreparedLead,
} from "@/lib/ai-visualization/pipeline";
import { saveDemoLead } from "@/lib/admin/demo-leads";
import { saveLeadToSupabase } from "@/lib/admin/supabase-leads";
import { getSupabasePublicConfigStatus } from "@/lib/supabase/client";
import type {
  BudgetRange,
  FunnelState,
  FunnelStep,
  PoolSize,
  Timeline,
} from "@/lib/visualisera/types";
import { initialFunnelState } from "@/lib/visualisera/types";
import type { DrainageAssessment } from "@/lib/drainage/types";

const STEP_ORDER: FunnelStep[] = [
  "address",
  "style",
  "size",
  "features",
  "budget",
  "loading",
  "result",
];

const PROGRESS: Partial<Record<FunnelStep, number>> = {
  address: 0,
  style: 1,
  size: 2,
  features: 3,
  budget: 4,
};

const SIZE_META: Record<PoolSize, string> = {
  Kompakt: "Ca 6–8 m² · perfekt för mindre tomter",
  Mellan: "Ca 12–16 m² · vår mest valda storlek",
  Stor: "Ca 20–28 m² · generös yta för sim och lounge",
  Lyx: "30 m²+ · skräddarsydd layout och premiumfinish",
};

export function VisualiseraFunnel() {
  const [step, setStep] = useState<FunnelStep>("address");
  const [state, setState] = useState<FunnelState>(initialFunnelState);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [drainageOpen, setDrainageOpen] = useState(false);
  const [drainageAssessment, setDrainageAssessment] =
    useState<DrainageAssessment | null>(null);
  const [pipelineResult, setPipelineResult] = useState<AIPipelineResult | null>(null);
  const [preparedLead, setPreparedLead] = useState<PreparedLead | null>(null);
  const [leadSaveStatus, setLeadSaveStatus] = useState<
    "idle" | "saving" | "demo" | "supabase" | "error"
  >("idle");
  const [leadSaveDetail, setLeadSaveDetail] = useState<string | null>(null);
  const supabaseConfig = getSupabasePublicConfigStatus();
  const lastSavedSignatureRef = useRef<string | null>(null);
  const goNext = useCallback(() => {
    const i = STEP_ORDER.indexOf(step);
    if (i >= 0 && i < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[i + 1]!);
    }
  }, [step]);

  const goBack = useCallback(() => {
    const i = STEP_ORDER.indexOf(step);
    if (i > 0 && step !== "loading" && step !== "result") {
      setStep(STEP_ORDER[i - 1]!);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "loading") return;

    setLeadSaveStatus("idle");
    lastSavedSignatureRef.current = null;
    setPipelineResult(null);
    setLoadingIndex(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    LOADING_STEPS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setLoadingIndex(i);
        }, i * LOADING_STEP_MS),
      );
    });

    timers.push(
      setTimeout(() => {
        setStep("result");
      }, LOADING_STEPS.length * LOADING_STEP_MS + 400),
    );

    void runAIVizPipeline({
      address: state.address,
      style: state.style ?? "Modern",
      features: state.features,
    }).then((result) => {
      if (!cancelled) setPipelineResult(result);
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [step, state.address, state.features, state.style]);

  const estimate = useMemo(() => calculateEstimate(state), [state]);
  const progressIndex = PROGRESS[step] ?? 0;

  useEffect(() => {
    if (step !== "result") return;
    const valueIncrease = {
      min: Math.round(((estimate.min + estimate.max) / 2) * 0.12),
      max: Math.round(((estimate.min + estimate.max) / 2) * 0.18),
    };
    const nextLead = prepareMockLead({
      state,
      estimate,
      valueIncrease,
      drainageAssessment,
      pipeline: pipelineResult,
    });
    setPreparedLead((prev) => (prev?.signature === nextLead.signature ? prev : nextLead));
  }, [drainageAssessment, estimate, pipelineResult, state, step]);

  useEffect(() => {
    if (step !== "result" || !preparedLead) return;
    const signature = preparedLead.signature;
    if (lastSavedSignatureRef.current === signature) return;

    let cancelled = false;
    const persistLead = async () => {
      setLeadSaveStatus("saving");
      setLeadSaveDetail(null);

      try {
        const supabaseResult = await saveLeadToSupabase(preparedLead);
        if (cancelled) return;

        if (supabaseResult.success) {
          lastSavedSignatureRef.current = signature;
          setLeadSaveStatus("supabase");
          setLeadSaveDetail(supabaseResult.message);
          return;
        }

        saveDemoLead(preparedLead);
        lastSavedSignatureRef.current = signature;
        setLeadSaveStatus("demo");
        setLeadSaveDetail(supabaseResult.message);
      } catch (err) {
        if (cancelled) return;
        setLeadSaveStatus("error");
        setLeadSaveDetail(
          err instanceof Error ? err.message : "Okänt fel vid sparning av lead.",
        );
      }
    };

    void persistLead();
    return () => {
      cancelled = true;
    };
  }, [preparedLead, step]);

  const toggleFeature = (feature: string) => {
    setState((s) => ({
      ...s,
      features: s.features.includes(feature)
        ? s.features.filter((f) => f !== feature)
        : [...s.features, feature],
    }));
  };

  const handleDrainageComplete = useCallback((a: DrainageAssessment) => {
    setDrainageAssessment((prev) => {
      if (
        prev &&
        prev.riskLevel === a.riskLevel &&
        prev.recommendation === a.recommendation &&
        prev.drainageMin === a.drainageMin &&
        prev.drainageMax === a.drainageMax
      ) {
        return prev;
      }
      return a;
    });
  }, []);

  return (
    <>
    <FunnelShell
      step={step}
      stepKey={step}
      progressIndex={progressIndex}
      onBack={step !== "address" ? goBack : undefined}
    >
      {step === "address" && (
        <AddressStep
          address={state.address}
          onChange={(address) => setState((s) => ({ ...s, address }))}
          onContinue={goNext}
        />
      )}

      {step === "style" && (
        <StyleStep
          value={state.style}
          onSelect={(style) => setState((s) => ({ ...s, style }))}
          onContinue={goNext}
        />
      )}

      {step === "size" && <SizeStep value={state.size} onSelect={(size) => setState((s) => ({ ...s, size }))} onContinue={goNext} />}

      {step === "features" && (
        <FeaturesStep
          selected={state.features}
          onToggle={toggleFeature}
          onContinue={goNext}
        />
      )}

      {step === "budget" && (
        <BudgetStep
          budget={state.budget}
          timeline={state.timeline}
          onBudget={(budget) => setState((s) => ({ ...s, budget }))}
          onTimeline={(timeline) => setState((s) => ({ ...s, timeline }))}
          onContinue={() => setStep("loading")}
        />
      )}

      {step === "loading" && <LoadingStep activeIndex={loadingIndex} />}

      {step === "result" && (
        <ResultStep
          state={state}
          estimate={estimate}
          priceRange={formatPriceRange(estimate)}
          monthlyRange={formatMonthlyRange(estimate)}
          emailSent={emailSent}
          drainageAssessment={drainageAssessment}
          leadSaveStatus={leadSaveStatus}
          leadSaveDetail={leadSaveDetail}
          supabaseConfig={supabaseConfig}
          onOpenDrainage={() => setDrainageOpen(true)}
          onBook={() => {
            window.alert(
              "Tack! I en riktig demo skulle detta öppna bokning av kostnadsfri konsultation.",
            );
          }}
          onEmail={() => setEmailSent(true)}
        />
      )}
    </FunnelShell>
    <DrainageOverlay
      open={drainageOpen}
      onClose={() => setDrainageOpen(false)}
      origin="pool"
      poolEstimate={estimate}
      onComplete={handleDrainageComplete}
    />
    </>
  );
}

function SizeStep({
  value,
  onSelect,
  onContinue,
}: {
  value: PoolSize | null;
  onSelect: (s: PoolSize) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <StepHeadline title="Hur stor pool tänker du dig?" />
      <div className="grid gap-3">
        {POOL_SIZES.map((size) => (
          <OptionCard
            key={size}
            label={size}
            description={SIZE_META[size]}
            selected={value === size}
            onSelect={() => onSelect(size)}
          />
        ))}
      </div>
      <ContinueButton disabled={!value} onClick={onContinue}>
        Fortsätt
      </ContinueButton>
    </>
  );
}

function FeaturesStep({
  selected,
  onToggle,
  onContinue,
}: {
  selected: string[];
  onToggle: (f: string) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <StepHeadline
        title="Vilka tillval vill du inkludera?"
        subtitle="Välj ett eller flera — du kan ändra senare."
      />
      <div className="grid gap-2 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature}
            label={feature}
            checked={selected.includes(feature)}
            onToggle={() => onToggle(feature)}
          />
        ))}
      </div>
      <ContinueButton onClick={onContinue}>Fortsätt</ContinueButton>
    </>
  );
}

function BudgetStep({
  budget,
  timeline,
  onBudget,
  onTimeline,
  onContinue,
}: {
  budget: BudgetRange | null;
  timeline: Timeline | null;
  onBudget: (b: BudgetRange) => void;
  onTimeline: (t: Timeline) => void;
  onContinue: () => void;
}) {
  return (
    <>
      <StepHeadline title="Budget och tidsplan" />
      <p className="mb-3 text-sm font-medium text-ec-warm">Ungefärlig budget</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {BUDGET_OPTIONS.map((b) => (
          <OptionCard
            key={b}
            label={b}
            selected={budget === b}
            onSelect={() => onBudget(b)}
          />
        ))}
      </div>
      <p className="mb-3 mt-8 text-sm font-medium text-ec-warm">När vill du komma igång?</p>
      <div className="grid gap-2">
        {TIMELINE_OPTIONS.map((t) => (
          <OptionCard
            key={t}
            label={t}
            selected={timeline === t}
            onSelect={() => onTimeline(t)}
          />
        ))}
      </div>
      <ContinueButton disabled={!budget || !timeline} onClick={onContinue}>
        Skapa min visualisering
      </ContinueButton>
    </>
  );
}
