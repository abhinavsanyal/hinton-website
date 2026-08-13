"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { animated, to, useSpring } from "@react-spring/web";
import { Hover } from "@/components/animation/springs/hover";
import type { NavMenuItem } from "@/data/mocks/home";

export interface ServicesMenuProps {
  label: string;
  items: NavMenuItem[];
}

const ServicesMenuItem = ({ item, onNavigate }: { item: NavMenuItem; onNavigate: () => void }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <li>
      <Link
        ref={ref}
        href={item.href}
        onClick={onNavigate}
        className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
      >
        <Hover
          tag="span"
          trigger={ref as React.RefObject<HTMLElement>}
          from={{ backgroundColor: "rgba(255,255,255,0)", x: 0 }}
          to={{ backgroundColor: "rgba(255,255,255,0.09)", x: 4 }}
          config={{ tension: 320, friction: 26 }}
          className="flex flex-col gap-1 rounded-2xl px-4 py-3"
        >
          <span className="text-[14px] font-medium leading-none text-white">{item.label}</span>
          <span className="text-[12px] leading-snug text-white/50">{item.blurb}</span>
        </Hover>
      </Link>
    </li>
  );
};

/**
 * Glass dropdown for the primary nav. Opens on pointer-enter (desktop habit)
 * and on click/keyboard (the accessible path), so it works without a mouse.
 */
export const ServicesMenu = ({ label, items }: ServicesMenuProps) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const panelId = useId();

  const handlePointerEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handlePointerLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const panel = useSpring({
    opacity: open ? 1 : 0,
    y: open ? 0 : -10,
    scale: open ? 1 : 0.97,
    blur: open ? 0 : 8,
    config: { tension: 300, friction: 30 },
  });

  const chevron = useSpring({
    rotate: open ? 180 : 0,
    config: { tension: 300, friction: 22 },
  });

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className="relative flex"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-[44px] items-center gap-2 rounded-full px-6 text-[14px] font-medium text-white/90 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
      >
        {label}
        <animated.svg
          width="10"
          height="7"
          viewBox="0 0 10 7"
          aria-hidden="true"
          style={{ transform: chevron.rotate.to((r) => `rotate(${r}deg)`) }}
        >
          <path d="M1 1.5L5 5.5L9 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </animated.svg>
      </button>

      <animated.div
        id={panelId}
        className="absolute left-1/2 top-[calc(100%+0.75rem)] w-[320px] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/12 bg-black/70 p-2 shadow-[0_24px_64px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
        style={{
          opacity: panel.opacity,
          pointerEvents: open ? "auto" : "none",
          filter: panel.blur.to((b) => `blur(${b}px)`),
          transform: to([panel.y, panel.scale], (y, s) => `translateX(-50%) translateY(${y}px) scale(${s})`),
        }}
      >
        {/* Specular top edge — the tell that makes the panel read as glass. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <ServicesMenuItem key={item.href} item={item} onNavigate={() => setOpen(false)} />
          ))}
        </ul>
      </animated.div>
    </div>
  );
};
