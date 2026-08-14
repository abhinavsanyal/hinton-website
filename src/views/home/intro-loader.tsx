// 📖 Docs: obsidian/frontend/animation-system.md
"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { useLoaderStore } from "@/hooks/use-loader";
import { useScroll } from "@/hooks/smooth-scroll/use-scroll";
import { loaderConfig as config } from "@/lib/loader-config";

export interface IntroLoaderProps {
  minDuration?: number;
}

type Phase = "loading" | "split" | "done";

// We hardcode the manifest to avoid a network roundtrip blocking initialization.
const MANIFEST = {
  frameCount: 362,
  sourceFps: 60,
  tiers: [
    { name: "360", width: 640, height: 360, bytes: 1079004 },
    { name: "540", width: 960, height: 540, bytes: 1908164 },
    { name: "720", width: 1280, height: 720, bytes: 2953916 }
  ],
  beats: { converge: 40, lock: 100, sweep: 108, settle: 122 }
};

export const IntroLoader = ({ minDuration = config.minDurationMs }: IntroLoaderProps) => {
  const setReady = useLoaderStore((s) => s.setReady);
  const setRevealed = useLoaderStore((s) => s.setRevealed);

  const BackgroundLayers = () => (
    <>
      <div className="absolute inset-0 bg-[#010101]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(40,0,0,0.25)_0%,_transparent_40%)] pointer-events-none" />
      <div 
        className="absolute inset-0 mix-blend-overlay opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 400 400%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%221%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
    </>
  );
  const stopScroll = useScroll((s) => s.stop);
  const startScroll = useScroll((s) => s.start);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number | null>(null);
  const framesCache = useRef<(HTMLImageElement | null)[]>(new Array(MANIFEST.frameCount).fill(null));
  
  const [phase, setPhase] = useState<Phase>("loading");
  const [reduced, setReduced] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  // State solely for the debug overlay
  const [debugInfo, setDebugInfo] = useState({
    realProgress: 0,
    displayProgress: 0,
    frameIndex: 0,
    tier: "",
    elapsedMs: 0,
    fps: 0,
    decoded: 0,
    heapMb: 0,
    exactFrame: 0
  });

  const stateRef = useRef({
    realProgress: 0,
    displayProgress: 0,
    frameIndex: 0,
    lastTime: 0,
    elapsedMs: 0,
    tier: "",
    warmCache: false,
    started: false,
    holding: false, // Debug hold
    mediaCount: 0,
    mediaLoaded: 0,
    forcedExit: false,
    framesDecoded: 0,
    exactFrame: 0
  });

  // Determine tier and reduced motion on mount
  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    setDebugMode(new URLSearchParams(window.location.search).get("loaderdebug") === "1");

    const width = window.innerWidth;
    const dpr = window.devicePixelRatio || 1;
    let selectedTier = "360";
    if (width >= 1024 && dpr >= 2) selectedTier = "720";
    else if (width >= 768) selectedTier = "540";
    
    // Check connection
    if (navigator && (navigator as any).connection) {
      const conn = (navigator as any).connection;
      if (conn.saveData || conn.effectiveType === "2g" || conn.effectiveType === "3g") {
        selectedTier = "360";
      }
    }
    stateRef.current.tier = selectedTier;

    const played = false; // sessionStorage.getItem(config.sessionStorageKey);
    if (played) {
      stateRef.current.warmCache = true;
    } else {
      // sessionStorage.setItem(config.sessionStorageKey, "1");
    }

    stopScroll();
  }, [stopScroll]);

  // Load progress tracking
  useEffect(() => {
    if (stateRef.current.warmCache) {
      stateRef.current.realProgress = 1;
      return;
    }

    let unmounted = false;
    let unitsTotal = 2; // fonts + window load
    let unitsLoaded = 0;

    const updateProgress = () => {
      if (unmounted) return;
      let p = unitsLoaded / unitsTotal;
      if (stateRef.current.mediaCount > 0) {
        // Media contributes 50% of the progress
        const mediaProgress = (stateRef.current.mediaLoaded / stateRef.current.mediaCount);
        p = (p * 0.5) + (mediaProgress * 0.5);
      }
      stateRef.current.realProgress = Math.min(1, p);
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

    // Gather media
    setTimeout(() => {
      if (unmounted) return;
      const videos = Array.from(document.querySelectorAll("video"));
      const images = Array.from(document.querySelectorAll("img")).filter(img => !img.src.includes('data:'));
      
      const media = [...videos, ...images];
      stateRef.current.mediaCount = media.length;
      updateProgress();

      if (media.length === 0) return;

      const onMediaLoaded = () => {
        stateRef.current.mediaLoaded++;
        updateProgress();
      };

      videos.forEach(vid => {
        if (vid.readyState >= 3) onMediaLoaded();
        else {
          let done = false;
          const markDone = () => { if (!done) { done = true; onMediaLoaded(); } };
          vid.addEventListener("canplaythrough", markDone, { once: true });
          vid.addEventListener("error", markDone, { once: true });
          setTimeout(markDone, 6000);
        }
      });

      images.forEach(img => {
        if (img.complete) onMediaLoaded();
        else {
          let done = false;
          const markDone = () => { if (!done) { done = true; onMediaLoaded(); } };
          img.addEventListener("load", markDone, { once: true });
          img.addEventListener("error", markDone, { once: true });
          setTimeout(markDone, 6000);
        }
      });
    }, 100);

    return () => { unmounted = true; };
  }, []);

  // Frame preloader
  useEffect(() => {
    if (stateRef.current.warmCache || reduced) return;
    const tier = stateRef.current.tier;
    if (!tier) return;

    let unmounted = false;
    let decoded = 0;

    // Load function
    const loadFrame = (i: number) => {
      if (unmounted) return;
      const img = new Image();
      img.src = `/loader/frames/${tier}/f_${(i + 1).toString().padStart(4, "0")}.webp`;
      
      const handleLoad = () => {
        if (unmounted) return;
        framesCache.current[i] = img; // We keep the array 0-indexed internally
        decoded++;
        stateRef.current.framesDecoded = decoded;
        
        // Start animation once first 8 frames are ready (or if we reached the end)
        if (decoded >= Math.min(8, MANIFEST.frameCount) && !stateRef.current.started) {
          stateRef.current.started = true;
          stateRef.current.lastTime = performance.now();
          reqRef.current = requestAnimationFrame(renderLoop);
        }
        
        // Cascade load next
        if (i + 8 < MANIFEST.frameCount) {
          loadFrame(i + 8);
        }
      };

      img.onload = handleLoad;
      img.onerror = () => {
        // Fallback to empty image to avoid stalling the loader completely
        console.warn("Failed to load frame", i + 1);
        handleLoad(); 
      };
    };

    // Kick off first 8
    for (let i = 0; i < Math.min(8, MANIFEST.frameCount); i++) {
      const src = `/loader/frames/${tier}/f_${(i + 1).toString().padStart(4, "0")}.webp`;
      ReactDOM.preload(src, { as: "image", fetchPriority: "high" });
      loadFrame(i);
    }

    return () => { unmounted = true; };
  }, [reduced]);

  // Main render loop
  const renderLoop = useCallback((time: number) => {
    const s = stateRef.current;
    if (!s.started || s.holding) {
      reqRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const dt = time - s.lastTime;
    s.lastTime = time;
    s.elapsedMs += dt;

    if (dt > 1000) {
      // Background tab, ignore huge delta
      reqRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    let isReady = s.realProgress > 0.99 && s.elapsedMs >= config.minDurationMs;
    if (s.elapsedMs > config.maxDurationMs) isReady = true;

    const framesToAdvance = (dt / 1000) * config.baseFps * config.playbackRate;
    s.exactFrame += framesToAdvance;

    // Play once, hold on the final frame until page is ready
    if (s.exactFrame >= MANIFEST.frameCount - 1) {
      s.exactFrame = MANIFEST.frameCount - 1;
      
      if (isReady) {
        if (!s.holding) {
          setReady(true);
          startScroll();
          setPhase("split");
        }
        return;
      }
    }

    let idealFrame = Math.floor(s.exactFrame);
    
    // Smooth fallback if frame isn't loaded (avoids crashing)
    let fallback = idealFrame;
    while (fallback > 0 && !framesCache.current[fallback]) {
      fallback--;
    }
    
    const frameChanged = fallback !== s.frameIndex;
    s.frameIndex = fallback;

    if (frameChanged && framesCache.current[s.frameIndex] && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      const img = framesCache.current[s.frameIndex];
      // Only draw if image successfully loaded and has dimensions
      if (ctx && img && img.complete && img.naturalWidth !== 0) {
        const cw = canvasRef.current.width;
        const ch = canvasRef.current.height;
        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        
        // Draw centered and smaller so it doesn't cover the whole screen.
        // The user wants it small, centered, and merged into the black background.
        
        // Scale to a slightly larger, cinematic badge size
        // Scale using object-fit: contain logic to prevent clipping
        const maxW = Math.min(cw * 0.65, 800); // 65% of screen width, capped at 800px
        const maxH = ch * 0.75; // 75% of screen height
        
        const scaleX = maxW / iw;
        const scaleY = maxH / ih;
        const scale = Math.min(scaleX, scaleY);
        
        const drawW = iw * scale;
        const drawH = ih * scale;
        const x = (cw / 2) - (drawW / 2);
        const y = (ch / 2) - (drawH / 2);
        
        // 1. Clear frame (transparent)
        ctx.clearRect(0, 0, cw, ch);
        
        // 2. Draw the video frame
        ctx.globalCompositeOperation = "source-over";
        ctx.drawImage(img, x, y, drawW, drawH);

        // 3. Apply perfect elliptical radial mask to seamlessly blend into black
        ctx.globalCompositeOperation = "destination-in";
        ctx.save();
        
        const cx = cw / 2;
        const cy = ch / 2;
        
        // Scale context to match video aspect ratio (make the circular gradient elliptical)
        ctx.translate(cx, cy);
        ctx.scale(1, drawH / drawW);
        
        const r = drawW / 2;
        // Start fading very early (0.05) and end early (0.65) for a tight, ultra-soft merge
        const grad = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, r * 0.65);
        grad.addColorStop(0, "rgba(0, 0, 0, 1)");    // Fully keep center
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");    // Fully erase edges
        
        ctx.fillStyle = grad;
        ctx.fillRect(-drawW, -drawW, drawW * 2, drawW * 2);
        
        ctx.restore();
        
        // Reset composite operation for next frame
        ctx.globalCompositeOperation = "source-over";
      }
    }

    // Debug update (throttle)
    if (debugMode && Math.floor(time) % 4 === 0) {
      setDebugInfo({
        realProgress: s.realProgress,
        displayProgress: s.displayProgress,
        frameIndex: s.frameIndex,
        tier: s.tier,
        elapsedMs: s.elapsedMs,
        fps: Math.round(1000 / dt),
        decoded: s.framesDecoded,
        heapMb: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) : 0,
        exactFrame: s.exactFrame
      });
    }

    reqRef.current = requestAnimationFrame(renderLoop);
  }, [debugMode, setReady, startScroll]);

  // Handle window resize for canvas
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
        canvasRef.current.height = window.innerHeight * Math.min(window.devicePixelRatio || 1, 2);
        // Force redraw on next frame
        stateRef.current.frameIndex = -1;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Split exit unmount logic
  useEffect(() => {
    if (phase === "split") {
      const timer = setTimeout(() => {
        setRevealed(true);
        setPhase("done");
      }, 850); // 800ms cinematic animation + 50ms buffer
      return () => clearTimeout(timer);
    }
  }, [phase, setRevealed]);

  // Warm cache / reduced motion exit
  useEffect(() => {
    if ((stateRef.current.warmCache || reduced) && phase === "loading") {
      const timer = setTimeout(() => {
        setReady(true);
        setPhase("split");
        startScroll();
      }, reduced ? 700 : 300);
      return () => clearTimeout(timer);
    }
  }, [reduced, phase, setReady, startScroll]);

  if (phase === "done") return null;

  return (
    <div 
      className={`fixed inset-0 z-[200] overflow-hidden ${phase === "loading" || phase === "split" ? "bg-[#010101]" : "pointer-events-none"}`}
      style={phase === "split" ? { animation: 'loader-slide-up 800ms cubic-bezier(0.85, 0, 0.15, 1) forwards' } : {}}
    >
      
      {/* Continuous Dolly Zoom Wrapper that persists across BOTH phases to eliminate jitter */}
      {(!reduced && !stateRef.current.warmCache && (phase === "loading" || phase === "split")) && (
        <>
          <BackgroundLayers />
          <div 
            className="absolute inset-0"
            style={{ animation: `dolly-zoom 20s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards` }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 size-full filter drop-shadow-[0_0_30px_rgba(255,80,80,0.15)]"
            />
          </div>

          <style>{`
            @keyframes dolly-zoom {
              0% { transform: scale(0.9); opacity: 0; filter: blur(20px); }
              3% { transform: scale(1.0); opacity: 1; filter: blur(0px); }
              100% { transform: scale(1.5); }
            }
          `}</style>
        </>
      )}

      {/* Main Page Fly-In Effect (Applies to underlying page) */}
      {phase === "split" && !reduced && !stateRef.current.warmCache && (
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

      {/* Reduced motion or Warm Cache fallback fade */}
      {(reduced || stateRef.current.warmCache) && phase === "split" && (
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

      {/* Debug Overlay */}
      {debugMode && (
        <div className="absolute top-4 left-4 z-[300] bg-black/80 p-4 text-xs font-mono text-white rounded border border-white/20 shadow-2xl backdrop-blur">
          <div className="font-bold mb-2">LOADER DEBUG</div>
          <div>Tier: {debugInfo.tier}</div>
          <div>FPS: {debugInfo.fps}</div>
          <div>Elapsed: {Math.round(debugInfo.elapsedMs)}ms</div>
          <div>Frames Decoded: {debugInfo.decoded} / {MANIFEST.frameCount}</div>
          {debugInfo.heapMb > 0 && <div>JS Heap: {debugInfo.heapMb} MB</div>}
          <div className="h-2 my-2 w-full bg-white/20 rounded overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${debugInfo.realProgress * 100}%` }} />
          </div>
          <div>Real Progress: {(debugInfo.realProgress * 100).toFixed(1)}%</div>
          <div className="h-2 my-2 w-full bg-white/20 rounded overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${debugInfo.displayProgress * 100}%` }} />
          </div>
          <div>Display: {(debugInfo.displayProgress * 100).toFixed(1)}%</div>
          <div>Frame: {debugInfo.frameIndex} / {MANIFEST.frameCount - 1}</div>
          
          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input 
              type="checkbox" 
              checked={stateRef.current.holding} 
              onChange={(e) => { stateRef.current.holding = e.target.checked; }}
            />
            HOLD RENDER LOOP
          </label>
        </div>
      )}
    </div>
  );
};
 
