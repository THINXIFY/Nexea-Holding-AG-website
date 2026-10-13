import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollRefresh } from "@/components/layout/ScrollRefresh";
import { PAGES } from "@/data/seo";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const ui = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: PAGES.home.title, template: "%s | Nexea Holding AG" },
  description: PAGES.home.description,
  applicationName: SITE_NAME,
  // Google Search Console ownership verification: keep it so the site stays verified.
  verification: { google: "-WItgd9DTmuzOXdFQQjWB3fkT4HgDjvjboNowT9d-RA" },
  // Indexable by default; googleBot hints allow full-size image previews and complete snippets.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: {
    title: PAGES.home.title,
    description: PAGES.home.description,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_GB",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGES.home.title,
    description: PAGES.home.description,
    images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
  },
};

export const viewport: Viewport = {
  themeColor: "#090D11",
  colorScheme: "light",
};

/**
 * Marks the document as "motion ready" before first paint so GSAP-driven
 * elements can start hidden without a flash. A timeout removes the class
 * if animations never initialise, so content can never stay invisible.
 */
const MOTION_GUARD = `(function(){var d=document.documentElement;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion-ready');setTimeout(function(){d.classList.remove('motion-ready')},6000)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${ui.variable} ${body.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GUARD }} />
      </head>
      <body>
        <Header />
        <ScrollRefresh />
        {children}
        <Footer />
      </body>
    </html>
  );
}
