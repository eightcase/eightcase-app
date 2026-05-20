import type { Metadata } from "next";
import { VisualizationPageClient } from "@/components/visualization/visualization-page-client";

type PageProps = {
  params: Promise<{ leadId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { leadId } = await params;
  return {
    title: `Din visualisering | Eightcase`,
    description: "Personlig poolvisualisering — justera och spara din framtida bakgård.",
    robots: { index: false, follow: false },
  };
}

export default async function VisualiseringPage({ params }: PageProps) {
  const { leadId } = await params;
  return <VisualizationPageClient leadId={leadId} />;
}
