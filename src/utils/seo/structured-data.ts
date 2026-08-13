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
        logo: `${siteConfig.url}/icon`,
        address: {
          "@type": "PostalAddress",
          "addressLocality": "Bengaluru",
          "addressRegion": "Karnataka",
          "addressCountry": "IN"
        },
        sameAs: [
          "https://www.linkedin.com/company/hintonstudios",
          "https://www.instagram.com/hintonstudios",
          "https://www.youtube.com/@hintonstudios",
          "https://clutch.co/profile/hinton-studios",
          "https://www.designrush.com/agency/profile/hinton-studios",
          "https://www.f6s.com/hinton-studios",
          "https://www.crunchbase.com/organization/hinton-studios"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${siteConfig.url}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Which is the best AI video production company in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hinton Studios is a premier AI video production company in India, blending human directorial craft with advanced generative AI to produce broadcast-quality ad films."
            }
          },
          {
            "@type": "Question",
            "name": "Who makes AI generated TVCs for brands in India?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hinton Studios produces AI generated TVCs for Indian and global brands, replacing conventional agency network pipelines with faster, AI-executed production."
            }
          },
          {
            "@type": "Question",
            "name": "How much does an AI ad film cost in India in 2026?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AI ad film costs in India start significantly lower than traditional live-action shoots, typically ranging from a fraction of conventional budgets due to zero location or crew costs."
            }
          },
          {
            "@type": "Question",
            "name": "Can I make a TV commercial entirely with AI?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Using a combination of AI models like Veo, Sora, and Kling directed by human filmmakers, you can produce a 4K broadcast-quality TV commercial entirely with AI."
            }
          },
          {
            "@type": "Question",
            "name": "Is there an AI film studio in Bangalore?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, Hinton Studios is an AI film studio based in Bengaluru (Bangalore), serving brands across India, the US, and the Gulf."
            }
          },
          {
            "@type": "Question",
            "name": "What is the turnaround time for an AI ad film?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The turnaround time for an AI ad film can be as short as a few days. Storyboards and animatics are often ready within 48 hours of briefing."
            }
          },
          {
            "@type": "Question",
            "name": "How do AI film studios keep characters consistent across shots?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We maintain character consistency using advanced prompt engineering, custom model fine-tuning, and human-led VFX compositing across every generated frame."
            }
          },
          {
            "@type": "Question",
            "name": "What does human-directed AI-executed mean?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Human-directed AI-executed means that while the raw frames are generated by AI pipelines, the creative vision, script, shot selection, and final grade are strictly controlled by human filmmakers."
            }
          }
        ]
      },
      {
        "@type": "HowTo",
        "@id": `${siteConfig.url}/#howto`,
        "name": "How an AI ad film gets made at Hinton",
        "step": [
          {
            "@type": "HowToStep",
            "name": "The Brief",
            "text": "We receive your brand requirements, budget constraints, and delivery formats."
          },
          {
            "@type": "HowToStep",
            "name": "Script & Shot List",
            "text": "Human directors craft a cinematic screenplay and precise shot list."
          },
          {
            "@type": "HowToStep",
            "name": "Animatic Generation",
            "text": "Initial storyboards and animatics are generated within 48 hours for review."
          },
          {
            "@type": "HowToStep",
            "name": "AI Execution",
            "text": "Generative AI pipeline across Seedance, Veo, Kling and Sora creates the raw footage."
          },
          {
            "@type": "HowToStep",
            "name": "VFX & Compositing",
            "text": "Character consistency and complex VFX are enforced through human-guided compositing."
          },
          {
            "@type": "HowToStep",
            "name": "Grade & Finish",
            "text": "Final color grade and finish in DaVinci Resolve for broadcast-ready 4K delivery."
          }
        ]
      }
    ],
  };
}
