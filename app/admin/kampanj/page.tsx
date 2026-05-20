import type { Metadata } from "next";
import Link from "next/link";
import { CreateCampaignForm } from "@/components/admin/create-campaign-form";
import { ROUTES } from "@/lib/platform/zones";

export const metadata: Metadata = {
  title: "Skapa kampanj | Eightcase Admin",
};

export default function CreateCampaignPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link
        href={ROUTES.admin.campaigns}
        className="mb-6 inline-block text-sm text-ec-text-muted hover:text-ec-warm"
      >
        ← Tillbaka till kampanjer
      </Link>
      <CreateCampaignForm />
    </div>
  );
}
