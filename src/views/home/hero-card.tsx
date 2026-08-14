"use client";

import { memo, useRef } from "react";
import { animated, type SpringValue } from "@react-spring/web";

import { useUIStore } from "@/store/use-ui-store";
import { ScrollLetters } from "@/views/home/scroll-letters";
import { RotatingBullets } from "@/views/home/rotating-bullets";
import {
  heroLetterStyle,
  templatesLetterStyle,
  heroContentFade,
} from "@/utils/showreel/timeline";

export interface HeroCardProps {
  p: SpringValue<number>;
  lines: string[];
  heroSubline?: string;
  templatesTitle: string;
  images: { stone: string; rotated: string };
  bottomBlock?: {
    leftText: string;
    features?: string[];
    rightTextBullets?: string[];
    avatars?: string[];
  };
  active?: boolean;
}

import { publicEnv } from "@/env";

const MEDIA_BASE = publicEnv.NEXT_PUBLIC_MEDIA_URL 
  ? publicEnv.NEXT_PUBLIC_MEDIA_URL.replace(/\/$/, "") 
  : "/assets";

/** All 6 portfolio videos for the reel carousel. */
const REEL_VIDEOS = [
  `${MEDIA_BASE}/showreel/portfolio-1.mp4`,
  `${MEDIA_BASE}/showreel/portfolio-2.mp4`,
  `${MEDIA_BASE}/showreel/portfolio-3.mp4`,
  `${MEDIA_BASE}/showreel/portfolio-4.mp4`,
  `${MEDIA_BASE}/showreel/portfolio-5.mp4`,
  `${MEDIA_BASE}/showreel/portfolio-6.mp4`,
];

export const HeroCard = memo(({ p, lines, heroSubline, templatesTitle, bottomBlock, active = true }: HeroCardProps) => {
  return (
    <div className="relative size-full overflow-hidden rounded-card bg-black">

      {/* ═══ DIAGONAL SPLIT-SCREEN CAROUSEL ═══
          6 videos arranged as diagonal strips, slowly scrolling L→R via CSS
          animation. Each strip is a skewed container with a counter-skewed
          video inside. No hard borders — each strip has blurred edges. */}
      {active && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Slow continuous scroll animation */}
          <div
            className="absolute flex h-full"
            style={{
              width: "1200vw",
              animation: "heroReelScroll 400s linear infinite",
              transform: "skewX(-12deg)",
              left: "-30vh",
            }}
          >
            {/* Render videos twice (for seamless loop) */}
            {[...REEL_VIDEOS, ...REEL_VIDEOS].map((src, i) => (
              <div
                key={i}
                className="relative h-full shrink-0 overflow-hidden group"
                style={{ width: "100vw" }}
              >
                <video
                  className="absolute inset-0 size-full object-cover [transform:skewX(12deg)_scale(1.1)] pointer-events-none"
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                />

                {/* Soft blurred edges between strips (left and right fade) */}
                <div
                  className="absolute inset-y-0 left-0 w-[15%] pointer-events-none"
                  style={{ background: "linear-gradient(to right, rgba(0,0,0,0.7), transparent)" }}
                />
                <div
                  className="absolute inset-y-0 right-0 w-[15%] pointer-events-none"
                  style={{ background: "linear-gradient(to left, rgba(0,0,0,0.7), transparent)" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ LOWER-LEFT DIAGONAL DARK OVERLAY ═══ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "linear-gradient(38deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.97) 20%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.08) 70%, transparent 85%)",
        }}
      />

      {/* Subtle fine film grain — high frequency, low opacity */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none opacity-15 mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ═══ 3D SPOTLIGHT EFFECTS ═══ */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {/* Top-center spotlight — far above, casting down */}
        <div
          className="absolute top-[-30%] left-[30%] w-[60%] h-[80%]"
          style={{
            background: "radial-gradient(ellipse 50% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)",
          }}
        />
        {/* Back-right warm spotlight — very far, subtle */}
        <div
          className="absolute top-[-10%] right-[-5%] w-[50%] h-[60%]"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,200,150,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* ═══ HEADLINE — bottom-left, massive and cinematic ═══ */}
      <animated.header
        className="absolute bottom-0 left-0 z-50 flex flex-col justify-end p-[6vmin] max-sm:p-6 w-[70%] max-sm:w-full"
        style={{ opacity: p.to(heroContentFade) }}
      >
        <h1 className="pointer-events-none flex flex-col items-start text-left leading-[0.9] text-white">
          {lines.map((line, i) => (
            <span
              key={i}
              className={`block ${
                i === 0 
                  ? "text-[12vw] max-sm:text-[14vw] font-normal tracking-[-0.03em]" 
                  : "text-[7.5vw] max-sm:text-[9vw] font-light italic opacity-80 tracking-[-0.01em] mt-2"
              }`}
            >
              <ScrollLetters 
                text={line} 
                p={p} 
                styleFn={heroLetterStyle} 
                letterClassName={
                  i === 0 && line === "AI films"
                    ? (ch, idx) => {
                        let classes = "";
                        if (idx === 3) classes += " [text-shadow:0_0_10px_rgba(255,255,255,0.2)] ";
                        if (idx === 4) classes += " [text-shadow:0_0_15px_rgba(255,255,255,0.4)] ";
                        if (idx === 5) classes += " [text-shadow:0_0_20px_rgba(255,255,255,0.6)] ";
                        // Restored sharpness to the 'S' body
                        if (idx === 6) classes += " [text-shadow:0_0_30px_rgba(255,255,255,0.8)] ";
                        return classes;
                      }
                    : undefined
                }
                renderAddon={
                  i === 0 && line === "AI films"
                    ? (ch, idx) => {
                        // idx 6 is the letter 's'
                        if (idx === 6) {
                          return (
                            <>
                              {/* Cinematic Halation and Lens Blur on the top of the 'S' */}
                              <div 
                                className="absolute pointer-events-none mix-blend-screen"
                                style={{
                                  width: "0.5em",
                                  height: "0.5em",
                                  left: "50%",
                                  top: "40%",
                                  transform: "translate(-50%, -50%)",
                                  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,200,180,0.5) 25%, rgba(255,50,0,0.15) 45%, transparent 65%)",
                                  backdropFilter: "blur(12px)",
                                  WebkitBackdropFilter: "blur(12px)",
                                  maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
                                  WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
                                  zIndex: 5
                                }}
                              />
                            </>
                          );
                        }
                        return null;
                      }
                    : i === 1 && line === "when Directed"
                    ? (ch, idx) => {
                        // idx 8 is the letter 'c' in "when Directed"
                        if (idx === 8) {
                          return (
                            <div 
                              className="absolute top-1/2 left-1/2 pointer-events-none rounded-full"
                              style={{
                                width: "3.5em",
                                height: "3.5em",
                                transform: "translate(-50%, -50%)",
                                backdropFilter: "blur(4px) saturate(1.5) contrast(1.2)",
                                WebkitBackdropFilter: "blur(4px) saturate(1.5) contrast(1.2)",
                                zIndex: 10
                              }}
                            />
                          );
                        }
                        return null;
                      }
                    : undefined
                }
              />
              {i == 1 && (
                <span className="inline-block relative text-red-500 ml-2" style={{ animation: "spiderverseGlitch 4s infinite" }}>
                  .
                  <span className="absolute inset-0 opacity-75 text-red-500" style={{ animation: "spiderverseGlitch 4s infinite reverse" }}>
                    .
                  </span>
                </span>
              )}
            </span>
          ))}
        </h1> 

        {heroSubline && (
          <p className="pointer-events-none mt-[4vmin] max-w-[600px] text-[1.8vmin] max-sm:text-[14px] font-medium leading-[1.6] text-white opacity-90 drop-shadow-md whitespace-pre-line">
            {heroSubline}
          </p>
        )}

        <div className="relative z-[9999] mt-[4vmin] flex items-center gap-[2.5vmin] max-sm:gap-4 pointer-events-auto">
          <a href="/work" className="relative z-[9999] pointer-events-auto inline-flex items-center justify-center px-[3.5vmin] py-[1.8vmin] max-sm:px-6 max-sm:py-3.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[1.4vmin] max-sm:text-[12px] uppercase tracking-widest font-medium leading-none text-white/90 transition-all hover:bg-white/20 hover:border-white/40 cursor-pointer">
            Our Work
          </a>
          <button 
            data-cal-link="abhinava-sanyal-jdq1dz/30min"
            data-cal-config='{"layout":"month_view"}'
            className="relative z-[9999] pointer-events-auto inline-flex items-center justify-center px-[3.5vmin] py-[1.8vmin] max-sm:px-6 max-sm:py-3.5 rounded-full bg-white text-black font-semibold uppercase tracking-widest text-[1.4vmin] max-sm:text-[12px] leading-none transition-transform hover:scale-105 cursor-pointer"
          >
            Book a call
          </button>
        </div>
      </animated.header>

      {/* Bottom-right meta */}
      {bottomBlock && bottomBlock.rightTextBullets && (
        <animated.div
          className="pointer-events-none absolute bottom-[4vmin] right-[4vmin] z-[3] text-right max-sm:hidden w-[280px]"
          style={{ opacity: p.to(heroContentFade) }}
        >
          {/* Black overlay fading gradient behind the text for contrast */}
          <div className="absolute inset-[-4vmin] -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6)_0%,transparent_70%)] blur-md rounded-full pointer-events-none" />
          
          <RotatingBullets bullets={bottomBlock.rightTextBullets} />
        </animated.div>
      )}

      {/* "Explore our showreel" — visible when card rotates in carousel */}
      <div className="pointer-events-none absolute inset-0 z-[7] flex items-center justify-center">
        <h2 className="text-center text-[4vmin] font-light leading-tight text-white drop-shadow-xl [transform:rotate(-90deg)]">
          <ScrollLetters text={templatesTitle} p={p} styleFn={(prog, i) => templatesLetterStyle(prog, i)} />
        </h2>
      </div>

      {/* CSS animation for the reel scroll and Thanos wither */}
      <style>{`
        @keyframes heroReelScroll {
          0% { transform: skewX(-12deg) translateX(0); }
          100% { transform: skewX(-12deg) translateX(-50%); }
        }
        @keyframes spiderverseGlitch {
          0%, 100% { opacity: 1; transform: translate(0); filter: drop-shadow(0 0 15px rgba(239,68,68,0.8)); }
          5% { transform: translate(-2px, 1px); filter: drop-shadow(-3px 0 0 rgba(0, 255, 255, 0.7)) drop-shadow(3px 0 0 rgba(255, 0, 255, 0.7)); opacity: 0.8; }
          10% { transform: translate(2px, -1px); filter: drop-shadow(0 0 15px rgba(239,68,68,0.8)); opacity: 1; }
          15% { opacity: 0.3; transform: scale(1.2); }
          18% { opacity: 1; transform: scale(1); }
          50% { transform: translate(0); }
          52% { transform: translate(-3px, -2px) skewX(-10deg); filter: drop-shadow(2px 2px 0 cyan) drop-shadow(-2px -2px 0 red); }
          55% { transform: translate(0) skewX(0); filter: drop-shadow(0 0 15px rgba(239,68,68,0.8)); }
        }
      `}</style>
    </div>
  );
});
HeroCard.displayName = "HeroCard";
