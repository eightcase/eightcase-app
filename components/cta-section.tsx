import Link from "next/link";
import type { HomeMessages } from "@/lib/i18n/messages";
import { ROUTES } from "@/lib/platform/zones";

type CtaSectionProps = {
  content: HomeMessages["cta"];
};

export function CtaSection({ content }: CtaSectionProps) {
  return (
    <section className="section-forest rounded-2xl px-8 py-14 text-center sm:px-12">
      <h2 className="font-display text-2xl text-ec-cream sm:text-3xl">
        {content.headline}
      </h2>
      <Link
        href={ROUTES.marketing.demo}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-ec-cream px-10 text-sm font-medium text-ec-forest transition hover:bg-white"
      >
        {content.button}
      </Link>
    </section>
  );
}
