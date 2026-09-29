import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { RECEIPT_COOKIE, readReceipt } from "@/lib/enquiry-receipt";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { WHATSAPP_CONTACT_URL } from "@/lib/whatsapp";

export const metadata = { ...generateMetadata({ title: "Your next chapter", description: "Your next step with Hinton Studios.", url: "/thank-you" }), robots: { index: false, follow: true } };
export default async function ThankYouView() {
  const receipt = readReceipt((await cookies()).get(RECEIPT_COOKIE)?.value);
  return <><SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} /><main className="editorial-main acknowledgement">
    <div className="acknowledgement-topline"><Link href="/">HINTON STUDIOS</Link><span>{receipt ? "ENQUIRY RECEIVED" : "YOUR NEXT CHAPTER"}</span></div>
    <section className="acknowledgement-hero">
      <div><span className="acknowledgement-symbol" aria-hidden="true">{receipt ? <svg viewBox="0 0 32 32" fill="none"><path d="m8 16 5 5 11-11" stroke="currentColor" strokeWidth="2" /></svg> : "↗"}</span>
      <p className="editorial-kicker">{receipt ? "The first frame is yours." : "A good story starts with a conversation."}</p>
      <h1>{receipt ? <>Your idea.<br />Our next conversation.</> : <>Let’s make something<br />worth watching.</>}</h1>
      <p className="editorial-lede">{receipt ? "Thank you. Your enquiry is with the studio. We’ll review your brief and get in touch to explore what comes next." : "Have a film, campaign or story in mind? Send the studio a few lines and we’ll help shape the next step."}</p>
      {receipt && <p className="form-note">{receipt.confirmationSent ? "A confirmation email is on its way. If it doesn’t arrive, check your spam folder." : "Your brief has been submitted for email delivery to the studio. We’ll reply to the email address you provided. You don’t need to submit again."}</p>}
      <div className="action-row"><Link className="primary-button" href={receipt ? "/work" : "/contact"} data-cta>{receipt ? "Watch what’s possible ↗" : "Start a conversation ↗"}</Link><a className="quiet-button" href={WHATSAPP_CONTACT_URL} target="_blank" rel="noopener noreferrer">Continue on WhatsApp ↗</a></div>
      </div>
      <Link href="/work" className="acknowledgement-film" data-cta><Image src="/assets/posters/tata1mg-2026.jpg" alt="A frame from Hinton Studios’ Tata 1mg commercial" width={1280} height={720} sizes="(max-width: 760px) 90vw, 45vw" /><span>Human direction. Every frame.<span aria-hidden="true">↗</span></span></Link>
    </section>
    <section className="acknowledgement-next" aria-labelledby="next-title"><p className="editorial-kicker" id="next-title">From here, together.</p><ol><li><span>01</span><h2>The brief</h2><p>We get to know your story, audience and ambition.</p></li><li><span>02</span><h2>The conversation</h2><p>We discuss the creative direction, scope and timing.</p></li><li><span>03</span><h2>The plan</h2><p>We shape a production approach around your project.</p></li></ol></section>
    <div className="acknowledgement-footer"><Link href="/blog" data-cta>Inside the production process ↗</Link><Link href="/">Back to Hinton ↗</Link></div>
  </main></>;
}
