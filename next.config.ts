import type { NextConfig } from "next";

/**
 * Repeat-visit caching for static media. The HTML is prerendered and revalidated by the app; these files change rarely
 * and are renamed when replaced, so a day of freshness plus a week of stale-while-revalidate is safe and removes the
 * per-image revalidation round trip (public/ files otherwise answer `max-age=0`).
 */
const STATIC_MEDIA_CACHE = "public, max-age=86400, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimised images default to a 4 h lifetime; a week avoids re-fetching them on every visit.
    minimumCacheTTL: 604800,
  },
  async headers() {
    return [
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: STATIC_MEDIA_CACHE }] },
      { source: "/icons/:path*", headers: [{ key: "Cache-Control", value: STATIC_MEDIA_CACHE }] },
      { source: "/og/:path*", headers: [{ key: "Cache-Control", value: STATIC_MEDIA_CACHE }] },
    ];
  },
};

export default nextConfig;
