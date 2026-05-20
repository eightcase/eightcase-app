import type { Metadata } from "next";
import { VisualiseraFunnel } from "@/components/visualisera/visualisera-funnel";

export const metadata: Metadata = {
  title: "Visualisera din pool | Eightcase",
  description:
    "Se hur din framtida pool kan se ut — AI-driven visualisering och prisindikation på några minuter.",
};

export default function VisualiseraPage() {
  return <VisualiseraFunnel />;
}
