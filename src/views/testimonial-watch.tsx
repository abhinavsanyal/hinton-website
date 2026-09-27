import type { Metadata } from "next";
import Link from "next/link";
import { ClientTestimonial } from "@/views/home/client-testimonial";
import { testimonial } from "@/data/testimonial";
import { siteConfig } from "@/lib/site";
const url = `${siteConfig.url}${testimonial.path}`;
export const metadata: Metadata = {
  title: testimonial.title, description: testimonial.description,
  alternates: { canonical: url },
  openGraph: { title: testimonial.title, description: testimonial.description, url, type: "video.other", images: [{ url: `${siteConfig.url}${testimonial.poster}`, width: 1920, height: 1080, alt: testimonial.title }] },
  twitter: { card: "summary_large_image", title: testimonial.title, description: testimonial.description, images: [`${siteConfig.url}${testimonial.poster}`] },
};
export default function TestimonialWatch() {
  const schema = { "@context": "https://schema.org", "@type": "VideoObject", name: testimonial.title, description: testimonial.description, thumbnailUrl: `${siteConfig.url}${testimonial.poster}`, contentUrl: testimonial.videoUrl, url, uploadDate: "2026-09-27T11:43:43Z", duration: "PT3M4S", publisher: { "@id": `${siteConfig.url}/#organization` } };
  return <main id="main" className="testimonial-watch-shell"><nav aria-label="Back to Hinton Studios"><Link href="/">← Hinton Studios</Link></nav><ClientTestimonial watchPage /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></main>;
}
