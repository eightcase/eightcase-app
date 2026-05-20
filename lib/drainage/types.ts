export type HouseAge = "0–10 år" | "10–25 år" | "25–40 år" | "40+ år";

export type RiskLevel = "Låg" | "Måttlig" | "Förhöjd" | "Hög";

export type DrainageFunnelStep = "age" | "symptoms" | "analyzing" | "result";

export type DrainageState = {
  houseAge: HouseAge | null;
  symptoms: string[];
};

export const initialDrainageState: DrainageState = {
  houseAge: null,
  symptoms: [],
};

export type DrainageAssessment = {
  riskLevel: RiskLevel;
  riskScore: number;
  recommendation: string;
  problemZones: string[];
  drainageMin: number;
  drainageMax: number;
  coordinatedSavingsKr: number;
  coordinatedSavingsPercent: number;
  combinedMin: number;
  combinedMax: number;
  separateTotalMin: number;
  separateTotalMax: number;
};
