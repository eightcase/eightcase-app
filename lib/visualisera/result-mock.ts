/** Mock data for premium result / proposal presentation (demo only). */

export type ProjectPhase = {
  label: string;
  duration: string;
};

export type NearbyProject = {
  id: string;
  title: string;
  location: string;
  valueLabel: string;
  style: string;
};

export const PROJECT_TIMELINE: ProjectPhase[] = [
  { label: "Projektering", duration: "2–4 veckor" },
  { label: "Markarbete", duration: "3–5 veckor" },
  { label: "Installation", duration: "4–6 veckor" },
  { label: "Slutfinish", duration: "1–2 veckor" },
];

export const TRUST_ITEMS = [
  "Kostnadsfri rådgivning",
  "Lokal entreprenör",
  "Personlig offert",
  "Ingen bindning",
] as const;

export function getNearbyProjects(areaHint: string): NearbyProject[] {
  const area =
    areaHint.split(",")[0]?.trim() ||
    areaHint.split(" ")[0]?.trim() ||
    "ditt område";

  return [
    {
      id: "1",
      title: `Liknande projekt i ${area}`,
      location: area,
      valueLabel: "1,1–1,4 Mkr",
      style: "Modern · Mellan",
    },
    {
      id: "2",
      title: "Premiumpool i Malmö",
      location: "Limhamn",
      valueLabel: "1,3–1,6 Mkr",
      style: "Resort · Stor",
    },
    {
      id: "3",
      title: "Familjpool i Bjärred",
      location: "Bjärred",
      valueLabel: "890 000 – 1,1 Mkr",
      style: "Naturlig · Mellan",
    },
  ];
}

export function formatFinancingFrom(monthlyMin: number): string {
  const formatted = new Intl.NumberFormat("sv-SE").format(monthlyMin);
  return `Från ca ${formatted} kr/mån`;
}
