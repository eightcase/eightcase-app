import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function isSupabaseCompanyIdConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ID?.trim();
  return Boolean(id);
}

/** Safe yes/no flags for UI debug (no secret values). */
export function getSupabasePublicConfigStatus(): {
  hasUrl: boolean;
  hasAnonKey: boolean;
  configured: boolean;
  hasCompanyId: boolean;
} {
  return {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
    hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
    configured: isSupabaseConfigured(),
    hasCompanyId: isSupabaseCompanyIdConfigured(),
  };
}

/**
 * Browser-safe Supabase client.
 * Returns null when env vars are missing so callers can fallback to demo mode.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (browserClient) return browserClient;

  browserClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return browserClient;
}
