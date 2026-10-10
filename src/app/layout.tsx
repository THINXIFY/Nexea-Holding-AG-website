import type { Metadata, Viewport } from "next";
import { DM_Sans, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollRefresh } from "@/components/layout/ScrollRefresh";

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
  title: {
    default: "Nexea Holding AG | Swiss Investment Holding",
    template: "%s | Nexea Holding AG",
  },
  description:
    "Nexea Holding AG is an independent Swiss investment holding company with an international outlook, focused on established industries, real assets, and emerging technologies.",
  applicationName: "Nexea Holding AG",
  openGraph: {
    title: "Nexea Holding AG",
    description: "Capital with Perspective. Opportunity Without Borders.",
    type: "website",
    locale: "en_CH",
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
