import type { Metadata } from "next";
import { AdminSettings } from "@/components/admin/admin-settings";

export const metadata: Metadata = {
  title: "Inställningar | Eightcase Admin",
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
