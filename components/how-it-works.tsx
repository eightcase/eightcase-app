import type { HomeMessages } from "@/lib/i18n/messages";

type HowItWorksProps = {
  content: HomeMessages["howItWorks"];
};

export function HowItWorks({ content }: HowItWorksProps) {
  return (
    <div>
      <h2 className="font-display text-2xl tracking-tight text-ec-ink sm:text-3xl">
        {content.title}
      </h2>
      <ol className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-12">
        {content.steps.map((step, i) => (
          <li key={step.label} className="list-none">
            <span className="font-mono text-xs font-medium text-ec-sage">0{i + 1}</span>
            <h3 className="mt-4 text-base font-medium text-ec-ink">{step.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ec-text-muted">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
