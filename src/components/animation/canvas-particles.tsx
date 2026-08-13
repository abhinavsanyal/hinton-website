"use client";

import { useEffect, useRef } from "react";

export interface CanvasParticlesProps {
  className?: string;
}

export const CanvasParticles = ({ className }: CanvasParticlesProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Use a large canvas so particles don't clip as they blow away
    const width = 500;
    const height = 300;
    
    // Scale for high DPI displays (Retina) for hyper-realistic crispness
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // --- PRE-RENDER SPRITES FOR MASSIVE PERFORMANCE BOOST ---
    // Drawing arcs and especially shadowBlur in a loop kills the GPU.
    // We pre-render the particle types to tiny offscreen canvases and use drawImage.
    const createGlowSprite = () => {
      const c = document.createElement("canvas");
      const size = 16;
      c.width = size;
      c.height = size;
      const cCtx = c.getContext("2d")!;
      const grad = cCtx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      cCtx.fillStyle = grad;
      cCtx.fillRect(0, 0, size, size);
      return c;
    };

    const createSharpSprite = (color: string) => {
      const c = document.createElement("canvas");
      const size = 8;
      c.width = size;
      c.height = size;
      const cCtx = c.getContext("2d")!;
      cCtx.fillStyle = color;
      cCtx.beginPath();
      cCtx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
      cCtx.fill();
      return c;
    };

    const glowSprite = createGlowSprite();
    const sharpWhiteSprite = createSharpSprite("rgba(255, 255, 255, 0.9)");
    const darkSprite = createSharpSprite("rgba(150, 150, 150, 0.6)");

    // Particle definition
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      type: "glow" | "sharp" | "dark";
      seed: number;
    };

    let particles: Particle[] = [];
    let animationId: number;
    let time = 0;

    const loop = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      // MASSIVE DENSITY: 60 per frame, capped at 5000.
      if (particles.length < 5000) {
        for (let i = 0; i < 60; i++) {
          const rand = Math.random();
          let type: Particle["type"] = "sharp";
          // 50% of particles are now glowing for a highly magical/cinematic look
          if (rand > 0.5) type = "glow";
          else if (rand < 0.1) type = "dark";

          particles.push({
            // Placed squarely on the top right curve of the S
            x: 10 + (Math.random() * 8 - 4), 
            y: height - 120 + (Math.random() * 8 - 4),
            // Initial physical burst velocity
            vx: Math.random() * 2.5 - 0.2, 
            vy: Math.random() * -2.5 - 0.5, 
            // Varied sizes (0.15 to 0.55px)
            size: Math.random() * 0.40 + 0.15, 
            life: 0,
            // Shorter lifespan keeps the extreme density concentrated near the letter
            maxLife: Math.random() * 100 + 40,
            type,
            seed: Math.random() * Math.PI * 2,
          });
        }
      }

      // Update and draw
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Realistic Physics: Complex curl noise + Drag (friction)
        const turbulenceX = Math.sin(time * 3 + p.seed) * 0.15 + Math.cos(time * 2 - p.seed) * 0.1;
        const turbulenceY = Math.cos(time * 3 + p.seed) * 0.15 + Math.sin(time * 2 + p.seed) * 0.1;
        
        // Add turbulence and a constant gentle wind pushing right and up
        p.vx += turbulenceX + 0.015;
        p.vy += turbulenceY - 0.01;
        
        // Air friction (drag) - particles slow down naturally over time
        p.vx *= 0.96;
        p.vy *= 0.96;
        
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const progress = p.life / p.maxLife;
        // Since we dropped spawn rate to 15, we can allow full opacity for visibility
        const baseOpacity = progress < 0.1 ? progress / 0.1 : 1 - Math.pow((progress - 0.1) / 0.9, 2);
        ctx.globalAlpha = baseOpacity;
        
        // Using drawImage with pre-rendered sprites is thousands of times faster than arc() + shadowBlur
        if (p.type === "glow") {
          // Draw much larger, softer glow sprite
          const s = p.size * 18;
          ctx.drawImage(glowSprite, p.x - s/2, p.y - s/2, s, s);
          // Draw a second, smaller instance on top of itself for a blistering hot inner core!
          ctx.drawImage(glowSprite, p.x - s/4, p.y - s/4, s/2, s/2);
        } else if (p.type === "dark") {
          const s = p.size * 4;
          // Temporarily remove 'lighter' for dark particles so they occlude
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(darkSprite, p.x - s/2, p.y - s/2, s, s);
          ctx.globalCompositeOperation = "lighter";
        } else {
          const s = p.size * 4;
          ctx.drawImage(sharpWhiteSprite, p.x - s/2, p.y - s/2, s, s);
        }
      }

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute pointer-events-none ${className || ""}`}
      style={{
        width: "500px",
        height: "300px",
        // Align the bottom-left of this large canvas directly with the top-right of the "s"
        bottom: "0%",
        left: "70%",
        transform: "translate(-20px, 30px)", 
        zIndex: 10,
      }}
    />
  );
};
