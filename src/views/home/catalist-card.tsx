import Image from "next/image";
import type { CatalistContent } from "@/data/mocks/home";


export interface CatalistCardProps {
  variant: "dark" | "light";
  content: CatalistContent;
  bg: string; // The fallback static background image
}

export const CatalistCard = ({ variant, content, bg }: CatalistCardProps) => {
  const dark = variant === "dark";
  const ink = dark ? "text-white" : "text-white/90";

  return (
    <div className={`relative size-full overflow-hidden rounded-card bg-black ${ink}`}>
      {/* Background image fallback (underneath video) */}
      <Image src={bg} alt="" fill sizes="42vmin" className="object-cover opacity-50" />

      {/* Full-bleed video for cinematic feel */}
      {content.video && (
        <div className="absolute inset-0 z-[1] group">
          <video
            className="absolute inset-0 size-full object-cover [transform:scale(1.35)] pointer-events-none"
            src={content.video}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Cinematic Grained Gradient Overlays for Matte Film Look */}
      {/* Base grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
          backgroundSize: "256px 256px",
        }}
      />
      
      {/* Premium Matte Ambient Glows */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none transition-colors duration-1000"
        style={{
          background: dark 
            ? "radial-gradient(circle at 10% 90%, rgba(225, 29, 72, 0.3) 0%, transparent 60%), radial-gradient(circle at 90% 10%, rgba(255, 100, 100, 0.1) 0%, transparent 50%), linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)"
            : "radial-gradient(circle at 90% 90%, rgba(37, 99, 235, 0.3) 0%, transparent 60%), radial-gradient(circle at 10% 10%, rgba(100, 150, 255, 0.1) 0%, transparent 50%), linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.1) 100%)"
        }}
      />

      <div className="absolute inset-0 z-[3] flex flex-col p-[4.5vmin] font-sans">
        <div className="flex items-center justify-between h-[4vmin]">
          {/* URL restored to top right for balance, logo removed */}
          <span className="text-[1.5vmin] font-medium tracking-widest text-white/50 uppercase ml-auto hover:text-white/80 transition-colors cursor-pointer">
            {content.url}
          </span>
        </div>

        {dark ? (
          <div className="group mt-[3vmin] relative flex items-center justify-between gap-[2vmin] rounded-[4vmin] border border-white/10 bg-white/5 px-[2.5vmin] py-[2vmin] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden cursor-pointer max-w-max hover:bg-white/10 hover:border-white/20 transition-all duration-500">
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_3s_infinite] group-hover:animate-[shimmer_2s_infinite]" />
            
            <span className="relative flex flex-col gap-[0.2vmin] pr-[2.5vmin]">
              <span className="text-[1.1vmin] font-semibold uppercase tracking-[0.2em] text-white/40 group-hover:text-white/60 transition-colors">{content.pillLabel}</span>
              <span className="text-[2.2vmin] font-medium tracking-tight text-white/95 drop-shadow-sm">{content.pillTitle}</span>
            </span>
            <span className="relative flex size-[4.5vmin] shrink-0 items-center justify-center rounded-full bg-rose-500/20 border border-rose-500/30 text-[2.5vmin] font-light text-rose-200 transition-all duration-700 group-hover:rotate-90 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-400 group-hover:shadow-[0_0_20px_rgba(225,29,72,0.4)]">
              <span className="animate-[pulseGlow_2.5s_ease-in-out_infinite] group-hover:animate-none">+</span>
            </span>
          </div>
        ) : (
          <div className="my-auto relative flex items-center gap-[2vmin] rounded-full border border-white/10 bg-black/40 px-[3vmin] py-[2vmin] text-white backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.05)] cursor-pointer group max-w-max hover:bg-black/60 hover:border-white/20 transition-all duration-500">
            {/* Soft inner glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <span className="relative flex size-[3.5vmin] shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10 text-[1.8vmin] group-hover:bg-white/20 transition-colors">
              <svg className="size-[1.8vmin]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </span>
            <span className="relative overflow-hidden text-ellipsis whitespace-nowrap text-[1.8vmin] font-medium tracking-wide text-white/90 group-hover:text-white transition-colors">
              {content.searchText}
            </span>
            <span className="relative flex size-[4vmin] ml-[1.5vmin] shrink-0 items-center justify-center rounded-full bg-blue-600 text-white transition-all duration-500 group-hover:translate-x-[0.5vmin] shadow-[0_0_15px_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] group-hover:bg-blue-500 group-hover:scale-105">
              <svg className="size-[1.8vmin]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </span>
          </div>
        )}

        <div className="mt-auto pb-[2vmin]">
          {dark ? (
            <h3 className="text-[6.5vmin] font-light leading-[1.05] tracking-tight text-white/60">
              {content.lead}
              <strong className="block mt-[1vmin] font-medium tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-lg">{content.leadStrong}</strong>
            </h3>
          ) : (
            <p className="text-[5.5vmin] font-light leading-[1.1] tracking-tight text-white/60">
              {content.lead}
              <strong className="block mt-[1vmin] font-medium tracking-tight bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-lg">{content.leadStrong}</strong>
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; filter: drop-shadow(0 0 4px rgba(225,29,72,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px rgba(225,29,72,0.6)); }
        }
      `}</style>
    </div>
  );
};

