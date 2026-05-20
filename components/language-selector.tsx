"use client";

import { useState } from "react";
import {
  defaultLocale,
  localeLabels,
  locales,
  type Locale,
} from "@/lib/i18n/config";

export function LanguageSelector() {
  const [active, setActive] = useState<Locale>(defaultLocale);

  return (
    <div className="flex gap-0.5 rounded-full border border-ec-border bg-ec-bg-elevated p-0.5 shadow-sm">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => setActive(locale)}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
            active === locale
              ? "bg-ec-forest/10 text-ec-forest"
              : "text-ec-text-dim hover:text-ec-ink-muted"
          }`}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}
