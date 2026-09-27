import Image from "next/image";
import Link from "next/link";
import { readingMinutes, type Article } from "@/data/article-types";
export function ArticleCard({ article, placement = "blog", heading: Heading = "h2" }: { article: Article; placement?: string; heading?: "h2" | "h3" }) {
  return <Link className="article-card" href={`/blog/${article.slug}`} data-article-slug={article.slug} data-article-placement={placement}>
    {article.cover && <div className="article-card-image"><Image src={article.cover} alt={article.coverAlt ?? article.title} width={1440} height={810} sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 360px" /></div>}
    <div className="article-card-copy"><p className="editorial-kicker">{article.category} · {readingMinutes(article)} min read</p><Heading>{article.title}</Heading><p>{article.description}</p><span>Read the story <span aria-hidden="true">↗</span></span></div>
  </Link>;
}
