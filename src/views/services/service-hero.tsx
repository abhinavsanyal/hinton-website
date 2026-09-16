"use client";

import { Inview } from "@/components/animation/springs/in-view";

export interface ServiceHeroProps {
  eyebrow: string;
  headingLines: string[];
  lede: string;
  /** Labels shown as tag pills below the heading. */
  plates: string[];
}

/**
 * Service page hero — clean, bold headline with a red accent underline.
 * No 3D, no scroll-driven animation, no FlameBackground.
 * Just typography and presence.
 */
export const ServiceHero = ({ eyebrow, headingLines, lede, plates }: ServiceHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-black pt-[22vmin] max-sm:pt-32 pb-16 sm:pb-[10vmin] px-6 sm:px-[6vmin]">
      {/* Subtle red gradient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 80%, rgba(225,29,72,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
          <p className="mb-6 text-xs sm:text-[1.4vmin] font-medium uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </p>
        </Inview>

        <Inview mode="once" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} delayIn={100}>
          <h1 className="font-zen text-[13vw] sm:text-[9vw] font-extralight leading-[0.92] tracking-[-0.04em] text-white">
            {headingLines.map((line, i) => (
              <span key={line} className={`block ${i > 0 ? "text-white/40" : ""}`}>
                {line}
              </span>
            ))}
          </h1>
        </Inview>

        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} delayIn={200}>
          <p className="mt-6 sm:mt-[4vmin] max-w-[80ch] text-sm sm:text-base leading-relaxed text-white/65">
            {lede}
          </p>
        </Inview>

        {/* Deliverable pills */}
        {plates.length > 0 && (
          <Inview mode="once" from={{ opacity: 0, y: 20 }} to={{ opacity: 1, y: 0 }} delayIn={350}>
            <div className="mt-8 sm:mt-[5vmin] flex flex-wrap gap-3">
              {plates.map((plate) => (
                <span
                  key={plate}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-white/50"
                >
                  {plate}
                </span>
              ))}
            </div>
          </Inview>
        )}
      </div>

      {/* Red accent line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </section>
  );
};
