"use client";

import { useState } from "react";

export const SeoFooter = () => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-black text-white py-[10vmin] px-[6vmin] border-t border-white/10" aria-label="Footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div>
          <h2 className="text-[2.5vmin] max-sm:text-[20px] font-semibold mb-4">Hinton Studios</h2>
          <p className="text-[1.6vmin] max-sm:text-[14px] text-white/70 leading-relaxed mb-6">
            Hinton Studios — AI filmmaking and AI video production studio based in Bengaluru, India.
          </p>
          <address className="not-italic text-[1.4vmin] max-sm:text-[13px] text-white/50 mb-6">
            Bengaluru, Karnataka<br/>
            India
          </address>

          {/* Social Links */}
          <div className="flex gap-4">
            <a href="https://youtube.com/@hintonpictures" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" aria-label="YouTube">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://instagram.com/hinton_studios" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/105633194/admin/dashboard/" target="_blank" rel="noreferrer" className="text-white/50 hover:text-white transition-colors" aria-label="LinkedIn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Contact Us</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80">
            <li><a href="mailto:abhinava@hintonstudios.com" className="hover:text-white transition-colors">abhinava@hintonstudios.com</a></li>
            <li><a href="mailto:avkash@hintonstudios.com" className="hover:text-white transition-colors">avkash@hintonstudios.com</a></li>
            <li><a href="mailto:souvik@hintonstudios.com" className="hover:text-white transition-colors">souvik@hintonstudios.com</a></li>
          </ul>

          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 mt-8 text-white/50">Legal</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80 flex flex-col">
            <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Services</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80">
            <li>AI TVC Production</li>
            <li>Brand & Product Films</li>
            <li>Vertical Micro Dramas</li>
            <li>AI Storyboards & Animatics</li>
            <li>VFX & 3D Animation</li>
          </ul>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Send a Message</h3>
          {status === "success" ? (
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white">
              Thanks for reaching out! We&apos;ll get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input 
                type="text" 
                name="name" 
                placeholder="Name" 
                required 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                required 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-colors"
              />
              <textarea 
                name="message" 
                placeholder="How can we help?" 
                rows={3} 
                required 
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 transition-colors resize-none"
              ></textarea>
              <button 
                type="submit" 
                disabled={status === "loading"}
                className="mt-1 bg-white text-black hover:bg-white/90 disabled:opacity-50 transition-colors rounded-lg px-4 py-2.5 text-sm font-semibold flex justify-center items-center"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && (
                <p className="text-accent text-xs mt-1">Failed to send message. Please try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};
