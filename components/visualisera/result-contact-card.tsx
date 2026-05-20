"use client";

import { useState } from "react";
import {
  normalizeLeadContact,
  validateLeadContact,
  type LeadContactInput,
  type PreferredContactMethod,
} from "@/lib/visualisera/lead-contact";

type SubmittedContact = {
  name: string;
  preferredContactMethod: PreferredContactMethod;
};

type ResultContactCardProps = {
  disabled: boolean;
  saving: boolean;
  submitted: boolean;
  submittedContact: SubmittedContact | null;
  onSubmit: (contact: LeadContactInput & { consentTimestamp: string }) => void;
};

const INITIAL: LeadContactInput = {
  name: "",
  email: "",
  phone: "",
  preferredContactMethod: "Telefon",
  consentGiven: false,
};

export function ResultContactCard({
  disabled,
  saving,
  submitted,
  submittedContact,
  onSubmit,
}: ResultContactCardProps) {
  const [form, setForm] = useState<LeadContactInput>(INITIAL);
  const [errors, setErrors] = useState<ReturnType<typeof validateLeadContact>["errors"]>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateLeadContact(form);
    setErrors(validation.errors);
    if (!validation.valid) return;
    onSubmit(normalizeLeadContact(form));
  };

  if (submitted && submittedContact) {
    return (
      <div className="funnel-card border-ec-sage/30 bg-ec-sage/5 p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-ec-sage">
          Kontaktuppgifter mottagna
        </p>
        <p className="mt-2 text-sm text-ec-warm">
          Tack {submittedContact.name}! Vi har sparat din förfrågan och en återförsäljare kan
          kontakta dig via{" "}
          {submittedContact.preferredContactMethod === "Telefon" ? "telefon" : "e-post"}.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="funnel-card funnel-result-reveal funnel-result-reveal-delay-4 space-y-4 p-5"
    >
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-ec-sage">
          Nästa steg
        </p>
        <h2 className="font-display mt-2 text-xl text-ec-warm">Få offert och uppföljning</h2>
        <p className="mt-2 text-sm leading-relaxed text-ec-text-muted">
          Lämna dina uppgifter så sparar vi din visualisering och en poolpartner kan höra av sig.
        </p>
      </div>

      <div className="space-y-3">
        <Field label="Namn" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            disabled={disabled || saving}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded-xl border border-ec-border bg-ec-bg-elevated px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:border-ec-sage/40 focus:outline-none focus:ring-1 focus:ring-ec-sage/20"
            placeholder="För- och efternamn"
          />
        </Field>

        <Field label="E-post" error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            disabled={disabled || saving}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full rounded-xl border border-ec-border bg-ec-bg-elevated px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:border-ec-sage/40 focus:outline-none focus:ring-1 focus:ring-ec-sage/20"
            placeholder="namn@exempel.se"
          />
        </Field>

        <Field label="Telefon" error={errors.phone}>
          <input
            type="tel"
            autoComplete="tel"
            value={form.phone}
            disabled={disabled || saving}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full rounded-xl border border-ec-border bg-ec-bg-elevated px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:border-ec-sage/40 focus:outline-none focus:ring-1 focus:ring-ec-sage/20"
            placeholder="070-123 45 67"
          />
        </Field>

        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
            Föredragen kontakt
          </legend>
          <div className="mt-2 flex gap-2">
            {(["Telefon", "E-post"] as PreferredContactMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                disabled={disabled || saving}
                onClick={() => setForm((f) => ({ ...f, preferredContactMethod: method }))}
                className={`flex-1 rounded-full border px-3 py-2 text-sm font-medium transition ${
                  form.preferredContactMethod === method
                    ? "border-ec-sage/50 bg-ec-sage/15 text-ec-warm"
                    : "border-ec-border text-ec-text-muted hover:border-ec-border-subtle"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ec-border-subtle bg-ec-cream/5 px-3 py-3">
          <input
            type="checkbox"
            checked={form.consentGiven}
            disabled={disabled || saving}
            onChange={(e) => setForm((f) => ({ ...f, consentGiven: e.target.checked }))}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-ec-border accent-ec-forest"
          />
          <span className="text-sm leading-relaxed text-ec-text-muted">
            Jag godkänner att bli kontaktad om min visualisering och offertförfrågan.
          </span>
        </label>
        {errors.consent ? (
          <p className="text-xs text-red-600/90">{errors.consent}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={disabled || saving}
        className="btn-funnel flex h-12 w-full items-center justify-center text-sm font-medium disabled:opacity-50"
      >
        {saving ? "Sparar din förfrågan…" : "Skicka och spara min förfrågan"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-ec-text-dim">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? <p className="mt-1 text-xs text-red-600/90">{error}</p> : null}
    </div>
  );
}
