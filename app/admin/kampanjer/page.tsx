import type { Metadata } from "next";
import { AdminCampaigns } from "@/components/admin/admin-campaigns";

export const metadata: Metadata = {
  title: "Kampanjer | Eightcase Admin",
};

export default function AdminCampaignsPage() {
  return <AdminCampaigns />;
}
