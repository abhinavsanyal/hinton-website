"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SeoFooter } from "@/views/home/seo-footer";
import { GlassPlayButton } from "@/components/common/glass-play-button";
import { ShareVideo } from "@/components/common/share-video";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import type { WorkVideo } from "@/data/mocks/work";

export const WorkView = ({ initialVideos }: { initialVideos: WorkVideo[] }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = [...new Set(initialVideos.flatMap(video => video.categories))];
  const videos = initialVideos.filter(video => `${video.title} ${video.description} ${video.client}`.toLowerCase().includes(search.toLowerCase()) && (!activeCategory || video.categories.includes(activeCategory)));
  return <>
    <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />
    <main id="main" className="editorial-main">
      <header className="editorial-heading"><p className="editorial-kicker">Selected films / 2026</p><h1>Stories made to move you.</h1><p className="editorial-lede">Commercials, character worlds and a first look at bigger stories. Explore the craft, then tell us what you want to make.</p><Link href="/#start-a-project" className="primary-button" data-cta>Let’s make your film ↗</Link></header>
      <div className="work-filters"><label>Find a film<input type="search" placeholder="Search films or brands" value={search} onChange={event => setSearch(event.target.value)} /></label><div className="action-row" aria-label="Filter films"><button type="button" className="quiet-button" aria-pressed={!activeCategory} onClick={() => setActiveCategory(null)}>All films</button>{categories.map(category => <button key={category} type="button" className="quiet-button" aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div></div>
      <p className="work-count" role="status">{videos.length} {videos.length === 1 ? "film" : "films"}</p>
      <section className="work-grid" aria-label="Film portfolio">{videos.map((video, index) => <article className="film-card" key={video.id}>
        <div className="film-poster"><Image fill loading={index < 2 ? "eager" : "lazy"} sizes="(max-width: 768px) 100vw, 50vw" src={video.posterUrl} alt={`A frame from ${video.title}`} /><GlassPlayButton videoSrc={video.videoUrl} /></div>
        <div className="film-info"><p className="editorial-kicker">{video.categories[0]} · {video.year}</p><h2><Link href={`/work/${video.slug}`}>{video.title}</Link></h2><p>{video.description}</p><div className="film-actions"><Link href={`/work/${video.slug}`} className="quiet-button">Watch film ↗</Link><ShareVideo slug={video.slug} title={video.title} /></div></div>
      </article>)}</section>
      {!videos.length && <p className="editorial-lede">No films match this search. Try another title or select All films.</p>}
      <section className="conversion-panel"><p className="editorial-kicker">Your story could be next</p><h2>Seen a direction you like?</h2><p>Send us a reference, a rough idea or a full brief. We’ll help shape the next step.</p><div className="action-row"><Link className="primary-button" href="/#start-a-project" data-cta>Start your project ↗</Link><Link className="quiet-button" href="/services/ai-feature-films">Explore feature films</Link></div></section>
    </main><SeoFooter />
  </>;
};
