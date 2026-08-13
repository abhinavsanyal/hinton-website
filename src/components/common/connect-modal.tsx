"use client";

import { useEffect, useState } from "react";
import { useUIStore } from "@/store/use-ui-store";
import { animated, useSpring } from "@react-spring/web";
import Cal, { getCalApi } from "@calcom/embed-react";

export const ConnectModal = () => {
  const { isConnectModalOpen, closeConnectModal } = useUIStore();
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const springs = useSpring({
    opacity: isConnectModalOpen ? 1 : 0,
    config: { tension: 300, friction: 30 },
  });

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConnectModal();
    };
    if (isConnectModalOpen) {
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
  }, [isConnectModalOpen, closeConnectModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: description }),
      });
      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
      setEmail("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  if (!isConnectModalOpen && springs.opacity.get() === 0) return null;

  return (
    <animated.div
      style={{
        opacity: springs.opacity,
        pointerEvents: isConnectModalOpen ? "auto" : "none",
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-8"
      onClick={closeConnectModal}
    >
      <button
        onClick={closeConnectModal}
        className="absolute top-6 right-6 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110"
        aria-label="Close modal"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/5 border border-white/10 shadow-2xl flex flex-col lg:flex-row backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Form & Contact Info */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10">
          <h2 className="text-3xl lg:text-5xl font-zen font-extralight tracking-tight text-white mb-8">
            Talk to the founders
          </h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium tracking-widest uppercase text-white/60">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="desc" className="text-sm font-medium tracking-widest uppercase text-white/60">
                Brief Description
              </label>
              <textarea 
                id="desc"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-white/50 transition-colors min-h-[120px] resize-none flex-1"
                placeholder="Tell us about your project..."
              />
            </div>
            
            <button 
              type="submit" 
              disabled={status === "loading"}
              className="mt-4 rounded-full bg-white text-black font-semibold uppercase tracking-widest py-4 px-8 text-sm transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {status === "loading" ? "Sending..." : status === "success" ? "Sent!" : "Submit"}
            </button>
            {status === "error" && <p className="text-red-400 text-sm mt-2">Failed to send. Please try again.</p>}
          </form>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-sm font-medium tracking-widest uppercase text-white/40 mb-4">Or email us directly</p>
            <div className="flex flex-col gap-2 text-white/80 font-zen font-light text-lg">
              <a href="mailto:abhinava@hintonstudios.com" className="hover:text-white transition-colors">abhinava@hintonstudios.com</a>
              <a href="mailto:avkash@hintonstudios.com" className="hover:text-white transition-colors">avkash@hintonstudios.com</a>
              <a href="mailto:souvik@hintonstudios.com" className="hover:text-white transition-colors">souvik@hintonstudios.com</a>
            </div>
          </div>
        </div>

        {/* Right Side: Cal.com Embed */}
        <div className="flex-1 p-4 lg:p-8 bg-white/5 rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none min-h-[500px]">
          <Cal 
            namespace="15min"
            calLink="rick/15min" // Note: Fallback link. Change to your specific link.
            style={{ width: "100%", height: "100%", overflow: "scroll" }}
            config={{ layout: "month_view" }}
          />
        </div>
      </div>
    </animated.div>
  );
};
