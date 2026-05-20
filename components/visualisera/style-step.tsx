"use client";

import { StyleScenePreview } from "@/components/visualisera/style-scene-preview";
import { ContinueButton, StepHeadline } from "@/components/visualisera/step-ui";
import { POOL_STYLES } from "@/lib/visualisera/constants";
import type { PoolStyle } from "@/lib/visualisera/types";

const STYLE_COPY: Record<PoolStyle, string> = {
  Modern: "Raka linjer, ljus betong och minimalistisk känsla.",
  Naturlig: "Sten, växter och mjuka former i trädgården.",
  Resort: "Lyxig lounge och resortkänsla hemma.",
  Familj: "Barnvänlig layout med plats för lek och avkoppling.",
};

type StyleStepProps = {
  value: PoolStyle | null;
  onSelect: (s: PoolStyle) => void;
  onContinue: () => void;
};

export function StyleStep({ value, onSelect, onContinue }: StyleStepProps) {
  return (
    <>
      <StepHeadline title="Vilken stil passar din trädgård?" />
      <div className="grid gap-4">
        {POOL_STYLES.map((style) => {
          const selected = value === style;
          return (
            <button
              key={style}
              type="button"
              onClick={() => onSelect(style)}
              className={`style-visual-card funnel-card overflow-hidden p-0 text-left ${
                selected ? "selected" : ""
              }`}
            >
              <StyleScenePreview style={style} className="rounded-none rounded-t-xl" />
              <div className="flex items-start justify-between gap-3 p-4">
                <div>
                  <span className="text-lg font-medium text-ec-warm">{style}</span>
                  <p className="mt-1 text-sm text-ec-text-muted">{STYLE_COPY[style]}</p>
                </div>
                <span
                  className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition ${
                    selected
                      ? "border-ec-sage/50 bg-ec-sage/15 text-ec-sage"
                      : "border-ec-border text-transparent"
                  }`}
                >
                  ✓
                </span>
              </div>
            </button>
          );
        })}
      </div>
      <ContinueButton disabled={!value} onClick={onContinue}>
        Fortsätt
      </ContinueButton>
    </>
  );
}
