import type { HomeMessages } from "@/lib/i18n/messages";

type SiteFooterProps = {
  footer: HomeMessages["footer"];
};

export function SiteFooter({ footer }: SiteFooterProps) {
  return (
    <footer className="border-t border-ec-border bg-ec-bg-elevated px-6 py-14 sm:px-10">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-lg text-ec-ink">Eightcase</p>
          <p className="mt-2 text-sm text-ec-text-muted">{footer.tagline}</p>
        </div>
        <a
          href={`mailto:${footer.demoEmail}`}
          className="text-sm text-ec-text-muted transition hover:text-ec-forest"
        >
          {footer.demoEmail}
        </a>
        <p className="text-xs text-ec-text-dim">
          © {new Date().getFullYear()} Eightcase
        </p>
      </div>
    </footer>
  );
}
