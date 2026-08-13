"use client";

import { useVideoStore } from "@/store/use-video-store";

interface GlassPlayButtonProps {
  videoSrc: string;
  className?: string;
}

export const GlassPlayButton = ({ videoSrc, className = "" }: GlassPlayButtonProps) => {
  const { open } = useVideoStore();

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        open(videoSrc);
      }}
      className={`absolute inset-0 m-auto flex size-[6vmin] min-w-12 min-h-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-transform duration-300 hover:scale-110 hover:bg-white/20 z-20 ${className}`}
      aria-label="Play video"
    >
      {/* Play Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-[2.5vmin] min-w-5 min-h-5 ml-1 text-white/90"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
};
