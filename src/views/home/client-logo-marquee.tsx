"use client";

import { animated, easings, useSpring } from "@react-spring/web";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clients } from "@/data/clients";

/** A slow, decorative loop with an accessible static alternative. */
export function ClientLogoMarquee() {
  const section = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (section.current) observer.observe(section.current);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, []);
  const styles = useSpring({
    from: { x: 0 }, to: { x: -50 }, loop: true,
    pause: paused || hovered || focused || !active || !visible || reduced,
    config: { duration: clients.length * 9000, easing: easings.linear },
  });
  return (
    <section ref={section} aria-label="Our clients" className="client-marquee"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="client-marquee-window" tabIndex={0} aria-label="Client logos; scroll horizontally when motion is reduced">
        <animated.div className="client-marquee-track" style={{ transform: styles.x.to(x => `translateX(${x}%)`) }}>
          {[false, true].map(duplicate => (
            <ul key={String(duplicate)} className={`client-marquee-group${duplicate ? " client-marquee-copy" : ""}`} aria-hidden={duplicate || undefined}>
              {clients.map(client => <li key={client.name} className="client-marquee-cell">
                <Image src={client.src} alt={duplicate ? "" : client.name} width={180} height={60} unoptimized
                  className={`client-marquee-logo${client.invert ? " client-marquee-logo-invert" : ""}${client.name === "Dialflo" ? " client-marquee-logo-round" : ""}`} />
              </li>)}
            </ul>
          ))}
        </animated.div>
      </div>
      <button type="button" className="client-marquee-toggle" aria-label={paused ? "Resume client logos" : "Pause client logos"}
        aria-pressed={paused} onClick={() => setPaused(value => !value)}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          {paused ? <path d="m8 5 11 7-11 7Z" /> : <path d="M7 5h3v14H7zm7 0h3v14h-3z" />}
        </svg>
      </button>
    </section>
  );
}
