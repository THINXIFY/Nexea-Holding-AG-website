import type { Metadata } from "next";
import { COMPANY } from "@/data/company";
import { PAGES, SITE_ALT_NAME, SITE_SLOGAN, type PageSeo } from "@/data/seo";

export const SITE_URL = COMPANY.url;
export const SITE_NAME = COMPANY.name;
/** The supplied lighter logo (transparent PNG, 1586 x 450). The file name contains spaces, so the URL is encoded. */
export const LOGO_URL = `${SITE_URL}/images/logo/NEXEA%20Holding%20AG%20Lighter%20logo.png`;

/** Branded 1200 x 630 social-sharing image (public/og). Relative: resolved against metadataBase. */
export const OG_IMAGE = {
  url: "/og/nexea-holding-og.jpg",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${SITE_SLOGAN}`,
  type: "image/jpeg",
} as const;

/** Canonical absolute URL. The preferred home URL is `https://nexea-holding.com/` (with the trailing slash). */
export const abs = (path: string) => `${SITE_URL}${path}`;

/** Complete per-page metadata: title, description, canonical, Open Graph and Twitter. Pages replace (not merge) the layout's openGraph, so each carries everything it needs. */
export function pageMetadata(page: PageSeo): Metadata {
  // Next.js normalises the root canonical / og:url to "https://nexea-holding.com" (no slash). The preferred home URL keeps the
  // slash, so for "/" those two tags come from <HomeCanonical /> instead (see components/seo/HomeCanonical.tsx).
  const home = page.path === "/";
  return {
    title: { absolute: page.title },
    description: page.description,
    ...(!home && { alternates: { canonical: abs(page.path) } }),
    openGraph: {
      title: page.title,
      description: page.description,
      ...(!home && { url: abs(page.path) }),
      siteName: SITE_NAME,
      type: "website",
      locale: "en_GB",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  };
}

// ----- JSON-LD (schema.org). Only facts already published on the site (Impressum / commercial register): no ratings,
// reviews, awards, licences, financial figures, profiles or other offices. The Organization and WebSite entities are defined
// once, on the home page; every other page refers to them by @id, so there is never a second or conflicting Organization.

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: SITE_ALT_NAME,
  legalName: SITE_NAME,
  url: abs("/"),
  logo: { "@type": "ImageObject", "@id": `${SITE_URL}/#logo`, url: LOGO_URL, contentUrl: LOGO_URL, width: 1586, height: 450, caption: SITE_NAME },
  image: `${SITE_URL}${OG_IMAGE.url}`,
  slogan: SITE_SLOGAN,
  description: PAGES.home.description,
  email: COMPANY.email,
  foundingDate: "2004",
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.address.street,
    postalCode: "6052",
    addressLocality: "Hergiswil",
    addressRegion: "NW",
    addressCountry: "CH",
  },
  identifier: [
    { "@type": "PropertyValue", propertyID: "Swiss company identification number (UID)", value: COMPANY.uid },
    { "@type": "PropertyValue", propertyID: "Swiss commercial register number", value: COMPANY.commercialRegisterNumber },
  ],
  contactPoint: { "@type": "ContactPoint", contactType: "general enquiries", email: COMPANY.email, availableLanguage: ["English"] },
};

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: abs("/"),
  name: SITE_NAME,
  alternateName: SITE_ALT_NAME,
  description: PAGES.home.description,
  inLanguage: "en",
  publisher: { "@id": ORG_ID },
};

const webPage = (page: PageSeo) => ({
  "@type": page.kind ?? "WebPage",
  "@id": `${abs(page.path)}#webpage`,
  url: abs(page.path),
  name: page.title,
  description: page.description,
  inLanguage: "en",
  dateModified: page.updated,
  isPartOf: { "@id": SITE_ID },
  ...(page.path === "/" ? { about: { "@id": ORG_ID } } : { breadcrumb: { "@id": `${abs(page.path)}#breadcrumb` } }),
});

const breadcrumb = (page: PageSeo) => ({
  "@type": "BreadcrumbList",
  "@id": `${abs(page.path)}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: PAGES.home.name, item: abs("/") },
    { "@type": "ListItem", position: 2, name: page.name, item: abs(page.path) },
  ],
});

/** Structured data for one page. Home: Organization + WebSite + WebPage. Inner pages: WebPage + BreadcrumbList (referencing the home entities). */
export function pageSchema(page: PageSeo) {
  const home = page.path === "/";
  return {
    "@context": "https://schema.org",
    "@graph": home ? [organization, website, webPage(page)] : [webPage(page), breadcrumb(page)],
  };
}

export const sitemapUrl = (path: string) => abs(path);
