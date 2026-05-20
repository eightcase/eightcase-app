import type { Metadata } from "next";
import { DrainagePageClient } from "@/components/drainage/drainage-page-client";

export const metadata: Metadata = {
  title: "Dräneringsanalys | Eightcase",
  description: "Indikativ dräneringsrisk och kostnad för din fastighet.",
};

export default function DrainagePage() {
  return <DrainagePageClient />;
}
