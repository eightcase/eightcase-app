"use client";

import { useState } from "react";
import { ContinueButton, StepHeadline } from "@/components/visualisera/step-ui";

export type EarlyContactPayload = {
  contactMethod: "E-post" | "Telefon";
  email?: string;
  phone?: string;
  consentGiven: boolean;
};

type EarlyContactStepProps = {
  saving: boolean;
  onSubmit: (payload: EarlyContactPayload) => void;
};

export function EarlyContactStep({ saving, onSubmit }: EarlyContactStepProps) {
  const [method, setMethod] = useState<"E-post" | "Telefon">("E-post");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setError(null);
    if (!consent) {
      setError("Godkänn kontakt för att fortsätta.");
      return;
    }
    if (method === "E-post" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ange en giltig e-postadress.");
      return;
    }
    if (method === "Telefon" && phone.replace(/\D/g, "").length < 6) {
      setError("Ange ett giltigt telefonnummer.");
      return;
    }
    onSubmit({
      contactMethod: method,
      email: method === "E-post" ? email.trim() : undefined,
      phone: method === "Telefon" ? phone.trim() : undefined,
      consentGiven: true,
    });
  };

  return (
    <>
      <StepHeadline
        title="Var ska vi skicka din visualisering?"
        subtitle="Vi skickar din visualisering så att du kan spara den och komma tillbaka senare."
      />

      <div className="funnel-card mt-6 space-y-4 p-5">
        <p className="text-sm leading-relaxed text-ec-text-muted">
          Välj hur du vill få tillgång till din personliga visualisering — detta är din framtida
          bakgård, inte bara ett formulär.
        </p>

        <div className="flex gap-2">
          {(["E-post", "Telefon"] as const).map((m) => (
            <button
              key={m}
              type="button"
              disabled={saving}
              onClick={() => setMethod(m)}
              className={`flex-1 rounded-full border px-3 py-2.5 text-sm font-medium transition ${
                method === m
                  ? "border-ec-sage/50 bg-ec-sage/15 text-ec-warm"
                  : "border-ec-border text-ec-text-muted"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {method === "E-post" ? (
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
              E-post
            </label>
            <input
              type="email"
              value={email}
              disabled={saving}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@exempel.se"
              className="mt-1.5 w-full rounded-xl border border-ec-border bg-ec-bg-elevated px-4 py-3 text-sm text-ec-warm focus:border-ec-sage/40 focus:outline-none focus:ring-1 focus:ring-ec-sage/20"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
              Telefon
            </label>
            <input
              type="tel"
              value={phone}
              disabled={saving}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="070-123 45 67"
              className="mt-1.5 w-full rounded-xl border border-ec-border bg-ec-bg-elevated px-4 py-3 text-sm text-ec-warm focus:border-ec-sage/40 focus:outline-none focus:ring-1 focus:ring-ec-sage/20"
            />
          </div>
        )}

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ec-border-subtle bg-ec-cream/5 px-3 py-3">
          <input
            type="checkbox"
            checked={consent}
            disabled={saving}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ec-border accent-ec-forest"
          />
          <span className="text-sm leading-relaxed text-ec-text-muted">
            Jag godkänner att bli kontaktad om min visualisering och offertförfrågan.
          </span>
        </label>

        {error ? <p className="text-xs text-red-600/90">{error}</p> : null}
        {saving ? (
          <p className="text-xs text-ec-text-dim">Sparar din plats i visualiseringen…</p>
        ) : null}
      </div>

      <ContinueButton onClick={handleContinue} disabled={saving}>
        Fortsätt till stilval
      </ContinueButton>
    </>
  );
}
