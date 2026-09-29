"use client";

import { WHATSAPP_CONTACT_URL } from "@/lib/whatsapp";

import { SocialLinks } from "@/components/common/social-links";
import { useEnquiryForm } from "@/hooks/use-enquiry-form";
import { FormFeedback } from "@/components/contact/form-feedback";
import Link from "next/link";
import { serviceNavigation } from "@/data/service-navigation";
import { useCookieStore } from "@/components/common/Cookie/cookieStore";


export const SeoFooter = () => {
  const enquiry = useEnquiryForm("contact_form");
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await enquiry.submit({ name: String(data.get("name") || ""), email: String(data.get("email") || ""), message: String(data.get("message") || ""), website: String(data.get("website") || "") });
  };

  return (
    <footer id="contact" className="bg-black text-white py-[10vmin] px-[6vmin] border-t border-white/10" aria-label="Footer">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Company Info */}
        <div>
          <h2 className="text-[2.5vmin] max-sm:text-[20px] font-semibold mb-4">Hinton Studios</h2>
          <p className="text-[1.6vmin] max-sm:text-[14px] text-white/70 leading-relaxed mb-6">
            Hinton Studios — Human-directed AI filmmaking and video production for brands worldwide.
          </p>
          <address className="not-italic text-[1.4vmin] max-sm:text-[13px] text-white/50 mb-6">
            <span className="footer-location"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>Bengaluru, India</span>
            <span className="footer-markets">Working worldwide · USA, UAE, UK &amp; Singapore</span>
          </address>

          <nav aria-label="Explore Hinton" className="flex flex-wrap gap-4 mb-6 text-sm">
            <Link href="/contact">Contact</Link><Link href="/about">About</Link><Link href="/blog">Blogs</Link><Link href="/work">Work</Link><Link href="/audio-samples">Audio</Link><Link href="/video-marketing-report">Free video planner</Link>
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

          <p className="mt-4 text-sm"><a href="tel:+919330226381">+91 93302 26381</a> · <a href={WHATSAPP_CONTACT_URL}>WhatsApp</a></p>
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
            <form onSubmit={handleSubmit} onFocus={enquiry.start} onInvalid={enquiry.invalid} aria-label="Send a message" aria-busy={enquiry.busy} className="flex flex-col gap-3">
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
                disabled={enquiry.busy}
                className="mt-1 bg-white text-black hover:bg-white/90 disabled:opacity-50 rounded-lg px-4 py-2.5 text-sm font-semibold flex justify-center items-center"
              >
                {enquiry.busy ? "Sending..." : "Send Message"}
              </button>
              <div className="sr-only" aria-hidden="true"><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
              <p className="form-note">We’ll use your details to respond to your enquiry. <Link href="/privacy-policy">Privacy policy</Link></p>
              <FormFeedback error={enquiry.error} />
            </form>
        </div>
      </div>
    </footer>
  );
};
