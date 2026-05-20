import type { PriceEstimate } from "@/lib/visualisera/types";
import type { DrainageAssessment, DrainageState, RiskLevel } from "./types";

const AGE_RISK: Record<string, number> = {
  "0–10 år": 8,
  "10–25 år": 18,
  "25–40 år": 32,
  "40+ år": 48,
};

const SYMPTOM_RISK: Record<string, number> = {
  "Fukt i källare": 22,
  "Dålig lukt": 14,
  "Sprickor": 18,
  "Dålig avrinning": 16,
  "Ingen märkbar problematik": -12,
};

const BASE_DRAINAGE: [number, number] = [165_000, 240_000];

function riskFromScore(score: number): RiskLevel {
  if (score < 28) return "Låg";
  if (score < 48) return "Måttlig";
  if (score < 68) return "Förhöjd";
  return "Hög";
}

function recommendation(level: RiskLevel, symptoms: string[]): string {
  const hasIssues = symptoms.some((s) => s !== "Ingen märkbar problematik");
  if (level === "Låg" && !hasIssues) {
    return "Förebyggande kontroll rekommenderas vid kommande markarbete — låg akut risk.";
  }
  if (level === "Låg" || level === "Måttlig") {
    return "Delvis förnyelse av dränering runt aktuella schakt zoner, med kontroll av fogar och fall.";
  }
  if (level === "Förhöjd") {
    return "Komplett dräneringsmodernisering runt huset rekommenderas i samband med poolens markarbete.";
  }
  return "Akut kartläggning och full dräneringslösning rekommenderas före eller parallellt med poolprojektet.";
}

function problemZones(score: number): string[] {
  const zones: string[] = [];
  if (score >= 20) zones.push("Grund mot sydvägg");
  if (score >= 40) zones.push("Fuktskydd källare");
  if (score >= 55) zones.push("Dagvattenavrinning");
  if (score >= 70) zones.push("Platonmatta / dräneringsrör");
  return zones.length > 0 ? zones : ["Inga kritiska zoner identifierade"];
}

export function assessDrainage(
  state: DrainageState,
  poolEstimate: PriceEstimate | null,
): DrainageAssessment {
  const age = state.houseAge ?? "25–40 år";
  let score = AGE_RISK[age] ?? 25;

  const noIssues = state.symptoms.includes("Ingen märkbar problematik");
  for (const s of state.symptoms) {
    score += SYMPTOM_RISK[s] ?? 0;
  }
  if (noIssues && state.symptoms.length === 1) score = Math.max(12, score - 8);
  score = Math.min(92, Math.max(8, score));

  const riskLevel = riskFromScore(score);
  const multiplier = 0.85 + score / 100;
  let drainageMin = Math.round((BASE_DRAINAGE[0] * multiplier) / 5000) * 5000;
  let drainageMax = Math.round((BASE_DRAINAGE[1] * multiplier) / 5000) * 5000;
  if (riskLevel === "Hög") {
    drainageMin += 45_000;
    drainageMax += 85_000;
  }

  const poolMid = poolEstimate
    ? (poolEstimate.min + poolEstimate.max) / 2
    : 0;
  const drainageMid = (drainageMin + drainageMax) / 2;
  const combinedMin = (poolEstimate?.min ?? 0) + drainageMin;
  const combinedMax = (poolEstimate?.max ?? 0) + drainageMax;

  const earthworkOverlap = poolEstimate ? 0.11 + score / 900 : 0.08;
  const separateMarkup = 1 + earthworkOverlap;
  const separateTotalMin = Math.round(combinedMin * separateMarkup);
  const separateTotalMax = Math.round(combinedMax * separateMarkup);
  const coordinatedSavingsKr = Math.round(
    (separateTotalMin + separateTotalMax) / 2 - (combinedMin + combinedMax) / 2,
  );
  const coordinatedSavingsPercent = Math.round(
    (coordinatedSavingsKr / ((separateTotalMin + separateTotalMax) / 2)) * 100,
  );

  return {
    riskLevel,
    riskScore: score,
    recommendation: recommendation(riskLevel, state.symptoms),
    problemZones: problemZones(score),
    drainageMin,
    drainageMax,
    coordinatedSavingsKr: Math.max(35_000, coordinatedSavingsKr),
    coordinatedSavingsPercent: Math.min(18, Math.max(6, coordinatedSavingsPercent)),
    combinedMin,
    combinedMax,
    separateTotalMin,
    separateTotalMax,
  };
}

export function formatKr(n: number): string {
  return new Intl.NumberFormat("sv-SE").format(n);
}

export function formatRange(min: number, max: number): string {
  return `${formatKr(min)} – ${formatKr(max)} kr`;
}
