"use client";

import { useEffect, useRef } from "react";
import { useVideoStore } from "@/store/use-video-store";
import { animated, useSpring } from "@react-spring/web";

export const VideoModal = () => {
  const { isOpen, videoSrc, close } = useVideoStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const springs = useSpring({
    opacity: isOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    } else {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, close]);

  if (!isOpen && springs.opacity.get() === 0) return null;

  return (
    <animated.div
      style={{
        opacity: springs.opacity,
        pointerEvents: isOpen ? "auto" : "none",
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl"
      onClick={close}
    >
      <button
        onClick={close}
        className="absolute top-6 right-6 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
        aria-label="Close video"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div 
        className="relative w-[90vw] h-[80vh] max-w-7xl"
        onClick={(e) => e.stopPropagation()}
      >
        {videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            className="size-full rounded-xl object-contain shadow-2xl"
            controls
            autoPlay
            playsInline
          />
        )}
      </div>
    </animated.div>
  );
};
