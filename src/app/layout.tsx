import type { Metadata, Viewport } from "next";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";

import { LazyCookie } from "@/components/common/Cookie";
import { AdaptiveGrid } from "@/components/common/grid";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollLayout } from "@/layouts/scroll-layout";
import { SiteOverlays } from "@/components/common/site-overlays";

import "@/app/globals.css";
import { Analytics } from "@/components/analytics/analytics";

export const metadata: Metadata = generateMetadata({
  title: "AI Filmmaking Studio & AI Video Production Company | Hinton Studios, Bengaluru",
  description: "Human-directed AI video production in Bengaluru. Explore Hinton Studios’ TV commercials, brand films, product videos, animation and vertical micro-dramas."
});
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <ScrollLayout>
          <AdaptiveGrid />
          <ReducedMotion />
          <LazyCookie />
          <Analytics />
          {children}
          <SiteOverlays />
        </ScrollLayout>
      </body>
    </html>
  );
}
