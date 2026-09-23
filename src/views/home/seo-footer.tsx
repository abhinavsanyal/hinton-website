"use client";

import { SocialLinks } from "@/components/common/social-links";
import { useState } from "react";
import Link from "next/link";
import { serviceNavigation } from "@/data/service-navigation";
import { useCookieStore } from "@/components/common/Cookie/cookieStore";
import { trackLead } from "@/components/analytics/analytics";

export const SeoFooter = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      marketingConsent: useCookieStore.getState().consent?.marketing ?? false,
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
        const body = await res.json();
        trackLead("contact_form", body.data.eventId);
        (e.target as HTMLFormElement).reset();
      } else {
        const body = await res.json();
        setErrorMessage(body.error?.message || "Please try again or email the studio directly.");
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer id="contact" className="bg-black text-white py-[10vmin] px-[6vmin] border-t border-white/10" aria-label="Footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div>
          <h2 className="text-[2.5vmin] max-sm:text-[20px] font-semibold mb-4">Hinton Studios</h2>
          <p className="text-[1.6vmin] max-sm:text-[14px] text-white/70 leading-relaxed mb-6">
            Hinton Studios — AI filmmaking and AI video production studio based in Bengaluru, India.
          </p>
          <address className="not-italic text-[1.4vmin] max-sm:text-[13px] text-white/50 mb-6">
            Bengaluru, Karnataka<br/>
            India<br />Serving India, USA, UAE, UK and Singapore
          </address>

          <nav aria-label="Explore Hinton" className="flex flex-wrap gap-4 mb-6 text-sm">
            <Link href="/about">About</Link><Link href="/blog">Journal</Link><Link href="/work">Work</Link><Link href="/audio-samples">Audio</Link><Link href="/video-marketing-report">Free video planner</Link>
            <button type="button" onClick={() => useCookieStore.getState().openModal()}>Cookie settings</button>
          </nav>
          <SocialLinks />
        </div>

        {/* Links */}
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Contact Us</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80">
            <li><a href="mailto:abhinava@hintonstudios.com" className="hover:text-white">abhinava@hintonstudios.com</a></li>
            <li><a href="mailto:avkash@hintonstudios.com" className="hover:text-white">avkash@hintonstudios.com</a></li>
            <li><a href="mailto:souvik@hintonstudios.com" className="hover:text-white">souvik@hintonstudios.com</a></li>
          </ul>

          <p className="mt-4 text-sm"><a href="tel:+919330226381">+91 93302 26381</a> · <a href="https://wa.me/919330226381">WhatsApp</a></p>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 mt-8 text-white/50">Legal</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80 flex flex-col">
            <li><a href="/terms-and-conditions" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="/privacy-policy" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Services</h3>
          <ul className="space-y-3 text-[1.5vmin] max-sm:text-[14px] text-white/80">
            {serviceNavigation.map((service) => <li key={service.slug}><Link href={`/services/${service.slug}`}>{service.navLabel}</Link></li>)}
          </ul>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-[1.6vmin] max-sm:text-[13px] uppercase tracking-widest font-semibold mb-6 text-white/50">Send a Message</h3>
          {status === "success" ? (
            <div role="status" className="bg-white/10 border border-white/20 rounded-xl p-4 text-sm text-white">
              Thanks for reaching out! We&apos;ll get back to you shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                aria-label="Name" autoComplete="name" maxLength={100} placeholder="Name"
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50"
              />
              <input
                type="email"
                name="email"
                aria-label="Email address" autoComplete="email" maxLength={254} placeholder="Email Address"
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50"
              />
              <textarea
                name="message"
                aria-label="Your message" maxLength={2000} placeholder="How can we help?"
                rows={3}
                required
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent/50 resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-1 bg-white text-black hover:bg-white/90 disabled:opacity-50 rounded-lg px-4 py-2.5 text-sm font-semibold flex justify-center items-center"
              >
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
              {status === "error" && (
                <p role="alert" className="text-accent text-xs mt-1">{errorMessage || "Failed to send. Please email abhinava@hintonstudios.com."}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </footer>
  );
};
