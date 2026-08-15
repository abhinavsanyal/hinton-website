"use client";

import Link from "next/link";
import { Inview } from "@/components/animation/springs/in-view";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { servicesContent } from "@/data/mocks/services";

export const SiteMapView = () => {
  return (
    <>
      <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />

      <main className="min-h-screen bg-black text-white pt-[24vmin] pb-[8vmin] px-[4vmin] overflow-hidden relative">
        {/* Background ambient layer */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg viewBox=%220 0 512 512%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%221.2%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')",
              backgroundSize: "256px 256px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          {/* Header section */}
          <section className="mb-[8vmin]">
            <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} delayIn={200}>
              <h1 className="text-[10vw] md:text-[6vw] font-extralight tracking-[-0.03em] leading-[0.95] mb-[4vmin] font-zen">
                Site Map
              </h1>
            </Inview>
          </section>

          {/* Links Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-[6vmin]">
            {/* Primary Routes */}
            <Inview
              mode="once"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={300}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-[20px] font-medium tracking-widest uppercase text-white/50 mb-6 border-b border-white/10 pb-4">
                  Primary Pages
                </h2>
                <ul className="flex flex-col gap-4">
                  <li>
                    <Link
                      href="/"
                      className="text-[24px] font-light text-white/90 hover:text-white transition-colors hover:translate-x-2 inline-block transform duration-300"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/services"
                      className="text-[24px] font-light text-white/90 hover:text-white transition-colors hover:translate-x-2 inline-block transform duration-300"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/work"
                      className="text-[24px] font-light text-white/90 hover:text-white transition-colors hover:translate-x-2 inline-block transform duration-300"
                    >
                      Our Work
                    </Link>
                  </li>
                </ul>
              </div>
            </Inview>

            {/* Service Capabilities */}
            <Inview
              mode="once"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={400}
              className="flex flex-col gap-6"
            >
              <div>
                <h2 className="text-[20px] font-medium tracking-widest uppercase text-white/50 mb-6 border-b border-white/10 pb-4">
                  Capabilities
                </h2>
                <ul className="flex flex-col gap-4">
                  {servicesContent.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-[24px] font-light text-white/90 hover:text-white transition-colors hover:translate-x-2 inline-block transform duration-300"
                      >
                        {service.navLabel}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Inview>
          </section>
        </div>
      </main>
    </>
  );
};
