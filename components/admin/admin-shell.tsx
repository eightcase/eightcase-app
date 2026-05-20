"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EightcaseLogo } from "@/components/brand";
import { ROUTES } from "@/lib/platform/zones";
import { MOCK_COMPANY } from "@/lib/admin/mock-data";

const NAV = [
  { href: ROUTES.admin.root, label: "Dashboard", match: (p: string) => p === ROUTES.admin.root },
  {
    href: ROUTES.admin.campaigns,
    label: "Kampanjer",
    match: (p: string) => p.startsWith("/admin/kampanj"),
  },
  { href: ROUTES.admin.leads, label: "Leads", match: (p: string) => p === ROUTES.admin.leads },
  { href: ROUTES.admin.widget, label: "Widget", match: (p: string) => p === ROUTES.admin.widget },
  {
    href: ROUTES.admin.settings,
    label: "Inställningar",
    match: (p: string) => p === ROUTES.admin.settings,
  },
] as const;

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="zone-admin relative min-h-screen font-sans text-ec-text">
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-ec-border bg-ec-bg-elevated lg:flex">
          <div className="border-b border-ec-border-subtle px-4 py-6">
            <Link
              href={ROUTES.marketing.home}
              className="block transition opacity-90 hover:opacity-100"
            >
              <EightcaseLogo variant="lockup-horizontal" size="md" tone="forest" />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 p-3">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "admin-nav-active"
                      : "text-ec-text-muted hover:bg-ec-bg-subtle hover:text-ec-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-ec-border-subtle p-3">
            <Link
              href={ROUTES.auth.login}
              className="block rounded-lg px-3 py-2 text-xs text-ec-text-dim hover:text-ec-ink-muted"
            >
              Logga in
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-4 border-b border-ec-border bg-ec-bg-elevated px-4 py-3 sm:px-6">
            <div className="flex items-center gap-4">
              <Link
                href={ROUTES.marketing.home}
                className="block transition opacity-90 hover:opacity-100 lg:hidden"
              >
                <EightcaseLogo variant="symbol" size="md" tone="forest" />
              </Link>
              <span className="rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-900/80">
                Demo-läge
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-ec-text-muted sm:inline">
                {MOCK_COMPANY.companyName}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ec-forest text-xs font-medium text-ec-cream">
                SP
              </div>
            </div>
          </header>

          <nav className="flex gap-1 overflow-x-auto border-b border-ec-border bg-ec-bg-elevated px-4 py-2 lg:hidden">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs transition ${
                    active ? "admin-nav-active" : "text-ec-text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 overflow-x-hidden p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
