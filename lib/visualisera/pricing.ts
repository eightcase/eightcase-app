import type { FunnelState, PriceEstimate } from "./types";

const SIZE_BASE: Record<string, [number, number]> = {
  Kompakt: [620_000, 780_000],
  Mellan: [820_000, 1_020_000],
  Stor: [1_020_000, 1_280_000],
  Lyx: [1_280_000, 1_580_000],
};

const STYLE_ADJUST: Record<string, number> = {
  Modern: 0,
  Naturlig: -40_000,
  Resort: 90_000,
  Familj: 50_000,
};

const FEATURE_COST: Record<string, number> = {
  Poolbelysning: 45_000,
  Pooltak: 120_000,
  Spabad: 185_000,
  Trädäck: 95_000,
  Värmesystem: 68_000,
  Utekök: 155_000,
};

function formatKr(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

export function calculateEstimate(state: FunnelState): PriceEstimate {
  const size = state.size ?? "Mellan";
  const style = state.style ?? "Modern";
  const [baseMin, baseMax] = SIZE_BASE[size] ?? SIZE_BASE.Mellan;
  const styleAdj = STYLE_ADJUST[style] ?? 0;
  const featuresCost = state.features.reduce(
    (sum, f) => sum + (FEATURE_COST[f] ?? 0),
    0,
  );

  let min = baseMin + styleAdj + featuresCost * 0.9;
  let max = baseMax + styleAdj + featuresCost * 1.1;
  min = Math.round(min / 10_000) * 10_000;
  max = Math.round(max / 10_000) * 10_000;
  if (max <= min) max = min + 120_000;

  const mid = (min + max) / 2;
  const yearlyRate = 0.009;
  const monthlyMin = Math.round((mid * yearlyRate * 0.85) / 12 / 100) * 100;
  const monthlyMax = Math.round((mid * yearlyRate * 1.15) / 12 / 100) * 100;

  return { min, max, monthlyMin, monthlyMax };
}

export function formatPriceRange(estimate: PriceEstimate): string {
  return `${formatKr(estimate.min)} – ${formatKr(estimate.max)} kr`;
}

export function formatMonthlyRange(estimate: PriceEstimate): string {
  return `${formatKr(estimate.monthlyMin)} – ${formatKr(estimate.monthlyMax)} kr / mån`;
}
