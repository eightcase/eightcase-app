import Link from "next/link";
import { EightcaseLogo } from "@/components/brand";
import { AmbientGlow } from "@/components/ambient-glow";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { CtaSection } from "@/components/cta-section";
import { HeroVideoMockup } from "@/components/hero-video-mockup";
import { HowItWorks } from "@/components/how-it-works";
import { LanguageSelector } from "@/components/language-selector";
import { ProofStrip } from "@/components/proof-strip";
import { SiteFooter } from "@/components/site-footer";
import { UseCases } from "@/components/use-cases";
import { defaultLocale } from "@/lib/i18n/config";
import { getHomeMessages } from "@/lib/i18n/messages";

export default function Home() {
  const t = getHomeMessages(defaultLocale);

  return (
    <div className="zone-marketing relative min-h-screen overflow-x-hidden bg-ec-bg font-sans text-ec-text">
      <AmbientGlow />

      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5 sm:px-10 sm:py-6">
        <Link
          href="/"
          className="block shrink-0 py-1 pr-2 transition opacity-90 hover:opacity-100 sm:pr-4"
        >
          <EightcaseLogo variant="wordmark" size="xl" tone="forest" />
        </Link>
        <div className="flex min-w-0 items-center gap-4 sm:gap-5">
          <nav className="hidden gap-6 text-sm text-ec-text-muted md:flex">
            <a href="#how-it-works" className="transition hover:text-ec-forest">
              {t.nav.howItWorks}
            </a>
            <a href="#use-cases" className="transition hover:text-ec-forest">
              {t.nav.useCases}
            </a>
            <Link href="/demo" className="transition hover:text-ec-forest">
              {t.nav.contact}
            </Link>
          </nav>
          <LanguageSelector />
          <Link
            href="/login"
            className="btn-secondary rounded-full px-4 py-1.5 text-sm"
          >
            Logga in
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-4 pt-2 sm:px-10 lg:pb-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-16">
            <div className="max-w-lg">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ec-sage">
                {t.hero.eyebrow}
              </p>
              <h1 className="font-display mt-5 text-[1.85rem] leading-[1.12] tracking-tight text-ec-ink sm:text-5xl lg:text-[3.1rem]">
                {t.hero.headline}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-ec-text-muted">
                {t.hero.subheadline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="btn-primary inline-flex h-11 items-center rounded-full px-7 text-sm font-medium"
                >
                  {t.hero.ctaPrimary}
                </Link>
                <Link
                  href="/visualisera"
                  className="btn-secondary inline-flex h-11 items-center rounded-full px-7 text-sm font-medium"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </div>
            </div>
            <div id="hero-video" className="relative scroll-mt-24">
              <HeroVideoMockup video={t.video} />
            </div>
          </div>
        </section>

        <ProofStrip proof={t.proof} />

        <section id="how-it-works" className="section-pad scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <HowItWorks content={t.howItWorks} />
          </div>
        </section>

        <section id="use-cases" className="section-forest section-pad scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <UseCases content={t.useCases} />
          </div>
        </section>

        <section id="transformation" className="section-pad scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-10">
            <h2 className="font-display max-w-2xl text-3xl text-ec-ink sm:text-4xl">
              {t.beforeAfter.title}
            </h2>
            <p className="mt-3 max-w-lg text-ec-text-muted">{t.beforeAfter.subtitle}</p>
            <div className="mt-10">
              <BeforeAfterSlider
                beforeAfter={t.beforeAfter}
                sliderHint={t.beforeAfter.sliderHint}
              />
            </div>
          </div>
        </section>

        <section id="demo" className="scroll-mt-24 px-6 pb-16 pt-8 sm:px-10">
          <div className="mx-auto max-w-2xl">
            <CtaSection content={t.cta} />
          </div>
        </section>
      </main>

      <SiteFooter footer={t.footer} />
    </div>
  );
}
