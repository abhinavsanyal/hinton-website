export interface ArticleSource { label: string; url: string }
export interface ArticleSection { heading: string; body: string; sources?: ArticleSource[]; bullets?: string[]; prompt?: string }
export interface Article {
  slug: string; title: string; category: string; service: string; description: string;
  sections: ArticleSection[]; published?: string; featured?: boolean;
  cover: string; coverAlt: string; diagram?: string; diagramAlt?: string; takeaway?: string;
}
export function readingMinutes(article: Article) {
  const words = article.sections.map(s => [s.body, s.prompt, ...(s.bullets ?? [])].filter(Boolean).join(" ")).join(" ").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
