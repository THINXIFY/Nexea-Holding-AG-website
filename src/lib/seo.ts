import type { Metadata } from "next";
import { COMPANY } from "@/data/company";
import { PAGES, SITE_SLOGAN, type PageSeo } from "@/data/seo";

export const SITE_URL = COMPANY.url;
export const SITE_NAME = COMPANY.name;
export const LOGO_URL = `${SITE_URL}/images/nexea-holding-logo.png`;

/** Branded 1200 x 630 social-sharing image (public/og). Relative: resolved against metadataBase. */
export const OG_IMAGE = {
  url: "/og/nexea-holding-og.jpg",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}: ${SITE_SLOGAN}`,
  type: "image/jpeg",
} as const;

/** Canonical absolute URL. The home page is the bare origin, exactly as Next.js emits its canonical and og:url. */
const abs = (path: string) => (path === "/" ? SITE_URL : `${SITE_URL}${path}`);

/** Complete per-page metadata: title, description, canonical, Open Graph and Twitter. Pages replace (not merge) the layout's openGraph, so each carries everything it needs. */
export function pageMetadata(page: PageSeo): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.path,
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

// ----- JSON-LD (schema.org). Only facts already published on the site: no ratings, awards, licences or offices.

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  legalName: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", "@id": `${SITE_URL}/#logo`, url: LOGO_URL, contentUrl: LOGO_URL, width: 2022, height: 537, caption: SITE_NAME },
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
  identifier: { "@type": "PropertyValue", propertyID: "Swiss company UID (UID-Register)", value: COMPANY.uid },
  contactPoint: { "@type": "ContactPoint", contactType: "general enquiries", email: COMPANY.email, availableLanguage: ["English"] },
};

const website = {
  "@type": "WebSite",
  "@id": SITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
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
  isPartOf: { "@id": SITE_ID },
  about: { "@id": ORG_ID },
  ...(page.path !== "/" && { breadcrumb: { "@id": `${abs(page.path)}#breadcrumb` } }),
});

const breadcrumb = (page: PageSeo) => ({
  "@type": "BreadcrumbList",
  "@id": `${abs(page.path)}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: PAGES.home.name, item: abs("/") },
    { "@type": "ListItem", position: 2, name: page.name, item: abs(page.path) },
  ],
});

/** Structured data for one page. The home page carries the Organization and WebSite entities; inner pages add a BreadcrumbList. */
export function pageSchema(page: PageSeo) {
  const home = page.path === "/";
  return {
    "@context": "https://schema.org",
    "@graph": home ? [organization, website, webPage(page)] : [webPage(page), breadcrumb(page), { "@id": ORG_ID, "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: LOGO_URL }],
  };
}

export const sitemapUrl = (path: string) => abs(path);
