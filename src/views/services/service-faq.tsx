import Link from "next/link";
import { Inview } from "@/components/animation/springs/in-view";
import type { ServiceContent, ServiceFaq } from "@/data/mocks/services";

export interface ServiceFaqSectionProps {
  heading: string;
  faqs: ServiceFaq[];
  relatedHeading: string;
  related: Pick<ServiceContent, "slug" | "navLabel" | "navBlurb">[];
}

/**
 * Answers stay visible rather than collapsing behind an accordion — hidden text
 * is not reliably extracted by AI answer engines and reads as cloaking.
 */
export const ServiceFaqSection = ({ heading, faqs, relatedHeading, related }: ServiceFaqSectionProps) => (
  <>
    <section aria-labelledby="service-faq" className="relative z-[2] bg-background px-[6vmin] pb-[14vmin]">
      <div className="mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
          <h2
            id="service-faq"
            className="mb-[6vmin] font-zen text-[5vmin] max-sm:text-3xl font-extralight leading-[1.05] tracking-[-0.03em] text-white"
          >
            {heading}
          </h2>
        </Inview>

        <dl className="flex flex-col gap-[2vmin]">
          {faqs.map((faq, i) => (
            <Inview
              key={faq.question}
              mode="once"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={i * 90}
              className="grid gap-[2vmin] rounded-card border border-white/10 bg-white/[0.03] p-[4vmin] max-sm:p-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"
            >
              <dt className="text-[2.2vmin] max-sm:text-base font-medium leading-snug tracking-[-0.01em] text-white">
                {faq.question}
              </dt>
              <dd className="text-[1.8vmin] max-sm:text-sm leading-relaxed text-white/60">{faq.answer}</dd>
            </Inview>
          ))}
        </dl>
      </div>
    </section>

    <section aria-labelledby="service-related" className="relative z-[2] bg-background px-[6vmin] pb-[14vmin]">
      <div className="mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
          <h2
            id="service-related"
            className="mb-[5vmin] font-zen text-[3.4vmin] max-sm:text-xl font-extralight tracking-[-0.02em] text-white/70"
          >
            {relatedHeading}
          </h2>
        </Inview>

        <ul className="grid gap-[2vmin] md:grid-cols-3">
          {related.map((item, i) => (
            <Inview
              key={item.slug}
              tag="li"
              mode="once"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={i * 110}
            >
              <Link
                href={`/services/${item.slug}`}
                className="flex h-full flex-col gap-[1.4vmin] rounded-card border border-white/10 bg-white/[0.03] p-[4vmin] max-sm:p-6 hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                <span className="text-[2.2vmin] max-sm:text-base font-medium tracking-[-0.01em] text-white">
                  {item.navLabel}
                </span>
                <span className="text-[1.6vmin] max-sm:text-sm leading-relaxed text-white/55">{item.navBlurb}</span>
              </Link>
            </Inview>
          ))}
        </ul>
      </div>
    </section>
  </>
);
