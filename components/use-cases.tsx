import type { HomeMessages } from "@/lib/i18n/messages";

type UseCasesProps = {
  content: HomeMessages["useCases"];
};

export function UseCases({ content }: UseCasesProps) {
  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight text-ec-cream sm:text-3xl">
        {content.title}
      </h2>
      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {content.cases.map((item) => (
          <article
            key={item.title}
            className="surface-card p-7 transition hover:shadow-[var(--ec-shadow-lg)]"
          >
            <div className="h-0.5 w-10 bg-ec-sage/50" />
            <h3 className="mt-5 text-base font-medium text-ec-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ec-text-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
