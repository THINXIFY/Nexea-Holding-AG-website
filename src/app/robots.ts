import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Everything public is crawlable (including /_next assets, which Google needs to render the pages).
 * /api/ holds form and OTP endpoints and /documents/ the supplied register PDFs; neither belongs in search results.
 * robots.txt is a crawling hint, not access control: private documents are never web-served at all (private/documents).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/documents/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
