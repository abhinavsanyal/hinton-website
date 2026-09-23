import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { workVideos } from "@/data/mocks/work";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { SeoFooter } from "@/views/home/seo-footer";
import { ShareVideo } from "@/components/common/share-video";
import { siteConfig } from "@/lib/site";
import { FilmPlayer } from "@/components/common/film-player";

type FilmProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return workVideos.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: FilmProps): Promise<Metadata> {
  const { slug } = await params;
  const film = workVideos.find(video => video.slug === slug);
  if (!film) return {};
  const title = `${film.title} (2026)`;
  const url = `${siteConfig.url}/work/${slug}`;
  return { title, description: film.description, alternates: { canonical: url }, openGraph: { title, description: film.description, url, type: "video.other", images: [{ url: film.posterUrl, width: 1280, height: 720, alt: film.title }] }, twitter: { card: "summary_large_image", title, description: film.description, images: [film.posterUrl] } };
}
export default async function FilmView({ params }: FilmProps) {
  const { slug } = await params;
  const film = workVideos.find(video => video.slug === slug);
  if (!film) notFound();
  const url = `${siteConfig.url}/work/${slug}`;
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "VideoObject", "@id": `${url}#video`, name: film.title, description: film.description, thumbnailUrl: `${siteConfig.url}${film.posterUrl}`, contentUrl: film.videoUrl, url, publisher: { "@id": `${siteConfig.url}/#organization` } },
    { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }, { "@type": "ListItem", position: 2, name: "Work", item: `${siteConfig.url}/work` }, { "@type": "ListItem", position: 3, name: film.title, item: url }] },
  ] };
  return <><SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} /><main id="main" className="editorial-main"><nav aria-label="Breadcrumb"><Link href="/work">← All films</Link></nav><header className="film-heading"><p className="editorial-kicker">{film.categories.join(" / ")} · {film.year}</p><h1>{film.title}</h1></header><FilmPlayer video={film} /><div className="film-summary"><p className="editorial-lede">{film.description}</p><ShareVideo slug={film.slug} title={film.title} /></div><section className="conversion-panel"><p className="editorial-kicker">From a reference to your own film</p><h2>Make something unmistakably yours.</h2><p>Tell us about your audience, your story and the screen you have in mind.</p><Link className="primary-button" href="/#start-a-project" data-cta>Brief the studio ↗</Link></section></main><SeoFooter /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /></>;
}
