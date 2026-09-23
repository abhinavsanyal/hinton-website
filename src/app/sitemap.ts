import type { MetadataRoute } from "next";

import { servicesContent } from "@/data/mocks/services";
import { workVideos } from "@/data/mocks/work";
import { articles } from "@/data/articles";
import { siteConfig } from "@/lib/site";

/**
 * Generates `/sitemap.xml`. The service pages are derived from the content
 * source of truth so a new entry in `servicesContent` is listed automatically.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-23");

  return [
    { url: siteConfig.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/work`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...["/about", "/blog", "/video-marketing-report"].map(path => ({ url: `${siteConfig.url}${path}`, lastModified })),
    ...workVideos.map(video => ({ url: `${siteConfig.url}/work/${video.slug}`, lastModified })),
    ...articles.map(article => ({ url: `${siteConfig.url}/blog/${article.slug}`, lastModified })),
    ...servicesContent.map((service) => ({
      url: `${siteConfig.url}/services/${service.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
