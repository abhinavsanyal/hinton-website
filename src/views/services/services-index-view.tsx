/**
 * `/services` — the capability hub. Primary internal-link distribution node:
 * it links down to all five service pages, each of which links back up.
 */
import Link from "next/link";
import { homeContent } from "@/data/mocks/home";
import { serviceCta, servicesContent, servicesIndex } from "@/data/mocks/services";
import { Inview } from "@/components/animation/springs/in-view";
import { FlareMedia } from "@/components/ui/flare-media";
import { SiteHeader } from "@/views/home/site-header";
import { ServiceCta } from "@/views/services/service-cta";
import { SeoFooter } from "@/views/home/seo-footer";

export const ServicesIndexView = () => (
  <>
    <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />

    <main id="main" className="bg-background px-[6vmin] pb-[10vmin] pt-[22vmin]">
      <div className="mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }}>
          <p className="mb-[3vmin] text-[1.4vmin] max-sm:text-[10px] font-medium uppercase tracking-[0.28em] text-white/55">
            {servicesIndex.eyebrow}
          </p>
          <h1 className="font-zen text-[8vw] max-sm:text-[13vw] font-extralight leading-[0.95] tracking-[-0.04em] text-white">
            {servicesIndex.heading}
          </h1>
          <p className="mt-[4vmin] max-w-[80ch] text-[2vmin] max-sm:text-base leading-relaxed text-white/65">
            {servicesIndex.lede}
          </p>
        </Inview>

        <ul className="mt-[10vmin] grid gap-[3vmin] md:grid-cols-2">
          {servicesContent.map((service, i) => (
            <Inview
              key={service.slug}
              tag="li"
              mode="once"
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={(i % 2) * 140}
              className="flex flex-col gap-[2.5vmin]"
            >
              <FlareMedia
                src={service.media[0]?.src}
                label={service.navLabel}
                meta={service.eyebrow}
                ratio={service.media[0]?.ratio}
              />
              <Link
                href={`/services/${service.slug}`}
                className="group flex flex-col gap-[1.2vmin] rounded-card border border-white/10 bg-white/[0.03] p-[3.5vmin] max-sm:p-6 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                <span className="text-[2.4vmin] max-sm:text-lg font-medium tracking-[-0.01em] text-white">
                  {service.navLabel}
                </span>
                <span className="text-[1.7vmin] max-sm:text-sm leading-relaxed text-white/55">{service.navBlurb}</span>
              </Link>
            </Inview>
          ))}
        </ul>
      </div>
    </main>

    <ServiceCta
      heading={serviceCta.heading}
      headingFaded={serviceCta.headingFaded}
      sub={serviceCta.sub}
      book={serviceCta.book}
      work={serviceCta.work}
    />
    <SeoFooter />
  </>
);
