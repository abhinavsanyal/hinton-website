import { Inview } from "@/components/animation/springs/in-view";
import type { ServiceStat } from "@/data/mocks/services";

export interface ServiceNarrativeProps {
  heading: string;
  body: string[];
  stats: ServiceStat[];
}

/** Answer-first prose block plus the fact-density strip AI answer engines quote. */
export const ServiceNarrative = ({ heading, body, stats }: ServiceNarrativeProps) => (
  <section aria-labelledby="service-narrative" className="relative z-[2] bg-background px-[6vmin] py-[14vmin]">
    <div className="mx-auto grid max-w-[1400px] gap-[8vmin] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Inview mode="once" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }}>
        <h2
          id="service-narrative"
          className="font-zen text-[5vmin] max-sm:text-3xl font-extralight leading-[1.05] tracking-[-0.03em] text-white"
        >
          {heading}
        </h2>
      </Inview>

      <div className="flex flex-col gap-[3vmin]">
        {body.map((paragraph, i) => (
          <Inview key={paragraph.slice(0, 24)} mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }} delayIn={i * 120}>
            <p className="text-[2vmin] max-sm:text-base leading-relaxed text-white/70">{paragraph}</p>
          </Inview>
        ))}
      </div>
    </div>

    <Inview
      mode="once"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
      delayIn={200}
      className="mx-auto mt-[10vmin] max-w-[1400px]"
    >
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-[1.2vmin] bg-background p-[4vmin] max-sm:p-6">
            <dt className="order-2 text-[1.2vmin] max-sm:text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
              {stat.label}
            </dt>
            <dd className="order-1 font-zen text-[4vmin] max-sm:text-2xl font-extralight tracking-[-0.03em] text-white">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </Inview>
  </section>
);
