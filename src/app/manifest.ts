import type { MetadataRoute } from "next";
import { PAGES, SITE_SLOGAN } from "@/data/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nexea Holding AG",
    short_name: "Nexea",
    description: `${SITE_SLOGAN} ${PAGES.home.description}`,
    start_url: "/",
    display: "browser",
    background_color: "#090D11",
    theme_color: "#090D11",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
