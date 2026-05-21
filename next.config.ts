import path from "path";
import type { NextConfig } from "next";

/**
 * Pin Turbopack/webpack to this app directory.
 * Prevents Next from inferring /Users/echo/Documents as workspace root
 * when a parent package-lock.json exists.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "replicate.delivery" },
      { protocol: "https", hostname: "maps.googleapis.com" },
    ],
  },
};

export default nextConfig;
