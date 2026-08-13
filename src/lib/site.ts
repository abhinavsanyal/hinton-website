/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update the placeholder values per project.
 */
import { publicEnv } from "@/env";

export const siteConfig = {
  name: "Hinton Studios",
  /** Used as the homepage `<title>` suffix and the default share title. */
  tagline: "AI-Powered Filmmaking",
  description:
    "Hinton Studios — AI filmmaking and AI video production studio based in Bengaluru, India.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url: publicEnv.NEXT_PUBLIC_SITE_URL ?? "https://hintonstudios.com",
  twitterHandle: "@hintonstudios",
  author: "Hinton Studios",
  /** Browser theme-color (address bar / PWA) — matches the page backdrop. */
  themeColor: "#000000",
} as const;
