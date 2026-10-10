import type { MetadataRoute } from "next";
import { COMPANY } from "@/data/company";

const ROUTES = ["/", "/about", "/investments", "/services", "/team", "/partnerships", "/contact", "/impressum", "/privacy-policy", "/terms-and-conditions"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({ url: `${COMPANY.url}${path === "/" ? "" : path}` }));
}
