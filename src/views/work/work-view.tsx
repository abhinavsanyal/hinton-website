"use client";

import { useMemo, useState } from "react";
import { Inview } from "@/components/animation/springs/in-view";
import Link from "next/link";
import { GlassPlayButton } from "@/components/common/glass-play-button";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { InViewVideo } from "@/components/ui/in-view-video";

export type WorkVideo = {
  id: string;
  title: string;
  videoUrl: string;
  categories: string[];
  client: string;
  duration: string;
  year: string;
};

export const WorkView = ({ initialVideos }: { initialVideos: WorkVideo[] }) => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    initialVideos.forEach(v => v.categories.forEach(c => cats.add(c)));
    return Array.from(cats);
  }, [initialVideos]);

  const filteredVideos = useMemo(() => {
    return initialVideos.filter((v) => {
      const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || 
                            v.client.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory ? v.categories.includes(activeCategory) : true;
      return matchesSearch && matchesCategory;
    });
  }, [initialVideos, search, activeCategory]);

  return (
    <>
    <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />

    <main className="min-h-screen bg-black text-white pt-[24vmin] pb-[8vmin] px-[4vmin] overflow-hidden">
      {/* Fixed Close Button */}
      <Link 
        href="/"
        className="fixed top-8 right-8 z-50 flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110 max-sm:top-24 max-sm:right-4"
        aria-label="Close Work page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
          <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </Link>

      {/* Background ambient layer (similar to home) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
            backgroundSize: "256px 256px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Header section with filters */}
        <section className="mb-[8vmin]">
          <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} delayIn={200}>
            <h1 className="text-[10vw] md:text-[6vw] font-extralight tracking-[-0.03em] leading-[0.95] mb-[4vmin] font-zen">
              Our Work
            </h1>
          </Inview>
          
          <Inview mode="once" from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }} delayIn={400}>
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              {/* Search */}
              <input 
                type="text"
                placeholder="Search by title or client..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/3 bg-white/5 border border-white/10 rounded-full px-6 py-3.5 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/30 text-white/90"
              />
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`px-5 py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest transition-colors ${!activeCategory ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  All
                </button>
                {allCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-[10px] sm:text-xs uppercase tracking-widest transition-colors ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </Inview>
        </section>

        {/* Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-[3vmin]">
          {filteredVideos.map((video, idx) => (
            <Inview 
              key={video.id} 
              mode="once" 
              from={{ opacity: 0, y: 60, scale: 0.95 }} 
              to={{ opacity: 1, y: 0, scale: 1 }}
              delayIn={(idx % 3) * 150}
              className="group relative flex flex-col justify-end overflow-hidden rounded-pf bg-white/5 aspect-[4/5] [backface-visibility:hidden] [transform:translateZ(0)] border border-white/5"
            >
              <InViewVideo
                className="absolute inset-0 z-0 size-full object-cover opacity-70 transition-all duration-1000 ease-out group-hover:opacity-100 group-hover:scale-105 [backface-visibility:hidden] [transform:translateZ(0)] pointer-events-none"
                src={video.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
              />
              {/* Glass Play Button Overlay */}
              <GlassPlayButton videoSrc={video.videoUrl} />

              {/* Cinematic Grain inside the card for that premium feel */}
              <div
                aria-hidden="true"
                className="absolute inset-0 z-[1] pointer-events-none opacity-[0.08] mix-blend-overlay transition-opacity duration-1000 group-hover:opacity-0"
                style={{
                  backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
                  backgroundSize: "256px 256px",
                }}
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 pointer-events-none transition-opacity duration-700 group-hover:opacity-100" />

              {/* Content */}
              <div className="relative z-[2] p-[4vmin] max-sm:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out pointer-events-none">
                <div className="flex flex-wrap items-center gap-[1.5vmin] text-[1.2vmin] max-sm:text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 mb-[1.5vmin]">
                  <span>{video.client}</span>
                  <span aria-hidden="true" className="opacity-40">·</span>
                  <span>{video.year}</span>
                </div>
                <h3 className="text-[3.5vmin] max-sm:text-2xl font-extralight tracking-[-0.03em] leading-[1.1] text-white font-zen">
                  {video.title}
                </h3>
              </div>
            </Inview>
          ))}
        </section>
        
        {filteredVideos.length === 0 && (
          <Inview mode="once" from={{ opacity: 0 }} to={{ opacity: 1 }} delayIn={200}>
            <div className="py-32 text-center text-white/50 font-zen text-lg">
              No work found matching your criteria.
            </div>
          </Inview>
        )}
      </div>
    </main>
    </>
  );
};
