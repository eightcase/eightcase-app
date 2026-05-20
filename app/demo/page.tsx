import Link from "next/link";
import type { Metadata } from "next";
import { AmbientGlow } from "@/components/ambient-glow";
import { DemoRequestForm } from "@/components/marketing/demo-request-form";
import { defaultLocale } from "@/lib/i18n/config";
import { getHomeMessages } from "@/lib/i18n/messages";
import { ROUTES } from "@/lib/platform/zones";

export const metadata: Metadata = {
  title: "Boka demo | Eightcase",
  description: "Boka en demo av Eightcase för ditt poolföretag.",
};

export default function DemoPage() {
  const t = getHomeMessages(defaultLocale);

  return (
    <div className="zone-marketing relative min-h-screen bg-ec-bg font-sans text-ec-text">
      <AmbientGlow />
      <header className="relative z-10 mx-auto flex max-w-3xl items-center justify-between px-6 py-6">
        <Link href={ROUTES.marketing.home} className="font-display text-xl text-ec-warm">
          Eightcase
        </Link>
        <Link
          href={ROUTES.marketing.home}
          className="text-sm text-ec-text-muted hover:text-ec-warm"
        >
          ← Tillbaka
        </Link>
      </header>
      <main className="relative z-10 mx-auto max-w-lg px-6 pb-20 pt-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
          För poolföretag
        </p>
        <h1 className="font-display mt-4 text-4xl text-ec-warm">{t.hero.ctaPrimary}</h1>
        <p className="mt-4 text-ec-text-muted">
          Se hur Eightcase kan hjälpa er sälja fler pooler med AI-visualiseringar och
          kvalificerade leads. Detta är en prototyp — ingen data sparas.
        </p>
        <DemoRequestForm demoEmail={t.footer.demoEmail} />
        <p className="mt-8 text-center text-sm text-ec-text-dim">
          Vill du uppleva kundflödet?{" "}
          <Link href={ROUTES.funnel.visualisera} className="text-ec-stone hover:text-ec-warm">
            Testa visualisering
          </Link>
        </p>
      </main>
    </div>
  );
}
