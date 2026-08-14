"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { loaderConfig as config } from "@/lib/loader-config";

type Phase = "loading" | "split" | "done";

export const IntroLoader = () => {
  const setReady = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);

  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const [phase, setPhase] = useState<Phase>("loading");
  const [reduced, setReduced] = useState(false);
  const [warmCache, setWarmCache] = useState(false);

  const counterRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reqRef = useRef<number | null>(null);

  const stateRef = useRef({
    realProgress: 0,
    displayProgress: 0,
    startedAt: 0,
  });

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);

    // Skip loader completely if already played this session
    // const played = sessionStorage.getItem(config.sessionStorageKey);
    // if (played) {
    //   setWarmCache(true);
    // } else {
    //   sessionStorage.setItem(config.sessionStorageKey, "1");
    // }

    stopScroll();
    stateRef.current.startedAt = performance.now();
  }, [stopScroll]);

  // Track page load progress
  useEffect(() => {
    if (warmCache) {
      stateRef.current.realProgress = 1;
      return;
    }

    let unmounted = false;
    let unitsLoaded = 0;
    const unitsTotal = 2; // window load + fonts

    const updateProgress = () => {
      if (unmounted) return;
      stateRef.current.realProgress = Math.min(1, unitsLoaded / unitsTotal);
    };

    const increment = () => {
      unitsLoaded++;
      updateProgress();
    };

    if (document.fonts) {
      document.fonts.ready.then(increment);
    } else {
      increment();
    }

    if (document.readyState === "complete") {
      increment();
    } else {
      window.addEventListener("load", increment, { once: true });
    }

    return () => { unmounted = true; };
  }, [warmCache]);

  // Main UI render loop (updates counter and checks if ready)
  useEffect(() => {
    if (warmCache || reduced) return;
    
    let lastTime = performance.now();
    
    const renderLoop = (time: number) => {
      const s = stateRef.current;
      const dt = time - lastTime;
      lastTime = time;

      // Update counter
      s.displayProgress += (s.realProgress - s.displayProgress) * config.progressEase;
      if (s.realProgress < 1) {
        s.realProgress += config.idleCreepPerSec * (dt / 1000) * (1 - s.realProgress);
      }
      
      if (counterRef.current) {
        const pct = Math.min(100, Math.round(s.displayProgress * 100));
        counterRef.current.innerText = `${pct}%`;
      }
      
      if (progressRef.current) {
        progressRef.current.style.width = `${s.displayProgress * 100}%`;
      }

      // Check exit condition (time passed AND progress is 100%)
      const elapsed = time - s.startedAt;
      const videoEnded = videoRef.current ? videoRef.current.ended : false;
      const isReady = s.realProgress > 0.99 && (videoEnded || elapsed > config.maxDurationMs);

      if (isReady && phase === "loading") {
        setReady(true);
        startScroll();
        setPhase("split");
        return;
      }

      reqRef.current = requestAnimationFrame(renderLoop);
    };

    reqRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [warmCache, reduced, phase, setReady, startScroll]);

  // Split exit unmount logic
  useEffect(() => {
    if (phase === "split") {
      const timer = setTimeout(() => {
        setRevealed(true);
        setPhase("done");
      }, 850); 
      return () => clearTimeout(timer);
    }
  }, [phase, setRevealed]);

  // Warm cache / reduced motion fast exit
  useEffect(() => {
    if ((warmCache || reduced) && phase === "loading") {
      const timer = setTimeout(() => {
        setReady(true);
        setPhase("split");
        startScroll();
      }, reduced ? 700 : 300);
      return () => clearTimeout(timer);
    }
  }, [reduced, warmCache, phase, setReady, startScroll]);

  if (phase === "done") return null;

  return (
    <div 
      className={`fixed inset-0 z-[200] overflow-hidden ${phase === "loading" || phase === "split" ? "bg-[#010101]" : "pointer-events-none"}`}
      style={phase === "split" ? { animation: 'loader-slide-up 800ms cubic-bezier(0.85, 0, 0.15, 1) forwards' } : {}}
    >
      {(!reduced && !warmCache && (phase === "loading" || phase === "split")) && (
        <>
          {/* Background Textures */}
          <div className="absolute inset-0 bg-[#010101]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(40,0,0,0.25)_0%,_transparent_40%)] pointer-events-none" />
          <div 
            className="absolute inset-0 mix-blend-overlay opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
          />
          
          {/* Glass Card UI Container */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ animation: `dolly-zoom 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` }}
          >
            <div className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-[2px] w-[75vw] max-w-[600px] aspect-video">
              
              {/* Chromatic Aberration Waves Underneath */}
              <div className="absolute inset-0 z-0 overflow-hidden rounded-[30px] pointer-events-none mix-blend-screen opacity-70">
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-red-600/40 blur-[50px] animate-[pulse_4s_ease-in-out_infinite_alternate]" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-400/40 blur-[40px] animate-[pulse_3s_ease-in-out_infinite_alternate_reverse]" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[60px] animate-[pulse_5s_ease-in-out_infinite_alternate]" />
              </div>

              {/* Native Video */}
              <video
                ref={videoRef}
                src="/assets/brand/loader-logo.mp4"
                autoPlay
                muted
                playsInline
                className="relative z-10 w-full h-full object-cover rounded-[30px] mix-blend-screen"
                style={{ filter: "brightness(1.1) contrast(1.05)" }}
              />
            </div>
            
            {/* Premium Typography Countdown & Sleek Progress Bar */}
            <div className="mt-8 flex flex-col items-center gap-3 pointer-events-none w-[75vw] max-w-[600px]">
              {/* Modern gaming-style thin progress bar */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div 
                  ref={progressRef}
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
                  style={{ width: "0%" }} 
                />
              </div>
              <div 
                ref={counterRef} 
                className="text-white/50 font-mono text-xs tracking-[0.3em] uppercase tabular-nums"
              >
                0%
              </div>
            </div>
          </div>

          <style>{`
            @keyframes dolly-zoom {
              0% { transform: scale(0.9); opacity: 0; filter: blur(20px); }
              3% { transform: scale(1.0); opacity: 1; filter: blur(0px); }
              100% { transform: scale(1.1); }
            }
          `}</style>
        </>
      )}

      {/* Main Page Fly-In Effect */}
      {phase === "split" && !reduced && !warmCache && (
        <style>{`
          main {
            animation: page-fly-in 800ms cubic-bezier(0.85, 0, 0.15, 1) forwards;
            transform-origin: 50% 50vh;
            will-change: transform, opacity, filter;
          }
          @keyframes page-fly-in {
            0% { transform: scale(0.95) translateY(10vh); opacity: 0; filter: blur(20px); }
            100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); }
          }
          @keyframes loader-slide-up {
            0% { transform: translateY(0); filter: blur(0px); }
            100% { transform: translateY(-120vh); filter: blur(15px); opacity: 0; }
          }
        `}</style>
      )}

      {(reduced || warmCache) && phase === "split" && (
        <div 
          className="absolute inset-0 bg-[#010101]"
          style={{ animation: `fade-out ${reduced ? 700 : 300}ms ease forwards` }}
        >
          <style>{`
            @keyframes fade-out {
              0% { opacity: 1; }
              100% { opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};
