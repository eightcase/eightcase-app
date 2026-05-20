import Link from "next/link";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { EightcaseLogo } from "@/components/brand";
import { ROUTES } from "@/lib/platform/zones";

export const metadata: Metadata = {
  title: "Logga in | Eightcase",
  description: "Logga in på Eightcase admin för poolföretag.",
};

export default function LoginPage() {
  return (
    <div className="zone-admin flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link
            href={ROUTES.marketing.home}
            className="inline-block transition opacity-90 hover:opacity-100"
          >
            <EightcaseLogo variant="lockup-stacked" size="xl" tone="forest" />
          </Link>
          <p className="mt-4 text-xs tracking-wide text-ec-text-muted">
            Demoportal för entreprenörer
          </p>
        </div>
        <h1 className="mt-10 text-lg font-medium text-ec-warm">Logga in</h1>
        <p className="mt-2 text-sm text-ec-text-muted">
          Prototyp — alla inloggningar går till admin i demo-läge.
        </p>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-ec-text-dim">
          <Link href={ROUTES.marketing.home} className="hover:text-ec-text-muted">
            ← Till marknadssajten
          </Link>
        </p>
      </div>
    </div>
  );
}
