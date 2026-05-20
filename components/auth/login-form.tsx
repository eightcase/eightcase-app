"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/platform/zones";

export function LoginForm() {
  return (
    <form
      className="mt-8 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = ROUTES.admin.root;
      }}
    >
      <label className="block">
        <span className="text-sm text-ec-warm">E-post</span>
        <input
          type="email"
          defaultValue="info@skanepool.se"
          className="admin-panel mt-2 w-full px-3 py-2.5 text-sm text-ec-warm focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
        />
      </label>
      <label className="block">
        <span className="text-sm text-ec-warm">Lösenord</span>
        <input
          type="password"
          defaultValue="demo"
          className="admin-panel mt-2 w-full px-3 py-2.5 text-sm text-ec-warm focus:outline-none focus:ring-1 focus:ring-ec-sage/40"
        />
      </label>
      <button
        type="submit"
        className="btn-primary mt-2 flex h-10 w-full items-center justify-center rounded-md text-sm font-medium"
      >
        Logga in (demo)
      </button>
      <p className="text-center text-xs text-ec-text-dim">
        Ingen riktig autentisering —{" "}
        <Link href={ROUTES.admin.root} className="text-ec-sage hover:text-ec-warm">
          hoppa till admin
        </Link>
      </p>
    </form>
  );
}
