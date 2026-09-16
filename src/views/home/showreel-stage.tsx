"use client";

import { Inview } from "@/components/animation/springs/in-view";
import { GlassPlayButton } from "@/components/common/glass-play-button";
import { Marquee } from "@/views/home/marquee";
import type { ShowreelContent } from "@/data/mocks/home";
import { publicEnv } from "@/env";

const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "")
  : "/assets";

export interface ShowreelStageProps {
  content: ShowreelContent;
}

/**
 * Flat, fast home page — replaces the scroll-driven 3D showreel.
 * Four clean sections: Hero → Services Marquee → Portfolio → CTA.
 * Zero WebGL, zero autoplay videos, zero scroll-hijacking.
 */
export const ShowreelStage = ({ content }: ShowreelStageProps) => {
  return (
    <>
      {/* ═══════════ SECTION 1 — HERO ═══════════ */}
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black">
        {/* Background poster image */}
        <div className="absolute inset-0 z-0">
          <img
            className="size-full object-cover opacity-50 pointer-events-none"
            src="/assets/posters/portfolio-1.jpg"
            alt=""
          />
          {/* Cinematic gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(38deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 25%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 70%, transparent 90%)",
            }}
          />
        </div>

        {/* Hero content — bottom-left, massive heading */}
        <div className="relative z-10 flex flex-col gap-6 p-8 pb-16 sm:p-[6vmin] sm:pb-[8vmin] max-w-[900px]">
          <Inview mode="once" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }}>
            <h1 className="flex flex-col items-start text-left leading-[0.9] text-white">
              <span className="block text-[14vw] sm:text-[12vw] font-normal tracking-[-0.03em]">
                AI films
              </span>
              <span className="block text-[9vw] sm:text-[7.5vw] font-light italic opacity-80 tracking-[-0.01em] mt-2">
                when Directed
                <span className="inline-block relative text-accent ml-2">.</span>
              </span>
            </h1>
          </Inview>

          <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} delayIn={200}>
            <p className="max-w-[600px] text-sm sm:text-base font-medium leading-relaxed text-white/80">
              {content.heroSubline}
            </p>
          </Inview>

          <Inview mode="once" from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }} delayIn={400}>
            <div className="flex items-center gap-4">
              <a
                href="/work"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs uppercase tracking-widest font-medium text-white/90 transition-all hover:bg-white/20 hover:border-white/40"
              >
                Our Work
              </a>
              <button
                data-cal-link="abhinava-sanyal-jdq1dz/30min"
                data-cal-config='{"layout":"month_view"}'
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-accent text-white font-semibold uppercase tracking-widest text-xs transition-transform hover:scale-105 cursor-pointer"
              >
                Book a call
              </button>
            </div>
          </Inview>
        </div>
      </section>

      {/* ═══════════ SECTION 2 — SERVICES MARQUEE ═══════════ */}
      <section className="relative z-10 bg-white py-8 sm:py-12 overflow-hidden">
        <Marquee items={content.marquee} />
      </section>

      {/* ═══════════ SECTION 3 — PORTFOLIO ═══════════ */}
      <section className="bg-black py-16 sm:py-[10vmin] px-6 sm:px-[6vmin]">
        <div className="max-w-[1400px] mx-auto">
          <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
            <h2 className="text-[8vw] sm:text-[5vw] font-extralight tracking-[-0.03em] leading-[0.95] text-white mb-8 sm:mb-[6vmin]">
              Selected <span className="italic font-light text-white/40">Work</span>
            </h2>
          </Inview>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex gap-5 overflow-x-auto pb-6 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-[3vmin] scrollbar-none snap-x snap-mandatory">
            {content.portfolio.items.map((item, idx) => (
              <Inview
                key={item.title}
                mode="once"
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                delayIn={idx * 150}
                className="relative flex shrink-0 w-[85vw] sm:w-auto flex-col justify-end overflow-hidden rounded-[2.5vmin] bg-white/5 aspect-[4/5] border border-white/5 snap-center group"
              >
                {/* Poster image — no video autoplay */}
                <img
                  className="absolute inset-0 z-0 size-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105 pointer-events-none"
                  src={item.poster || "/assets/posters/portfolio-1.jpg"}
                  alt={item.title}
                />

                {/* Play button */}
                <GlassPlayButton videoSrc={item.video} />

                {/* Grain */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
                    backgroundSize: "256px 256px",
                  }}
                />
                {/* Gradient */}
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 pointer-events-none" />

                {/* Meta */}
                <div className="relative z-[2] p-6 sm:p-[4vmin] pointer-events-none">
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-white/60 mb-3">
                    <span>{item.client}</span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span>{item.year}</span>
                  </div>
                  <h3 className="text-2xl sm:text-[3.5vmin] font-extralight tracking-[-0.03em] leading-[1.1] text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/50 mt-1">{item.discipline}</p>
                </div>
              </Inview>
            ))}
          </div>

          {/* View all work link */}
          <Inview mode="once" from={{ opacity: 0 }} to={{ opacity: 1 }} delayIn={500}>
            <div className="mt-8 sm:mt-[4vmin] flex justify-center">
              <a
                href="/work"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-white/15 text-sm uppercase tracking-widest text-white/80 transition-all hover:bg-white/10 hover:border-white/30"
              >
                View all work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </Inview>
        </div>
      </section>

      {/* ═══════════ SECTION 4 — CTA ═══════════ */}
      <section className="relative overflow-hidden bg-black py-20 sm:py-[14vmin] px-6 sm:px-[6vmin]">
        {/* Red gradient glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 60%, rgba(225,29,72,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 30%, rgba(225,29,72,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <Inview mode="once" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }}>
            <h2 className="flex flex-col items-start text-[10vw] sm:text-[7vw] font-normal leading-[0.95] tracking-[-0.03em] text-white">
              <span>{content.cta.heading}</span>
              <span className="text-white/40">{content.cta.headingFaded}</span>
            </h2>
          </Inview>

          <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} delayIn={200}>
            <p className="mt-6 sm:mt-[3vmin] max-w-[500px] text-sm sm:text-base leading-relaxed text-white/60">
              {content.cta.sub}
            </p>
          </Inview>

          <Inview mode="once" from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }} delayIn={400}>
            <div className="mt-8 sm:mt-[4vmin] flex flex-wrap items-center gap-4">
              <a
                href={content.cta.href}
                className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-semibold uppercase tracking-widest text-white transition-transform hover:scale-105"
              >
                {content.cta.button}
              </a>
              <a
                href="/work"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm uppercase tracking-widest text-white/80 transition-all hover:bg-white/10 hover:border-white/30"
              >
                View our work
              </a>
            </div>
          </Inview>
        </div>
      </section>
    </>
  );
};
