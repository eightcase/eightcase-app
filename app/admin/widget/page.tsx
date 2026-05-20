import type { Metadata } from "next";
import { AdminWidget } from "@/components/admin/admin-widget";

export const metadata: Metadata = {
  title: "Widget | Eightcase Admin",
};

export default function AdminWidgetPage() {
  return <AdminWidget />;
}
