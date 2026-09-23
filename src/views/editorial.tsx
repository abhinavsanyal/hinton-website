import Link from "next/link";
import { audioSamples } from "@/data/audio-samples";
import { AudioPlayer } from "@/components/ui/audio-player";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { SeoFooter } from "@/views/home/seo-footer";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { siteConfig } from "@/lib/site";

export function EditorialShell({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return <><SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} /><main id="main" className="editorial-main"><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>{kicker}</span></nav><header className="editorial-heading"><p className="editorial-kicker">{kicker}</p><h1>{title}</h1></header>{children}</main><SeoFooter /></>;
}
export const blogMetadata = buildMetadata({ title: "AI Filmmaking & Advertising Journal", description: "Practical guides to AI production, brand storytelling, animation and vertical micro-dramas from Hinton Studios.", url: "/blog" });
export function BlogView() {
  return <EditorialShell title="Ideas before images." kicker="The Hinton journal"><p className="editorial-lede">A closer look at the craft, decisions and possibilities behind human-directed AI films.</p><div className="editorial-grid">{articles.map((article) => <Link className="editorial-card" key={article.slug} href={`/blog/${article.slug}`}><p className="editorial-kicker">{article.category}</p><h2>{article.title}</h2><p>{article.description}</p><span>Read the story ↗</span></Link>)}</div></EditorialShell>;
}
export const articleParams = () => articles.map(({ slug }) => ({ slug }));
export async function articleMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = articles.find(a => a.slug === slug);
  return article ? buildMetadata({ title: article.title, description: article.description, url: `/blog/${slug}` }) : {};
}
export async function ArticleView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const article = articles.find(a => a.slug === slug); if (!article) notFound();
  const url = `${siteConfig.url}/blog/${slug}`;
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "Article", headline: article.title, description: article.description, mainEntityOfPage: url, author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url }, publisher: { "@id": `${siteConfig.url}/#organization` } }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url }, { "@type": "ListItem", position: 2, name: "Journal", item: `${siteConfig.url}/blog` }, { "@type": "ListItem", position: 3, name: article.title, item: url }] }] };
  return <EditorialShell title={article.title} kicker={article.category}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><article className="editorial-prose"><p className="editorial-kicker">By Hinton Studios · Production notes</p>{article.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<aside className="editorial-card"><h2>Bring your next brief.</h2><p>Explore the production approach, then tell us what you want to make.</p><Link href={`/services/${article.service}`}>Explore this service ↗</Link> · <Link href="/work">Watch our work ↗</Link></aside><Link href="/blog">← All articles</Link></article></EditorialShell>;
}
export const aboutMetadata = buildMetadata({ title: "About Our AI Film Studio", description: "Meet Hinton Studios, a Bengaluru-based studio combining human creative direction with AI-assisted film production for brands worldwide.", url: "/about" });
export function AboutView() {
  return <EditorialShell title="Human vision. New ways to make it real." kicker="About Hinton"><div className="editorial-prose"><p className="editorial-lede">We are a Bengaluru-based AI filmmaking studio. Our work brings creative direction, visual development and film finishing into one production process.</p><h2>The idea comes first.</h2><p>We help brands turn a brief into a film: from the first narrative and visual references to the edit, sound and final delivery. AI expands the production toolkit; people make the decisions that give a film its purpose.</p><h2>A studio for every screen.</h2><p>Explore our television commercials, brand and product films, animation, visual effects and vertical storytelling. We scope each project around its audience, channel, creative ambition and delivery requirements.</p><h2>Start a conversation.</h2><p>Our studio contacts are Abhinava, Avkash and Souvik. Share your brief with <a href="mailto:abhinava@hintonstudios.com">abhinava@hintonstudios.com</a> and we’ll connect you with the right team.</p><Link href="/work">Explore our work ↗</Link></div></EditorialShell>;
}
export const audioMetadata = { ...buildMetadata({ title: "AI Voice & Audio Production", description: "Explore Hinton Studios’ approach to AI-assisted voice, sound and multilingual film production. Request audio references for your brief.", url: "/audio-samples" }), robots: { index: audioSamples.length > 0, follow: true } };
export function AudioView() {
  return <EditorialShell title="Give your story a voice." kicker="AI audio"><div className="editorial-prose"><p className="editorial-lede">Voice and sound should belong to the film, not feel added on.</p><h2>Voice direction, language and tone.</h2><p>Tell us the language, intended audience, duration and mood of your project. We can discuss voice direction and audio references as part of your production brief.</p><h2>Listen to references for your project.</h2>{audioSamples.length ? <div className="editorial-grid">{audioSamples.map(sample => <AudioPlayer key={sample.id} sample={sample} />)}</div> : <p>Our public audio collection is being prepared. Contact the studio for relevant samples and usage details.</p>}<a href="mailto:abhinava@hintonstudios.com">Request audio samples ↗</a></div></EditorialShell>;
}
