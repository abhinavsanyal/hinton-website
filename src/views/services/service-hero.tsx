"use client";

import { useRef } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import { ProgressTrigger } from "@/components/animation/springs/progress-trigger";
import { FlameBackground } from "@/components/3d/flame-background";

export interface ServiceHeroProps {
  eyebrow: string;
  headingLines: string[];
  lede: string;
  /** Labels printed on the plates the camera flies through. */
  plates: string[];
}

/** Where each plate starts in Z, so they arrive at the camera in sequence. */
const PLATE_DEPTH = [-1500, -2400, -3300, -4200];
const PLATE_OFFSET = [
  { x: -26, y: -14 },
  { x: 24, y: 12 },
  { x: -18, y: 16 },
  { x: 22, y: -18 },
];

/**
 * The service-page opening: a pinned stage where a CSS 3D camera flies forward
 * through a field of glass plates while the headline recedes. Same technique as
 * the home Showreel — one `ProgressTrigger` scrubbing one spring, every value a
 * pure function of `p`.
 */
export const ServiceHero = ({ eyebrow, headingLines, lede, plates }: ServiceHeroProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [{ p }, api] = useSpring(() => ({ p: 0 }));

  const headingOpacity = p.to([0, 0.45, 0.7], [1, 1, 0]);
  const copyOpacity = p.to([0, 0.25, 0.5], [1, 1, 0]);

  return (
    <div ref={trackRef} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <FlameBackground className="pointer-events-none absolute inset-0 z-0 opacity-40" />

        <div className="absolute inset-0 z-[1] [perspective:1400px]">
          <animated.div
            className="relative size-full [transform-style:preserve-3d]"
            style={{ transform: p.to((v) => `translateZ(${v * 1200}px)`) }}
          >
            {plates.map((plate, i) => (
              <animated.span
                key={plate}
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-[34vmin] w-[52vmin] items-end rounded-card border border-white/12 bg-white/[0.04] p-[3vmin] text-[1.6vmin] font-medium uppercase tracking-[0.2em] text-white/45 backdrop-blur-sm"
                style={{
                  transform: p.to(
                    (v) =>
                      `translate(-50%, -50%) translate3d(${PLATE_OFFSET[i % 4].x}vmin, ${PLATE_OFFSET[i % 4].y}vmin, ${PLATE_DEPTH[i % 4] + v * 3400}px)`,
                  ),
                  opacity: p.to([0, 0.1, 0.85, 1], [0, 0.9, 0.9, 0]),
                }}
              >
                {plate}
              </animated.span>
            ))}
          </animated.div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[2] flex flex-col items-center justify-center px-[6vmin] text-center">
          <animated.p
            className="mb-[3vmin] text-[1.4vmin] max-sm:text-[10px] font-medium uppercase tracking-[0.28em] text-white/55"
            style={{ opacity: copyOpacity }}
          >
            {eyebrow}
          </animated.p>

          <animated.h1
            className="font-zen text-[9vw] max-sm:text-[13vw] font-extralight leading-[0.92] tracking-[-0.04em] text-white"
            style={{
              opacity: headingOpacity,
              transform: to([p], (v) => `translateZ(0) scale(${1 - v * 0.12}) translateY(${v * -6}vmin)`),
              filter: p.to((v) => `blur(${v * 6}px)`),
            }}
          >
            {headingLines.map((line, i) => (
              <span key={line} className={`block ${i > 0 ? "opacity-40" : ""}`}>
                {line}
              </span>
            ))}
          </animated.h1>

          <animated.p
            className="mt-[4vmin] max-w-[80ch] text-[1.9vmin] max-sm:text-sm leading-relaxed text-white/65"
            style={{ opacity: copyOpacity }}
          >
            {lede}
          </animated.p>
        </div>
      </div>

      <ProgressTrigger
        tag="span"
        trigger={trackRef as React.RefObject<HTMLElement>}
        start="top top"
        end="bottom bottom"
        className="hidden"
        frameInterval={0}
        onChange={({ progress }) => api.start({ p: progress, immediate: true })}
      />
    </div>
  );
};
