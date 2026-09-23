import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { WorkView } from "@/views/work/work-view";
import { siteConfig } from "@/lib/site";
import { workVideos } from "@/data/mocks/work";

export const metadata = generateMetadata({
  title: "AI Film & Advertising Portfolio",
  url: "/work",
  description: "Explore the portfolio of AI-generated TVCs and films produced by Hinton Studios.",
});

export default function WorkPage() {
  const graph = { "@context": "https://schema.org", "@graph": workVideos.map(video => ({ "@type": "VideoObject", "@id": `${siteConfig.url}/work/${video.slug}#video`, name: video.title, description: video.description, url: `${siteConfig.url}/work/${video.slug}`, thumbnailUrl: `${siteConfig.url}${video.posterUrl}`, contentUrl: video.videoUrl, publisher: { "@id": `${siteConfig.url}/#organization` } })) };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} /><WorkView initialVideos={workVideos} /></>;
}
