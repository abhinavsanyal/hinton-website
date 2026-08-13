"use client";

import { useState, useEffect } from "react";
import { useTransition, animated } from "@react-spring/web";

export interface RotatingBulletsProps {
  bullets: string[];
}

export const RotatingBullets = ({ bullets }: RotatingBulletsProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 3 >= bullets.length ? 0 : prev + 3));
    }, 6000);
    return () => clearInterval(interval);
  }, [bullets.length]);

  const activeBullets = bullets.slice(index, index + 3);

  // We transition the lines themselves so they swap seamlessly
  const linesTransition = useTransition(activeBullets, {
    keys: (item) => item,
    from: { opacity: 0, transform: "translate3d(0, 20px, 0)" },
    enter: { opacity: 1, transform: "translate3d(0, 0px, 0)" },
    leave: { opacity: 0, transform: "translate3d(0, -20px, 0)", position: "absolute" },
    config: { tension: 120, friction: 30 },
  });

  return (
    <ul className="flex flex-col gap-[1.5vmin] items-end relative w-full">
      {linesTransition((style, bullet) => (
        <animated.li style={style} className="flex items-center gap-3 w-full justify-end">
          <AnimatedText text={bullet} />
          {/* Glass Arrow */}
          <div className="flex items-center justify-center size-[2.2vmin] rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)] shrink-0">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-sm">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </animated.li>
      ))}
    </ul>
  );
};

// Character-by-character 3D particle fade in
const AnimatedText = ({ text }: { text: string }) => {
  const chars = text.split("");
  const charTransition = useTransition(chars, {
    keys: ((_: string, i: number) => i) as any,
    trail: 15,
    from: { opacity: 0, filter: "blur(10px)", transform: "translate3d(20px, -20px, 50px) scale(1.5)" },
    enter: { opacity: 1, filter: "blur(0px)", transform: "translate3d(0px, 0px, 0px) scale(1)" },
    leave: { opacity: 0, filter: "blur(10px)", transform: "translate3d(-20px, 20px, -50px) scale(0.5)" },
    config: { tension: 140, friction: 24 },
  });

  return (
    <span className="text-[0.9vmin] uppercase tracking-[0.2em] font-semibold leading-tight text-white/90 drop-shadow-md text-right inline-block whitespace-nowrap">
      {charTransition((style, char) => (
        <animated.span style={style} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </animated.span>
      ))}
    </span>
  );
};
