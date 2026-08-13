/**
 * Shared layout for every `/services/<slug>` page. A Server Component that
 * composes the fixed nav, the pinned 3D-camera hero and the SEO-bearing
 * sections below it; motion lives in the client leaves.
 */
import Link from "next/link";
import { homeContent } from "@/data/mocks/home";
import {
  serviceCta,
  serviceSections,
  servicesContent,
  type ServiceContent,
} from "@/data/mocks/services";
import { getServiceStructuredData } from "@/utils/seo/structured-data";
import { SiteHeader } from "@/views/home/site-header";
import { ServiceHero } from "@/views/services/service-hero";
import { ServiceNarrative } from "@/views/services/service-narrative";
import { ServiceMediaWall } from "@/views/services/service-media-wall";
import { ServiceProcess } from "@/views/services/service-process";
import { ServiceFaqSection } from "@/views/services/service-faq";
import { ServiceCta } from "@/views/services/service-cta";
import { SeoFooter } from "@/views/home/seo-footer";

export interface ServiceViewProps {
  service: ServiceContent;
}

export const ServiceView = ({ service }: ServiceViewProps) => {
  const related = service.related
    .map((slug) => servicesContent.find((item) => item.slug === slug))
    .filter((item): item is ServiceContent => Boolean(item))
    .map(({ slug, navLabel, navBlurb }) => ({ slug, navLabel, navBlurb }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getServiceStructuredData(service)) }}
      />

      <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />

      <main id="main" className="bg-background">
        <ServiceHero
          eyebrow={service.eyebrow}
          headingLines={service.headingLines}
          lede={service.lede}
          plates={service.deliverables.map((item) => item.title)}
        />

        <nav aria-label="Breadcrumb" className="relative z-[2] bg-background px-[6vmin] pt-[8vmin]">
          <ol className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 text-[1.3vmin] max-sm:text-[11px] uppercase tracking-[0.2em] text-white/40">
            <li>
              <Link href="/" className="hover:text-white/80">
                {serviceSections.breadcrumb.home}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/services" className="hover:text-white/80">
                {serviceSections.breadcrumb.services}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white/70">
              {service.navLabel}
            </li>
          </ol>
        </nav>

        <ServiceNarrative heading={service.intro.heading} body={service.intro.body} stats={service.stats} />
        <ServiceMediaWall heading={serviceSections.media} media={service.media} />
        <ServiceProcess
          pipelineHeading={serviceSections.pipeline}
          pipeline={service.pipeline}
          deliverablesHeading={serviceSections.deliverables}
          deliverables={service.deliverables}
        />
        <ServiceFaqSection
          heading={serviceSections.faq}
          faqs={service.faqs}
          relatedHeading={serviceSections.related}
          related={related}
        />
        <ServiceCta
          heading={serviceCta.heading}
          headingFaded={serviceCta.headingFaded}
          sub={serviceCta.sub}
          book={serviceCta.book}
          work={serviceCta.work}
        />
        <SeoFooter />
      </main>
    </>
  );
};
