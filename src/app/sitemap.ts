import type { MetadataRoute } from "next";
import { PAGE_LIST } from "@/data/seo";
import { sitemapUrl } from "@/lib/seo";

/** One canonical URL per public page (query-string variants are canonicalised to these and deliberately not listed). */
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGE_LIST.map((p) => ({ url: sitemapUrl(p.path), lastModified: p.updated }));
}
