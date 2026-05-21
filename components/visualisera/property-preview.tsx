"use client";

import { useEffect, useState } from "react";
import { fetchPropertyImageContext } from "@/lib/property-image/client";
import type { PropertyImageContext } from "@/lib/property-image/types";

type PropertyPreviewProps = {
  address: string;
  className?: string;
  label?: string;
  /** When parent already resolved context (e.g. pipeline), skip fetch */
  context?: PropertyImageContext | null;
};

function hashAddress(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function MockPropertyLayers({ address }: { address: string }) {
  const seed = hashAddress(address || "stockholm");
  const shiftX = (seed % 30) - 15;
  const shiftY = ((seed >> 3) % 24) - 12;
  const hue = 92 + (seed % 18);

  return (
    <>
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(85,95,80,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(85,95,80,0.12) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          transform: `translate(${shiftX * 0.15}px, ${shiftY * 0.15}px)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${45 + shiftX * 0.2}% ${44 + shiftY * 0.2}%, hsla(${hue}, 14%, 72%, 0.28), transparent 52%)`,
        }}
      />
      <div
        className="absolute inset-x-[10%] top-[20%] h-[45%] rounded-[1.4rem] border border-white/15 bg-white/8"
        aria-hidden
      />
      <div
        className="absolute inset-x-[15%] bottom-[14%] h-[12%] rounded-md bg-[#2a302c]/90"
        aria-hidden
      />
      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-full">
        <span className="relative flex h-9 w-9 items-center justify-center">
          <span className="absolute h-9 w-9 rounded-full bg-ec-forest/25" />
          <span className="relative h-3.5 w-3.5 rounded-full border-2 border-ec-forest bg-ec-sage shadow-lg shadow-black/25" />
        </span>
        <span className="mx-auto mt-0.5 block h-2 w-0.5 bg-ec-forest/80" />
      </div>
    </>
  );
}

export function PropertyPreview({
  address,
  className = "",
  label = "Fastighetsöversikt",
  context: contextProp,
}: PropertyPreviewProps) {
  const [context, setContext] = useState<PropertyImageContext | null>(contextProp ?? null);
  const [loading, setLoading] = useState(!contextProp && Boolean(address.trim()));

  useEffect(() => {
    if (contextProp !== undefined) {
      setContext(contextProp);
      setLoading(false);
      return;
    }

    const trimmed = address.trim();
    if (!trimmed) {
      setContext(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void fetchPropertyImageContext(trimmed)
      .then((ctx) => {
        if (!cancelled) {
          setContext(ctx);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setContext(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [address, contextProp]);

  const displayAddress = address.trim() || "Ange adress för fastighetsvy";
  const sourceLabel = context?.displaySource ?? "mock";
  const badgeText = `Fastighetsbild: ${sourceLabel}`;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-ec-border bg-ec-bg-subtle ${className}`}
    >
      {context?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- external Google Static Maps URL
        <img
          src={context.imageUrl}
          alt={`Satellitvy av ${displayAddress}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <MockPropertyLayers address={address} />
      )}

      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-ec-ink/20 backdrop-blur-[1px]">
          <p className="text-xs font-medium text-ec-cream">Hämtar fastighetsbild…</p>
        </div>
      ) : null}

      <div className="absolute right-2 top-2 z-10">
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm ${
            sourceLabel === "Google Maps"
              ? "border-ec-sage/40 bg-ec-forest/75 text-ec-cream"
              : "border-ec-border/60 bg-ec-ink/50 text-ec-cream/90"
          }`}
        >
          {badgeText}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ec-forest/85 via-ec-forest/55 to-transparent px-3 pb-3 pt-10">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ec-cream/80">{label}</p>
        <p className="mt-1 text-xs text-ec-cream">{displayAddress}</p>
        {context?.coordinates ? (
          <p className="mt-0.5 text-[10px] text-ec-cream/65">
            {context.coordinates.lat.toFixed(4)}, {context.coordinates.lng.toFixed(4)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
