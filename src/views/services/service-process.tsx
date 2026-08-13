import { Inview } from "@/components/animation/springs/in-view";
import type { ServiceDeliverable, ServicePipelineStep } from "@/data/mocks/services";

export interface ServiceProcessProps {
  pipelineHeading: string;
  pipeline: ServicePipelineStep[];
  deliverablesHeading: string;
  deliverables: ServiceDeliverable[];
}

export const ServiceProcess = ({
  pipelineHeading,
  pipeline,
  deliverablesHeading,
  deliverables,
}: ServiceProcessProps) => (
  <>
    <section aria-labelledby="service-pipeline" className="relative z-[2] bg-background px-[6vmin] pb-[14vmin]">
      <div className="mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
          <h2
            id="service-pipeline"
            className="mb-[6vmin] font-zen text-[5vmin] max-sm:text-3xl font-extralight leading-[1.05] tracking-[-0.03em] text-white"
          >
            {pipelineHeading}
          </h2>
        </Inview>

        <ol className="grid gap-[2vmin] [perspective:1200px] md:grid-cols-2 lg:grid-cols-3">
          {pipeline.map((step, i) => (
            <Inview
              key={step.title}
              tag="li"
              mode="once"
              from={{ opacity: 0, transform: "translateY(50px) rotateX(-12deg)" }}
              to={{ opacity: 1, transform: "translateY(0px) rotateX(0deg)" }}
              delayIn={(i % 3) * 120}
              className="flex flex-col gap-[1.6vmin] rounded-card border border-white/10 bg-white/[0.03] p-[4vmin] max-sm:p-6 backdrop-blur-sm"
            >
              <span className="font-zen text-[3.2vmin] max-sm:text-xl font-extralight tabular-nums text-white/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[2.4vmin] max-sm:text-lg font-medium leading-tight tracking-[-0.01em] text-white">
                {step.title}
              </h3>
              <p className="text-[1.7vmin] max-sm:text-sm leading-relaxed text-white/60">{step.body}</p>
            </Inview>
          ))}
        </ol>
      </div>
    </section>

    <section aria-labelledby="service-deliverables" className="relative z-[2] bg-background px-[6vmin] pb-[14vmin]">
      <div className="mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
          <h2
            id="service-deliverables"
            className="mb-[6vmin] font-zen text-[5vmin] max-sm:text-3xl font-extralight leading-[1.05] tracking-[-0.03em] text-white"
          >
            {deliverablesHeading}
          </h2>
        </Inview>

        <dl className="grid gap-px overflow-hidden rounded-card border border-white/10 bg-white/10 md:grid-cols-2">
          {deliverables.map((item, i) => (
            <Inview
              key={item.title}
              mode="once"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={(i % 2) * 120}
              className="flex flex-col gap-[1.4vmin] bg-background p-[4vmin] max-sm:p-6"
            >
              <dt className="text-[2.2vmin] max-sm:text-base font-medium tracking-[-0.01em] text-white">{item.title}</dt>
              <dd className="text-[1.7vmin] max-sm:text-sm leading-relaxed text-white/60">{item.body}</dd>
            </Inview>
          ))}
        </dl>
      </div>
    </section>
  </>
);
