"use client";

import Link from "next/link";
import { useState } from "react";
import { ROUTES } from "@/lib/platform/zones";

const AREAS = [
  "Löddeköpinge",
  "Malmö",
  "Helsingborg",
  "Lund",
  "Göteborg",
  "Annat område",
];

export function CreateCampaignForm() {
  const [name, setName] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [properties, setProperties] = useState("40");
  const [flyerType, setFlyerType] = useState<"qr" | "post">("qr");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
          Kampanj skapad (demo)
        </p>
        <h1 className="font-display mt-3 text-3xl text-ec-warm">
          {name || "Ny kampanj"} är redo
        </h1>
        <p className="mt-3 text-sm text-ec-text-muted">
          I en riktig version skulle QR-flyers och spårningslänkar genereras här.
          Tills vidare visas kampanjen inte i listan — all data är mock.
        </p>
        <Link
          href={ROUTES.admin.campaigns}
          className="btn-primary mt-8 inline-flex h-9 items-center rounded-md px-6 text-sm font-medium"
        >
          Tillbaka till kampanjer
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-8">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
          Ny kampanj
        </p>
        <h1 className="font-display mt-3 text-3xl text-ec-warm">Skapa kampanj</h1>
        <p className="mt-2 text-sm text-ec-text-muted">
          Lokalt område, QR-flyer och spårning — prototyp utan backend.
        </p>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-ec-warm">Kampanjnamn</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.ex. Limhamn villaområde"
            required
            className="glass-panel mt-2 w-full rounded-xl px-4 py-3 text-sm text-ec-warm placeholder:text-ec-text-dim focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ec-warm">Område</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="glass-panel mt-2 w-full rounded-xl px-4 py-3 text-sm text-ec-warm focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
          >
            {AREAS.map((a) => (
              <option key={a} value={a} className="bg-ec-charcoal">
                {a}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ec-warm">
            Antal fastigheter i området
          </span>
          <input
            type="number"
            min={1}
            value={properties}
            onChange={(e) => setProperties(e.target.value)}
            className="glass-panel mt-2 w-full rounded-xl px-4 py-3 text-sm text-ec-warm focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-medium text-ec-warm">Utskicksformat</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(
              [
                { id: "qr" as const, label: "QR-flyer", desc: "Dörrknackning & lokalt" },
                { id: "post" as const, label: "Postutskick", desc: "Adresserat brev" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFlyerType(opt.id)}
                className={`glass-panel rounded-xl p-4 text-left transition ${
                  flyerType === opt.id
                    ? "border-ec-sage/40 ring-1 ring-ec-sage/30"
                    : "hover:bg-ec-bg-subtle"
                }`}
              >
                <span className="text-sm font-medium text-ec-warm">{opt.label}</span>
                <p className="mt-1 text-xs text-ec-text-muted">{opt.desc}</p>
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="btn-primary inline-flex h-11 items-center rounded-full px-6 text-sm font-medium"
        >
          Skapa kampanj
        </button>
        <Link
          href={ROUTES.admin.campaigns}
          className="btn-secondary inline-flex h-9 items-center rounded-md px-6 text-sm font-medium"
        >
          Avbryt
        </Link>
      </div>
    </form>
  );
}
