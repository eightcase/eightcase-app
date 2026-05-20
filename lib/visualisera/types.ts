export type FunnelStep =
  | "address"
  | "early_contact"
  | "style"
  | "size"
  | "features"
  | "budget"
  | "loading"
  | "result";

export type PoolStyle = "Modern" | "Naturlig" | "Resort" | "Familj";
export type PoolSize = "Kompakt" | "Mellan" | "Stor" | "Lyx";
export type BudgetRange = "500k–750k" | "750k–1M" | "1M+";
export type Timeline = "Så snart som möjligt" | "Inom 3 månader" | "Inom 6–12 månader" | "Bara nyfiken";

export type FunnelState = {
  address: string;
  style: PoolStyle | null;
  size: PoolSize | null;
  features: string[];
  budget: BudgetRange | null;
  timeline: Timeline | null;
};

export const initialFunnelState: FunnelState = {
  address: "",
  style: null,
  size: null,
  features: [],
  budget: null,
  timeline: null,
};

export type PriceEstimate = {
  min: number;
  max: number;
  monthlyMin: number;
  monthlyMax: number;
};
