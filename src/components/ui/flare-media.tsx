"use client";

import { useRef, useState } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import { GlassPlayButton } from "@/components/common/glass-play-button";

export interface FlareMediaProps {
  /** Omit to render an empty placeholder tile. */
  src?: string;
  label: string;
  meta: string;
  ratio?: "landscape" | "portrait";
  className?: string;
}

const GRAIN =
  "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')";

/**
 * Glass media tile with cursor-driven 3D tilt.
 * Shows a poster frame — no video autoplay. Play button opens the fullscreen modal.
 */
export const FlareMedia = ({ src, label, meta, ratio = "landscape", className }: FlareMediaProps) => {
  const [{ rx, ry, glow, lift }, api] = useSpring(() => ({
    rx: 0,
    ry: 0,
    glow: 0,
    lift: 0,
    config: { tension: 220, friction: 26 },
  }));

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    api.start({ rx: (0.5 - ny) * 10, ry: (nx - 0.5) * 12 });
  };

  const handleEnter = () => {
    api.start({ glow: 1, lift: 1 });
  };

  const handleLeave = () => {
    api.start({ rx: 0, ry: 0, glow: 0, lift: 0 });
  };

  const aspect = ratio === "portrait" ? "aspect-[9/16]" : "aspect-[16/10]";

  return (
    <animated.figure
      className={`group relative ${aspect} [perspective:1200px] ${className ?? ""}`}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={{ transform: lift.to((l) => `translateY(${l * -6}px)`) }}
    >
      <animated.div
        className="relative size-full overflow-hidden rounded-[2.5vmin] border border-white/10 bg-white/[0.03] [transform-style:preserve-3d]"
        style={{
          transform: to([rx, ry], (x, y) => `rotateX(${x}deg) rotateY(${y}deg)`),
          boxShadow: glow.to((g) => `0 ${18 + g * 26}px ${40 + g * 60}px rgba(0,0,0,${0.35 + g * 0.25})`),
        }}
      >
        {src ? (
          <>
            {/* Poster image — no video, no autoplay */}
            <img
              className="absolute inset-0 size-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none"
              src={src.replace(/\.(mp4|mov|webm)$/i, '.jpg').replace('/showreel/', '/posters/').replace('/all-content/', '/posters/')}
              alt={label}
              onError={(e) => {
                // Fallback if poster doesn't exist
                (e.target as HTMLImageElement).src = "/assets/posters/portfolio-1.jpg";
              }}
            />
            {/* Play button always visible when there's a video */}
            <GlassPlayButton videoSrc={src} />
          </>
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-[2vmin] rounded-[2vmin] border border-dashed border-white/15"
          />
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"
        />

        <figcaption className="absolute inset-x-0 bottom-0 p-5 sm:p-[3vmin]">
          <span className="block text-[10px] sm:text-xs font-medium uppercase tracking-widest text-white/55">
            {meta}
          </span>
          <span className="mt-2 block text-lg sm:text-[2.6vmin] font-extralight leading-tight tracking-[-0.02em] text-white">
            {label}
          </span>
        </figcaption>
      </animated.div>
    </animated.figure>
  );
};
