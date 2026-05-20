"use client";

import { useState } from "react";

type DemoRequestFormProps = {
  demoEmail: string;
};

export function DemoRequestForm({ demoEmail }: DemoRequestFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="glass-panel mt-10 rounded-2xl p-8 text-center">
        <p className="font-display text-xl text-ec-warm">Tack för er förfrågan</p>
        <p className="mt-2 text-sm text-ec-text-muted">
          I en riktig version skulle vi återkomma inom 24 timmar. Demo: inget skickades.
        </p>
        <a
          href={`mailto:${demoEmail}`}
          className="mt-4 inline-block text-sm text-ec-sage hover:text-ec-warm"
        >
          {demoEmail}
        </a>
      </div>
    );
  }

  return (
    <form
      className="mt-10 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="block">
        <span className="text-sm text-ec-warm">Företagsnamn</span>
        <input
          required
          className="glass-panel mt-2 w-full rounded-xl px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
          placeholder="Ert poolföretag"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ec-warm">E-post</span>
        <input
          type="email"
          required
          className="glass-panel mt-2 w-full rounded-xl px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
          placeholder="namn@foretag.se"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ec-warm">Telefon</span>
        <input
          type="tel"
          className="glass-panel mt-2 w-full rounded-xl px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
          placeholder="070-123 45 67"
        />
      </label>
      <button
        type="submit"
        className="btn-primary mt-4 flex h-12 w-full items-center justify-center rounded-full text-sm font-medium"
      >
        Skicka förfrågan
      </button>
    </form>
  );
}
