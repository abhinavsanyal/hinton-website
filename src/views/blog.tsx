import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { readingMinutes, type Article } from "@/data/article-types";
import { ArticleCard } from "@/components/blog/article-card";
import { ArticleActions, ArticleEngagement } from "@/components/blog/article-engagement";
import { EditorialShell } from "@/components/blog/editorial-shell";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { siteConfig } from "@/lib/site";

export const blogMetadata = buildMetadata({ title: "AI Filmmaking Blog: Craft, Tools & Industry", description: "Hinton’s practical guides to Seedance, Blender previz, AI filmmaking, motion design and India’s creative economy. Research, references and production thinking.", url: "/blog" });
export function BlogView() {
  return <EditorialShell title="Ideas before images." kicker="The Hinton journal"><p className="editorial-lede">Field notes for a changing craft. Tools worth understanding. Stories worth making.</p><div className="article-grid">{articles.map(article => <ArticleCard key={article.slug} article={article} />)}</div></EditorialShell>;
}
export const articleParams = () => articles.map(({ slug }) => ({ slug }));
export async function articleMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = articles.find(a => a.slug === slug);
  if (!article) return {};
  const base = buildMetadata({ title: article.title, description: article.description, url: `/blog/${slug}` });
  return { ...base, openGraph: { ...base.openGraph, type: "article" as const, ...(article.published ? { publishedTime: article.published } : {}), ...(article.cover ? { images: [{ url: article.cover, width: 1440, height: 810, alt: article.coverAlt }] } : {}) }, twitter: { ...base.twitter, ...(article.cover ? { images: [article.cover] } : {}) } };
}
function Illustration({ article, diagram = false }: { article: Article; diagram?: boolean }) {
  const src = diagram ? article.diagram : article.cover;
  if (!src) return null;
  return <figure className="article-figure"><Image src={src} alt={(diagram ? article.diagramAlt : article.coverAlt) ?? article.title} width={1440} height={810} sizes="(max-width: 800px) 92vw, 850px" priority={!diagram} unoptimized={diagram} /><figcaption>{diagram ? article.diagramAlt : "Original editorial illustration · Hinton Studios · AI-assisted artwork"}</figcaption></figure>;
}
export async function ArticleView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = articles.find(a => a.slug === slug); if (!article) notFound();
  const url = `${siteConfig.url}/blog/${slug}`;
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "BlogPosting", headline: article.title, description: article.description, mainEntityOfPage: url, ...(article.cover ? { image: [`${siteConfig.url}${article.cover}`] } : {}), ...(article.published ? { datePublished: article.published, dateModified: article.published } : {}), author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url }, publisher: { "@id": `${siteConfig.url}/#organization` } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }, { "@type": "ListItem", position: 2, name: "Blogs", item: `${siteConfig.url}/blog` }, { "@type": "ListItem", position: 3, name: article.title, item: url }] }] };
  return <EditorialShell title={article.title} kicker={article.category}>
    <ArticleEngagement key={slug} slug={slug} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <div className="article-byline">Hinton Studios <span aria-hidden="true">/</span> {readingMinutes(article)} min read {article.published && <><span aria-hidden="true">/</span><time dateTime={article.published}>27 September 2026</time></>}</div>
    <p className="editorial-lede">{article.description}</p>
    <Illustration article={article} />
    <article id="article-content" className="editorial-prose article-body" aria-label={article.title}>
      {article.takeaway && <aside className="article-takeaway"><span className="editorial-kicker">The idea to take away</span><p>{article.takeaway}</p></aside>}
      <nav className="article-contents" aria-label="In this article"><p className="editorial-kicker">In this story</p>{article.sections.map((section, i) => <a key={section.heading} href={`#section-${i + 1}`}><span>{String(i + 1).padStart(2, "0")}</span>{section.heading}</a>)}</nav>
      {article.sections.map((section, i) => <section key={section.heading} id={`section-${i + 1}`} className="article-chapter"><h2>{section.heading}</h2>{section.body.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}{section.prompt && <div className="article-prompt"><p className="editorial-kicker">Try this prompt · adapt to your project</p><pre>{section.prompt}</pre></div>}{section.sources?.length ? <div className="article-sources">Sources: {section.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div> : null}{i === 2 && <Illustration article={article} diagram />}</section>)}
      {article.published && <p className="article-research-note">Research checked 27 September 2026. Product details can change. Workflow examples are editorial suggestions, not performance benchmarks or guaranteed results.</p>}
      <ArticleActions key={slug} slug={slug} title={article.title} />
      <aside className="editorial-card article-contact"><p className="editorial-kicker">Put the idea to work</p><h2>What are you making next?</h2><p>Bring us the brief, the difficult shot or the first few lines. We’ll help shape a production approach.</p><div className="action-row"><Link className="primary-button" href="/#contact" data-article-cta={slug}>Talk to Hinton ↗</Link><Link href={`/services/${article.service}`} data-article-cta={slug}>Explore this service ↗</Link></div></aside>
      <Link href="/blog">← All articles</Link>
    </article>
  </EditorialShell>;
}
