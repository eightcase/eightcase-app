"use client";

import { useCallback, useEffect, useState } from "react";
import type { HomeMessages } from "@/lib/i18n/messages";

type HeroVideoMockupProps = {
  video: HomeMessages["video"];
};

const STEP_COUNT = 5;
const STEP_MS = 3200;

function MapZoomScene() {
  return (
    <div className="absolute inset-0 bg-[#1a1c18]">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(120,130,110,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(120,130,110,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(180,170,150,0.25),transparent_40%)]" />
      <div className="absolute left-[48%] top-[42%] h-8 w-8 -translate-x-1/2 -translate-y-full">
        <div className="mx-auto h-3 w-3 rounded-full border-2 border-white/90 bg-ec-accent shadow-lg" />
        <div className="mx-auto h-3 w-0.5 bg-white/80" />
      </div>
      <div className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[9px] text-white/70 backdrop-blur-sm">
        Satellit · Zoom
      </div>
    </div>
  );
}

function ScanScene() {
  return (
    <div className="absolute inset-0 bg-[#141614]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_80%,rgba(60,70,55,0.4),transparent)]" />
      <div className="absolute bottom-[15%] left-[10%] right-[15%] h-[40%] rounded-t-[3rem] border border-ec-sage/20 bg-[#1a2018]/80" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(138,154,130,0.15) 8px, rgba(138,154,130,0.15) 9px)",
        }}
      />
      <div className="absolute inset-x-[20%] top-[30%] h-px animate-pulse bg-ec-sage/50" />
      <div className="absolute bottom-3 left-3 rounded border border-ec-sage/30 bg-black/50 px-2 py-1 text-[9px] text-ec-sage backdrop-blur-sm">
        Analyserar tomt…
      </div>
    </div>
  );
}

function BuildScene() {
  return (
    <div className="absolute inset-0 bg-[#121410]">
      <div className="absolute bottom-[12%] left-[18%] right-[18%] h-[38%] rounded-[2rem] border-2 border-dashed border-[#6e7d68]/40 bg-[#1e241c]/60" />
      <div className="absolute bottom-[18%] left-[28%] right-[28%] h-[22%] rounded-xl bg-[#2a3228]/90" />
      <div className="absolute top-[25%] left-[15%] h-16 w-20 rounded bg-[#3d3830]/80" />
      <p className="absolute bottom-3 left-3 text-[9px] uppercase tracking-wider text-ec-text-dim">
        Byggfas · 68%
      </p>
    </div>
  );
}

function FinishedScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#1a2420] via-[#121814] to-[#0c0e0c]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_60%_35%,rgba(138,154,130,0.2),transparent)]" />
      <div className="absolute top-[18%] right-[12%] left-[15%] h-[48%] rounded-[2rem] bg-gradient-to-b from-[#3a4a40] to-[#243028] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
      <div className="absolute bottom-[14%] right-[10%] left-[20%] h-[10%] rounded-md bg-[#2a322c]/95" />
      <div className="absolute top-[32%] right-[22%] h-20 w-20 rounded-full bg-white/5 blur-xl" />
    </div>
  );
}

function QuoteScene({ quote }: { quote: HomeMessages["video"]["quote"] }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#141614] to-[#0c0c0b]">
      <div className="absolute top-[18%] right-[12%] left-[15%] h-[42%] rounded-[2rem] bg-gradient-to-b from-[#3a4a40]/80 to-[#243028]/80 opacity-60" />
      <div className="absolute bottom-[18%] left-1/2 w-[min(90%,280px)] -translate-x-1/2 rounded-xl border border-white/10 bg-[#1a1a18]/95 p-4 shadow-2xl backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-wider text-ec-text-dim">
          {quote.label}
        </p>
        <p className="mt-2 font-display text-2xl text-ec-warm">{quote.price}</p>
        <p className="mt-2 text-[11px] text-ec-text-muted">{quote.note}</p>
        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-ec-warm py-2 text-xs font-medium text-[#141413]"
        >
          Boka konsultation
        </button>
      </div>
    </div>
  );
}

const scenes = [MapZoomScene, ScanScene, BuildScene, FinishedScene];

export function HeroVideoMockup({ video }: HeroVideoMockupProps) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const progress = ((step + 1) / STEP_COUNT) * 100;

  const advance = useCallback(() => {
    setStep((s) => (s + 1) % STEP_COUNT);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(advance, STEP_MS);
    return () => clearInterval(id);
  }, [playing, advance]);

  const Scene =
    step === 4
      ? () => <QuoteScene quote={video.quote} />
      : scenes[step];

  return (
    <div className="overflow-hidden rounded-2xl border border-ec-border-subtle bg-[#2a322e] shadow-[var(--ec-shadow-lg)]">
      <div className="relative aspect-video w-full">
        <Scene />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <span className="absolute top-3 left-3 rounded-md border border-white/10 bg-black/50 px-2.5 py-1 text-[10px] font-medium text-ec-stone backdrop-blur-sm">
          {video.badge}
        </span>
        {!playing && step === 0 ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 flex items-center justify-center"
            aria-label="Spela exempelvideo"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md transition hover:scale-105 hover:bg-black/60">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-ec-cream" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        ) : null}
        <p className="absolute top-3 right-3 text-[10px] text-white/50">
          {video.steps[step]?.time ?? "0:00"}
        </p>
      </div>

      <div className="border-t border-white/8 bg-[#111110] px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="text-ec-sage-light hover:text-ec-cream"
            aria-label={playing ? "Pausa" : "Spela"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <p className="truncate text-xs text-ec-text-muted">
            {video.steps[step]?.label}
          </p>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-ec-stone/80 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between gap-1">
          {video.steps.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setStep(i)}
              className={`flex-1 truncate rounded px-1 py-0.5 text-[8px] uppercase tracking-wide transition ${
                i === step
                  ? "bg-white/10 text-ec-cream"
                  : "text-ec-text-dim hover:text-ec-text-muted"
              }`}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

