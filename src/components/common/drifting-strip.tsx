"use client";
import { animated, easings, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function DriftingStrip({ children, label, direction = "left", speed = 20, className = "" }: {
  children: ReactNode; label: string; direction?: "left" | "right"; speed?: number; className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    motion(); visibility();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const intersection = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    const resize = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    if (root.current) intersection.observe(root.current);
    if (group.current) resize.observe(group.current);
    return () => { media.removeEventListener("change", motion); document.removeEventListener("visibilitychange", visibility); intersection.disconnect(); resize.disconnect(); };
  }, []);
  const styles = useSpring({
    from: { x: direction === "left" ? 0 : -50 }, to: { x: direction === "left" ? -50 : 0 }, loop: true,
    pause: paused || hovered || focused || !active || !visible || reduced || !width,
    config: { duration: Math.max(width, 1) / speed * 1000, easing: easings.linear },
  });
  return <div ref={root} className={`drifting-strip ${className}`} role="region" aria-label={label}
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <div className="drifting-window" tabIndex={0} aria-label={`${label}; horizontal strip`}>
      <animated.div className="drifting-track" style={{ transform: styles.x.to(x => `translateX(${x}%)`) }}>
        <div ref={group} className="drifting-group">{children}</div>
        <div className="drifting-group drifting-copy" aria-hidden="true">{children}</div>
      </animated.div>
    </div>
    <button type="button" className="drifting-toggle" aria-pressed={paused} aria-label={`${paused ? "Resume" : "Pause"} ${label.toLowerCase()}`} onClick={() => setPaused(p => !p)}>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">{paused ? <path d="m8 5 11 7-11 7Z"/> : <path d="M7 5h3v14H7zm7 0h3v14h-3z"/>}</svg>
    </button>
  </div>;
}
