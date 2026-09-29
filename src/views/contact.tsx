import { EditorialShell } from "@/components/blog/editorial-shell";
import { EnquiryForm } from "@/components/contact/enquiry-form";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { siteConfig } from "@/lib/site";
import { WHATSAPP_CONTACT_URL } from "@/lib/whatsapp";
export const metadata = generateMetadata({ title: "Start an AI Film or Advertising Project", description: "Brief Hinton Studios on your AI commercial, brand film, feature film or animation project. Speak with our Bengaluru studio about scope, timing and production.", url: "/contact" });
export default function ContactView() {
  return <EditorialShell title="A few lines. A world of possibilities." kicker="Contact the studio"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ContactPage", url: `${siteConfig.url}/contact`, name: "Contact Hinton Studios", mainEntity: { "@id": `${siteConfig.url}/#organization` } }) }} /><div className="brief-layout"><div><p className="editorial-lede">A campaign, a feature film, a story waiting to happen. Tell us what you have in mind.</p><p>No polished pitch needed. An idea, your audience and a rough timeline are enough to begin.</p><div className="action-row"><a className="quiet-button" href={WHATSAPP_CONTACT_URL} target="_blank" rel="noopener noreferrer">WhatsApp ↗</a><a className="quiet-button" href="tel:+919330226381">Call the studio ↗</a></div></div><EnquiryForm method="contact_form" /></div></EditorialShell>;
}
