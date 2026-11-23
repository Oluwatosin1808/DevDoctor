import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE } from "@/lib/site";
import "./globals.css";

const TITLE = `${SITE.name} — Local-first developer diagnostics`;
const DESCRIPTION = `${SITE.tagline} ${SITE.description}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s · ${SITE.name}`,
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  keywords: [
    "cDoc",
    "developer diagnostics",
    "codebase health",
    "local-first CLI",
    "JavaScript",
    "TypeScript",
    "dependency checks",
    "environment checks",
    "open source",
  ],
  authors: [{ name: SITE.name }],
  category: "developer tools",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F6F0",
  colorScheme: "light",
};

const SKIP_LINK_CLASS =
  "fixed top-4 left-4 z-[60] -translate-y-[calc(100%+3rem)] rounded-lg bg-lime px-4 py-2.5 text-sm font-medium text-lime-ink transition-transform duration-150 focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink antialiased">
        <a href="#main" className={SKIP_LINK_CLASS}>
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <SiteFooter />

        <Analytics />
      </body>
    </html>
  );
}
