"use client";

import { useEffect, useRef, useState, VideoHTMLAttributes } from "react";

/**
 * A highly optimized <video> replacement that completely unmounts its `src` 
 * when out of view, and automatically pauses/plays based on viewport intersection.
 * This is the ultimate fix for mobile browsers crashing due to too many concurrent
 * <video> loading requests.
 */
export function InViewVideo({ src, ...props }: VideoHTMLAttributes<HTMLVideoElement>) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: "600px" } // aggressively preload slightly before it enters screen
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (inView && props.autoPlay) {
      video.play().catch(() => {});
    } else if (!inView && props.autoPlay) {
      video.pause();
    }
  }, [inView, props.autoPlay]);

  return (
    <video
      ref={videoRef}
      src={inView ? src : undefined}
      {...props}
    />
  );
}
