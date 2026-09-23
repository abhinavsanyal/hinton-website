import { socialLinks } from "@/data/social-links";
import { siteConfig } from "@/lib/site";
import type { ServiceContent } from "@/data/mocks/services";

/**
 * Per-service graph: `Service` (tied to the Organization entity), the page's
 * `FAQPage`, a `HowTo` built from the pipeline, and the breadcrumb trail.
 */
export function getServiceStructuredData(service: ServiceContent) {
  const url = `${siteConfig.url}/services/${service.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.navLabel,
        serviceType: service.eyebrow,
        description: service.metaDescription,
        url,
        provider: { "@id": `${siteConfig.url}/#organization` },
        areaServed: ["India", "United Arab Emirates", "United States", "United Kingdom", "Singapore"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: service.navLabel,
          itemListElement: service.deliverables.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item.title, description: item.body },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "HowTo",
        "@id": `${url}#howto`,
        name: `How ${service.navLabel} works at Hinton Studios`,
        step: service.pipeline.map((step, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: step.title,
          text: step.body,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${siteConfig.url}/services` },
          { "@type": "ListItem", position: 3, name: service.navLabel, item: url },
        ],
      },
    ],
  };
}

export function getSiteStructuredData() {
  const canonicalEntityString = "Hinton Studios — AI filmmaking and AI video production studio based in Bengaluru, India.";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": `${siteConfig.url}/#organization`,
        name: "Hinton Studios",
        alternateName: "Hinton Studios AI",
        description: canonicalEntityString,
        url: siteConfig.url,
        logo: `${siteConfig.url}/assets/brand/hinton-studios-logo.png`,
        email: "abhinava@hintonstudios.com",
        telephone: "+919330226381",
        address: {
          "@type": "PostalAddress",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        },
        sameAs: socialLinks.map(social => social.href)
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };
}
