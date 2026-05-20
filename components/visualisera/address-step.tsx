"use client";

import { useEffect, useMemo, useState } from "react";
import { ContinueButton, StepHeadline } from "@/components/visualisera/step-ui";

const ALL_SUGGESTIONS = [
  { primary: "Storgatan 12", secondary: "181 32 Lidingö" },
  { primary: "Villavägen 8", secondary: "192 78 Sollentuna" },
  { primary: "Sjövägen 3", secondary: "133 36 Saltsjöbaden" },
  { primary: "Ekvägen 14", secondary: "223 69 Lund" },
];

function formatSuggestion(s: (typeof ALL_SUGGESTIONS)[0]) {
  return `${s.primary}, ${s.secondary}`;
}

type AddressStepProps = {
  address: string;
  onChange: (v: string) => void;
  onContinue: () => void;
};

export function AddressStep({ address, onChange, onContinue }: AddressStepProps) {
  const trimmed = address.trim();
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = useMemo(() => {
    if (trimmed.length < 2) return ALL_SUGGESTIONS.slice(0, 3);
    const q = trimmed.toLowerCase();
    const filtered = ALL_SUGGESTIONS.filter(
      (s) =>
        s.primary.toLowerCase().includes(q) ||
        s.secondary.toLowerCase().includes(q),
    );
    return filtered.length > 0 ? filtered : ALL_SUGGESTIONS;
  }, [trimmed]);

  useEffect(() => {
    if (trimmed.length > 1 && focused) setShowSuggestions(true);
    else if (trimmed.length === 0) setShowSuggestions(false);
  }, [trimmed, focused]);

  return (
    <>
      <StepHeadline
        title="Börja med din adress"
        subtitle="Vi hittar din tomt och anpassar visualiseringen till din trädgård."
      />

      <div className="funnel-card relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(120,130,110,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(120,130,110,0.12) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(138,154,130,0.12),transparent)]" />

        <div className="relative p-4">
          <div className="flex items-center gap-3 rounded-xl border border-ec-border bg-ec-bg-elevated px-4 py-3.5 shadow-sm transition focus-within:border-ec-sage/40 focus-within:ring-1 focus-within:ring-ec-sage/20">
            <span className="text-ec-sage" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
            </span>
            <input
              type="text"
              value={address}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 180)}
              placeholder="Sök adress"
              className="min-w-0 flex-1 bg-transparent text-base text-ec-warm placeholder:text-ec-text-dim focus:outline-none"
              autoComplete="street-address"
            />
            {trimmed.length > 0 ? (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-ec-text-dim hover:text-ec-warm"
                aria-label="Rensa"
              >
                ×
              </button>
            ) : null}
          </div>

          <div className="relative mt-4 aspect-[2.2/1] overflow-hidden rounded-lg border border-ec-border bg-ec-bg-subtle loading-preview-dark">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(100,110,95,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100,110,95,0.1) 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_45%,rgba(180,170,150,0.2),transparent_45%)]" />
            <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full funnel-pin-pulse">
              <span className="relative flex h-9 w-9 items-center justify-center">
                <span className="absolute h-9 w-9 rounded-full bg-ec-warm/20" />
                <span className="relative h-3 w-3 rounded-full border-2 border-ec-warm bg-ec-warm shadow-lg shadow-black/40" />
              </span>
              <span className="mx-auto mt-0.5 block h-2 w-0.5 bg-ec-warm/80" />
            </div>
            <p className="absolute bottom-2 left-2 rounded bg-ec-forest/70 px-2 py-0.5 text-[9px] text-ec-cream/80 backdrop-blur-sm">
              Kartvy · prototyp
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-ec-text-muted">
        Din adress används för att skapa en personlig visualisering.
      </p>

      {showSuggestions && (focused || trimmed.length > 1) ? (
        <ul className="mt-3 overflow-hidden rounded-xl border border-ec-border bg-ec-bg-elevated shadow-[var(--ec-shadow-lg)]">
          {suggestions.slice(0, 4).map((s, i) => {
            const full = formatSuggestion(s);
            return (
              <li
                key={full}
                className="funnel-suggestion-in border-b border-ec-border-subtle last:border-0"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange(full);
                    setShowSuggestions(false);
                  }}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition hover:bg-ec-bg-subtle"
                >
                  <span className="mt-0.5 text-ec-sage">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ec-ink">{s.primary}</span>
                    <span className="block text-xs text-ec-text-muted">{s.secondary}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <ContinueButton disabled={trimmed.length < 3} onClick={onContinue}>
        Fortsätt
      </ContinueButton>
    </>
  );
}
