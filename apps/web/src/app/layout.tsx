import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SITE } from "@/lib/site";
import "./globals.css";

const TITLE = `${SITE.name} — ${SITE.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "cDoc",
    "code diagnostics",
    "security scanner",
    "developer tools",
    "CLI",
    "JavaScript",
    "TypeScript",
    "dependency health",
    "environment validation",
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
    description: SITE.description,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

const SKIP_LINK_CLASS =
  "fixed top-4 left-4 z-[60] -translate-y-[calc(100%+3rem)] rounded-lg bg-accent px-4 py-2.5 text-sm font-medium tracking-tight text-accent-ink shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)] transition-transform duration-150 focus:translate-y-0 focus:outline-none";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-surface font-sans text-foreground antialiased">
        <a href="#main" className={SKIP_LINK_CLASS}>
          Skip to content
        </a>

        <SiteHeader />

        <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
