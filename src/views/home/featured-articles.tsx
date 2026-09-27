import Link from "next/link";
import { featuredArticles } from "@/data/featured-articles";
import { ArticleCard } from "@/components/blog/article-card";
export function FeaturedArticles() {
  return <section className="editorial-section featured-articles" aria-labelledby="featured-articles-title"><div className="article-section-heading"><div><p className="editorial-kicker">The Hinton journal</p><h2 id="featured-articles-title">A little ahead of the frame.</h2></div><Link className="quiet-button" href="/blog" data-cta>Read more articles ↗</Link></div><div className="article-grid">{featuredArticles.slice(0, 3).map(article => <ArticleCard key={article.slug} article={article} placement="home" heading="h3" />)}</div></section>;
}
