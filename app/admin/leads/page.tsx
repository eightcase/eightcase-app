import type { Metadata } from "next";
import { AdminLeads } from "@/components/admin/admin-leads";

export const metadata: Metadata = {
  title: "Leads | Eightcase Admin",
};

export default function AdminLeadsPage() {
  return <AdminLeads />;
}
