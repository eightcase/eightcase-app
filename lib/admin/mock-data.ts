export type LeadStatus = "Het" | "Varm" | "Ny";

export type DashboardMetrics = {
  activeCampaigns: number;
  qrScans: number;
  visualizations: number;
  bookedConsultations: number;
  conversionRate: number;
};

export type CampaignStatus = "Aktiv" | "Pågående" | "Klar";

export type Campaign = {
  id: string;
  name: string;
  area: string;
  scans: number;
  completedFunnels: number;
  leads: number;
  bookedCalls: number;
  status: CampaignStatus;
  expectedReach: number;
  /** Estimated share of reach that scans QR (percent). */
  estimatedScanRate: number;
  estimatedLeads: number;
};

export type Lead = {
  id: string;
  name: string;
  address: string;
  style: string;
  budget: string;
  timeline: string;
  status: LeadStatus;
  campaign: string;
  createdAt: string;
};

export type BrandSettings = {
  companyName: string;
  email: string;
  phone: string;
  primaryColor: string;
};

export const MOCK_COMPANY: BrandSettings = {
  companyName: "Skåne Pool & Spa AB",
  email: "info@skanepool.se",
  phone: "040-12 34 56",
  primaryColor: "#8a9a82",
};

export const DASHBOARD_METRICS: DashboardMetrics = {
  activeCampaigns: 3,
  qrScans: 847,
  visualizations: 312,
  bookedConsultations: 41,
  conversionRate: 13.1,
};

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "loddekoping",
    name: "Löddeköpinge poolområde",
    area: "Löddeköpinge · 42 fastigheter",
    scans: 284,
    completedFunnels: 118,
    leads: 34,
    bookedCalls: 12,
    status: "Aktiv",
    expectedReach: 420,
    estimatedScanRate: 68,
    estimatedLeads: 38,
  },
  {
    id: "malmo-villa",
    name: "Malmö villaområde",
    area: "Bunkeflostrand · 68 fastigheter",
    scans: 391,
    completedFunnels: 142,
    leads: 48,
    bookedCalls: 18,
    status: "Pågående",
    expectedReach: 680,
    estimatedScanRate: 57,
    estimatedLeads: 52,
  },
  {
    id: "helsingborg-premium",
    name: "Helsingborg premiumkampanj",
    area: "Råå · 24 fastigheter",
    scans: 172,
    completedFunnels: 52,
    leads: 19,
    bookedCalls: 11,
    status: "Klar",
    expectedReach: 240,
    estimatedScanRate: 72,
    estimatedLeads: 22,
  },
];

export const MOCK_LEADS: Lead[] = [
  {
    id: "1",
    name: "Anna Lindström",
    address: "Storgatan 12, Lidingö",
    style: "Modern",
    budget: "1M+",
    timeline: "Inom 3 månader",
    status: "Het",
    campaign: "Löddeköpinge poolområde",
    createdAt: "2026-05-18",
  },
  {
    id: "2",
    name: "Erik Johansson",
    address: "Villavägen 8, Sollentuna",
    style: "Naturlig",
    budget: "750k–1M",
    timeline: "Så snart som möjligt",
    status: "Het",
    campaign: "Malmö villaområde",
    createdAt: "2026-05-17",
  },
  {
    id: "3",
    name: "Maria och Lars Berg",
    address: "Sjövägen 3, Saltsjöbaden",
    style: "Resort",
    budget: "1M+",
    timeline: "Inom 6–12 månader",
    status: "Varm",
    campaign: "Helsingborg premiumkampanj",
    createdAt: "2026-05-16",
  },
  {
    id: "4",
    name: "Johan Nilsson",
    address: "Ekvägen 14, Lund",
    style: "Familj",
    budget: "500k–750k",
    timeline: "Bara nyfiken",
    status: "Varm",
    campaign: "Malmö villaområde",
    createdAt: "2026-05-15",
  },
  {
    id: "5",
    name: "Sofia Andersson",
    address: "Parkgatan 7, Malmö",
    style: "Modern",
    budget: "750k–1M",
    timeline: "Inom 3 månader",
    status: "Ny",
    campaign: "Löddeköpinge poolområde",
    createdAt: "2026-05-19",
  },
  {
    id: "6",
    name: "Per och Karin Holm",
    address: "Strandvägen 22, Helsingborg",
    style: "Naturlig",
    budget: "1M+",
    timeline: "Så snart som möjligt",
    status: "Het",
    campaign: "Helsingborg premiumkampanj",
    createdAt: "2026-05-18",
  },
  {
    id: "7",
    name: "Lisa Ekman",
    address: "Björkvägen 5, Trelleborg",
    style: "Modern",
    budget: "500k–750k",
    timeline: "Inom 6–12 månader",
    status: "Ny",
    campaign: "Malmö villaområde",
    createdAt: "2026-05-19",
  },
];
