type StepHeadlineProps = {
  title: string;
  subtitle?: string;
};

export function StepHeadline({ title, subtitle }: StepHeadlineProps) {
  return (
    <div className="mb-8">
      <h1 className="font-display text-[1.75rem] leading-tight text-ec-ink sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-ec-text-muted">{subtitle}</p>
      ) : null}
    </div>
  );
}

type OptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode;
};

export function OptionCard({
  label,
  description,
  selected,
  onSelect,
  icon,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`funnel-card w-full p-4 text-left transition-all duration-300 ${
        selected
          ? "ring-1 ring-ec-sage/40"
          : "hover:-translate-y-0.5 hover:shadow-[var(--ec-shadow)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          {icon ? <div className="mb-3">{icon}</div> : null}
          <span className="text-base font-medium text-ec-ink">{label}</span>
          {description ? (
            <p className="mt-1 text-sm text-ec-text-muted">{description}</p>
          ) : null}
        </div>
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs transition ${
            selected
              ? "border-ec-sage bg-ec-sage/15 text-ec-forest"
              : "border-ec-border text-transparent"
          }`}
        >
          ✓
        </span>
      </div>
    </button>
  );
}

type FeatureCardProps = {
  label: string;
  checked: boolean;
  onToggle: () => void;
};

export function FeatureCard({ label, checked, onToggle }: FeatureCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`funnel-card flex items-center gap-3 px-4 py-3 text-left transition duration-300 ${
        checked ? "ring-1 ring-ec-sage/35" : "hover:-translate-y-0.5 hover:shadow-[var(--ec-shadow)]"
      }`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
          checked ? "border-ec-sage bg-ec-sage/15 text-ec-forest" : "border-ec-border"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      <span className="text-sm font-medium text-ec-ink">{label}</span>
    </button>
  );
}

export function ContinueButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-funnel mt-10 flex h-12 w-full items-center justify-center text-sm font-medium"
    >
      {children}
    </button>
  );
}
