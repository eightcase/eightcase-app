"use client";

import type { BackyardComposition } from "@/lib/visualization/mock-render-engine";

type BackyardSceneProps = {
  composition: BackyardComposition;
  className?: string;
};

/** CSS-only backyard composition — no image assets. */
export function BackyardScene({ composition: c, className = "" }: BackyardSceneProps) {
  const poolW = `${c.poolWidthPct}%`;
  const poolH = `${c.poolHeightPct}%`;
  const poolLeft = `${c.poolOffsetXPct - c.poolWidthPct / 2}%`;
  const poolTop = `${c.poolOffsetYPct}%`;

  return (
    <div
      className={`viz-scene absolute inset-0 overflow-hidden ${className}`}
      style={
        {
          "--viz-sky-top": c.skyTop,
          "--viz-sky-mid": c.skyMid,
          "--viz-sky-bottom": c.skyBottom,
          "--viz-lawn": c.lawn,
          "--viz-lawn-accent": c.lawnAccent,
          "--viz-deck": c.deck,
          "--viz-deck-edge": c.deckEdge,
          "--viz-water-top": c.waterTop,
          "--viz-water-deep": c.waterDeep,
          "--viz-water-shine": c.waterShine,
          "--viz-hedge": c.hedge,
          "--viz-tree": c.tree,
          "--viz-light": c.lightWarmth,
          "--viz-land": c.landscaping,
        } as React.CSSProperties
      }
    >
      <div className="viz-scene__sky" />
      <div className="viz-scene__horizon" />
      <div className="viz-scene__lawn" />
      <div
        className="viz-scene__tree viz-scene__tree--l"
        style={{ opacity: 0.5 + c.landscaping * 0.5 }}
      />
      <div
        className="viz-scene__tree viz-scene__tree--r"
        style={{ opacity: 0.45 + c.landscaping * 0.45 }}
      />
      <div
        className="viz-scene__hedge"
        style={{ opacity: 0.4 + c.landscaping * 0.5 }}
      />

      <div
        className="viz-scene__deck"
        style={{
          left: `${Math.max(8, c.poolOffsetXPct - 28)}%`,
          width: `${Math.min(88, c.poolWidthPct + 36)}%`,
        }}
      />

      {c.hasPool ? (
        <div
          className="viz-scene__pool"
          style={{ left: poolLeft, top: poolTop, width: poolW, height: poolH }}
        >
          <div className="viz-scene__water" />
          <div className="viz-scene__water-shine" />
        </div>
      ) : (
        <div
          className="viz-scene__lawn-patch"
          style={{ left: poolLeft, top: poolTop, width: poolW, height: poolH }}
        />
      )}

      {c.hasSpa && c.hasPool ? (
        <div
          className="viz-scene__spa"
          style={{
            left: `calc(${poolLeft} + ${poolW} * 0.75)`,
            top: `calc(${poolTop} + ${poolH} * 0.15)`,
          }}
        />
      ) : null}

      {c.hasPergola && c.hasPool ? (
        <div
          className="viz-scene__pergola"
          style={{ left: poolLeft, top: `calc(${poolTop} - 6%)`, width: `calc(${poolW} + 8%)` }}
        />
      ) : null}

      {c.hasOutdoorKitchen ? (
        <div className="viz-scene__kitchen" style={{ left: `${c.poolOffsetXPct + 22}%`, top: `${c.poolOffsetYPct + 18}%` }} />
      ) : null}

      {c.hasLighting ? <div className="viz-scene__lights" /> : null}

      <div className="viz-scene__vignette" />
    </div>
  );
}
