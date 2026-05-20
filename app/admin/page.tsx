import type { Metadata } from "next";
import { AdminOverview } from "@/components/admin/admin-overview";

export const metadata: Metadata = {
  title: "Dashboard | Eightcase Admin",
  description: "Översikt för poolföretag — kampanjer, leads och visualiseringar.",
};

export default function AdminDashboardPage() {
  return <AdminOverview />;
}
