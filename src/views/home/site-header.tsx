"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";
import { animated, easings, useSpring } from "@react-spring/web";
import { Hover } from "@/components/animation/springs/hover";
import { useLoaderStore } from "@/hooks/use-loader";
import { ServicesMenu } from "@/views/home/services-menu";
import type { NavLink } from "@/data/mocks/home";

export interface SiteHeaderProps {
  nav: NavLink[];
  logo: string;
  cta?: { label: string; href: string };
  /**
   * The bar fades in on `useLoaderStore.revealed`, which only the home page's
   * IntroLoader flips. Pages without the loader pass `false` to show it at once.
   */
  awaitLoader?: boolean;
}

export const SiteHeader = ({ nav, logo, cta, awaitLoader = true }: SiteHeaderProps) => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", { styles: { branding: { brandColor: "#000000" } }, hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  const loaderRevealed = useLoaderStore((s) => s.revealed);
  const revealed = awaitLoader ? loaderRevealed : true;
  const reveal = useSpring({
    opacity: revealed ? 1 : 0,
    y: revealed ? 0 : -10,
    config: { duration: 700, easing: easings.easeInOutCubic },
  });

  // Section anchors only resolve on the home page, so off-home they need the
  // route prefix to jump back rather than dead-linking to the current document.
  const isHome = usePathname() === "/";
  const anchor = (href: string) => (isHome || !href.startsWith("#") ? href : `/${href}`);

  const [open, setOpen] = useState(false);
  const menu = useSpring({
    opacity: open ? 1 : 0,
    y: open ? 0 : -8,
    config: { tension: 260, friction: 26 },
  });

  return (
    <header className="pointer-events-none fixed left-0 top-[3vmin] z-[100] flex w-full flex-col items-center">
      <div className="flex items-center gap-3">
        <animated.nav
          className="pointer-events-auto flex items-stretch gap-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15 p-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          style={{
            opacity: reveal.opacity,
            transform: reveal.y.to((y) => `translateY(${y}px)`),
          }}
        >
          <a
            href={isHome ? "#" : "/"}
            aria-label="Home"
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition-colors"
          >
            <Hover
              tag="span"
              from={{ transform: "rotate(0deg)" }}
              to={{ transform: "rotate(90deg)" }}
              config={{ tension: 200, friction: 18 }}
              className="flex items-center justify-center"
            >
              {/* Kept brightness-0 invert so logo is white (if original was dark, or just white if original was white) */}
              <Image src={logo} alt="Hinton Studios" width={100} height={100} priority className="brightness-0 invert" />
            </Hover>
          </a>

          {/* Inline link row */}
          <ul className="hidden items-stretch gap-1 sm:flex">
            {nav.map((link) =>
              link.menu ? (
                <li key={link.label} className="flex">
                  <ServicesMenu label={link.label} items={link.menu} />
                </li>
              ) : (
                <li key={link.label} className="flex">
                  <a
                    href={anchor(link.href)}
                    className="flex h-[44px] items-center px-6 rounded-full bg-transparent hover:bg-white/10 transition-colors"
                  >
                    <Hover
                      tag="span"
                      from={{ y: 2 }}
                      to={{ y: 0 }}
                      config={{ tension: 300, friction: 20 }}
                      className="block text-[14px] font-medium text-white/90"
                    >
                      {link.label}
                    </Hover>
                  </a>
                </li>
              ),
            )}
          </ul>

          {/* Menu toggle — phones only */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition-colors sm:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true" className="text-white">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              ) : (
                <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              )}
            </svg>
          </button>

          {cta && (
            <button
              data-cal-link="abhinava-sanyal-jdq1dz/30min"
              data-cal-config='{"layout":"month_view"}'
              className="flex h-[44px] items-center justify-center rounded-full bg-white px-6 text-[14px] font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              {cta.label}
            </button>
          )}
        </animated.nav>

        {/* WhatsApp Button */}
        <animated.a
          href="https://wa.me/919330226381"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex size-[52px] items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300 hover:bg-[#25D366] hover:border-[#25D366] hover:scale-105 group"
          aria-label="Chat on WhatsApp"
          style={{
            opacity: reveal.opacity,
            transform: reveal.y.to((y) => `translateY(${y}px)`),
          }}
        >
          <svg className="size-[22px] text-white transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </animated.a>
      </div>

      {/* Mobile dropdown */}
      <animated.div
        className="pointer-events-none mt-3 w-[calc(100%-8vmin)] max-w-[420px] overflow-hidden rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 p-2 sm:hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)]"
        style={{
          opacity: menu.opacity,
          transform: menu.y.to((y) => `translateY(${y}px)`),
        }}
      >
        <ul className={`flex flex-col gap-1 ${open ? "pointer-events-auto" : ""}`}>
          {nav.map((link) => (
            <li key={link.label} className="flex flex-col">
              <a
                href={anchor(link.href)}
                onClick={() => setOpen(false)}
                className="flex h-[48px] w-full items-center px-6 rounded-xl bg-transparent hover:bg-white/10 transition-colors text-[16px] font-medium text-white/90"
              >
                {link.label}
              </a>
              {link.menu && (
                <ul className="mb-1 flex flex-col border-l border-white/10 pl-3 ml-6">
                  {link.menu.map((item) => (
                    <li key={item.href} className="flex">
                      <a
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex h-[42px] w-full items-center px-3 rounded-xl bg-transparent hover:bg-white/10 transition-colors text-[14px] text-white/70"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </animated.div>
    </header>
  );
};
