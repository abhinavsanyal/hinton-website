"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getCalApi } from "@calcom/embed-react";
import { Hover } from "@/components/animation/springs/hover";
import { Inview } from "@/components/animation/springs/in-view";

export interface ServiceCtaProps {
  heading: string;
  headingFaded: string;
  sub: string;
  book: { label: string };
  work: { label: string; href: string };
}

/** The two CTAs every service page closes on: book a call, or go see the work. */
export const ServiceCta = ({ heading, headingFaded, sub, book, work }: ServiceCtaProps) => {
  const bookRef = useRef<HTMLButtonElement>(null);
  const workRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi();
      cal("ui", { styles: { branding: { brandColor: "#000000" } }, hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <section aria-labelledby="service-cta" className="relative z-[2] bg-background px-[6vmin] pb-[16vmin]">
      <Inview
        mode="once"
        from={{ opacity: 0, y: 50 }}
        to={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-[1400px] overflow-hidden rounded-card border border-white/10 bg-white/[0.03] p-[8vmin] max-sm:p-8 backdrop-blur-sm"
      >
        <h2
          id="service-cta"
          className="font-zen text-[6vw] max-sm:text-4xl font-extralight leading-[0.98] tracking-[-0.04em] text-white"
        >
          {heading}
          <span className="block opacity-40">{headingFaded}</span>
        </h2>

        <p className="mt-[3vmin] max-w-[60ch] text-[1.9vmin] max-sm:text-sm leading-relaxed text-white/60">{sub}</p>

        <div className="mt-[5vmin] flex flex-wrap items-center gap-[2vmin] max-sm:gap-3">
          <button
            ref={bookRef}
            type="button"
            data-cal-link="abhinava-sanyal-jdq1dz/30min"
            data-cal-config='{"layout":"month_view"}'
            className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <Hover
              tag="span"
              trigger={bookRef as React.RefObject<HTMLElement>}
              from={{ scale: 1 }}
              to={{ scale: 1.04 }}
              config={{ tension: 320, friction: 22 }}
              className="flex h-[52px] items-center rounded-full bg-white px-8 text-[15px] font-semibold text-black"
            >
              {book.label}
            </Hover>
          </button>

          <Link
            ref={workRef}
            href={work.href}
            className="rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <Hover
              tag="span"
              trigger={workRef as React.RefObject<HTMLElement>}
              from={{ backgroundColor: "rgba(255,255,255,0.08)", scale: 1 }}
              to={{ backgroundColor: "rgba(255,255,255,0.18)", scale: 1.04 }}
              config={{ tension: 320, friction: 22 }}
              className="flex h-[52px] items-center rounded-full border border-white/20 px-8 text-[15px] font-semibold text-white backdrop-blur-md"
            >
              {work.label}
            </Hover>
          </Link>
        </div>
      </Inview>
    </section>
  );
};
