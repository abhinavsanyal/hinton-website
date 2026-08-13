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
 * Glass media tile with a cursor-driven 3D tilt and an anamorphic lens flare
 * that tracks the pointer. The clip only downloads and plays while hovered, so
 * a grid of these costs nothing until the visitor reaches for one.
 */
export const FlareMedia = ({ src, label, meta, ratio = "landscape", className }: FlareMediaProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  const [{ rx, ry, fx, fy, glow, lift }, api] = useSpring(() => ({
    rx: 0,
    ry: 0,
    fx: 0.5,
    fy: 0.5,
    glow: 0,
    lift: 0,
    config: { tension: 220, friction: 26 },
  }));

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    api.start({ rx: (0.5 - ny) * 10, ry: (nx - 0.5) * 12, fx: nx, fy: ny });
  };

  const handleEnter = () => {
    setHovered(true);
    api.start({ glow: 1, lift: 1 });
    videoRef.current?.play().catch(() => undefined);
  };

  const handleLeave = () => {
    setHovered(false);
    api.start({ rx: 0, ry: 0, fx: 0.5, fy: 0.5, glow: 0, lift: 0 });
    videoRef.current?.pause();
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
        className="relative size-full overflow-hidden rounded-card border border-white/10 bg-white/[0.03] [transform-style:preserve-3d]"
        style={{
          transform: to([rx, ry], (x, y) => `rotateX(${x}deg) rotateY(${y}deg)`),
          boxShadow: glow.to((g) => `0 ${18 + g * 26}px ${40 + g * 60}px rgba(0,0,0,${0.35 + g * 0.25})`),
        }}
      >
        {src ? (
          <video
            ref={videoRef}
            className="absolute inset-0 size-full object-cover opacity-70"
            src={src}
            loop
            muted
            playsInline
            preload="none"
            aria-label={label}
          />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-[2vmin] rounded-pf border border-dashed border-white/15"
          />
        )}

        {/* Anamorphic streak — a wide, thin, screen-blended bar tracking the cursor. */}
        <animated.span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-[14%] w-full mix-blend-screen blur-2xl"
          style={{
            opacity: glow.to((g) => g * 0.85),
            top: fy.to((y) => `${y * 100}%`),
            background: to(
              [fx],
              (x) =>
                `linear-gradient(90deg, transparent 0%, rgba(90,140,255,0.05) ${x * 100 - 34}%, rgba(150,190,255,0.75) ${x * 100}%, rgba(90,140,255,0.05) ${x * 100 + 34}%, transparent 100%)`,
            ),
            transform: to([glow], (g) => `translateY(-50%) scaleX(${0.5 + g * 0.5})`),
          }}
        />

        {/* Flare core + a warm secondary ghost mirrored through the centre. */}
        <animated.span
          aria-hidden="true"
          className="pointer-events-none absolute size-[26%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-2xl"
          style={{
            opacity: glow.to((g) => g * 0.7),
            left: fx.to((x) => `${x * 100}%`),
            top: fy.to((y) => `${y * 100}%`),
            background: "radial-gradient(circle, rgba(190,215,255,0.9) 0%, rgba(120,90,255,0.25) 45%, transparent 70%)",
          }}
        />
        <animated.span
          aria-hidden="true"
          className="pointer-events-none absolute size-[16%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen blur-xl"
          style={{
            opacity: glow.to((g) => g * 0.45),
            left: fx.to((x) => `${(1 - x) * 100}%`),
            top: fy.to((y) => `${(1 - y) * 100}%`),
            background: "radial-gradient(circle, rgba(255,180,120,0.8) 0%, transparent 70%)",
          }}
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN, backgroundSize: "256px 256px" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"
        />

        {src && hovered && <GlassPlayButton videoSrc={src} />}

        <figcaption className="absolute inset-x-0 bottom-0 p-[3vmin] max-sm:p-5">
          <span className="block text-[1.1vmin] max-sm:text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
            {meta}
          </span>
          <span className="mt-[1vmin] block text-[2.6vmin] max-sm:text-lg font-extralight leading-tight tracking-[-0.02em] text-white">
            {label}
          </span>
        </figcaption>
      </animated.div>
    </animated.figure>
  );
};
