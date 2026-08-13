import { Inview } from "@/components/animation/springs/in-view";
import { FlareMedia } from "@/components/ui/flare-media";
import type { ServiceMedia } from "@/data/mocks/services";

export interface ServiceMediaWallProps {
  heading: string;
  media: ServiceMedia[];
}

export const ServiceMediaWall = ({ heading, media }: ServiceMediaWallProps) => {
  const portrait = media.some((item) => item.ratio === "portrait");

  return (
    <section aria-labelledby="service-media" className="relative z-[2] bg-background px-[6vmin] pb-[14vmin]">
      <div className="mx-auto max-w-[1400px]">
        <Inview mode="once" from={{ opacity: 0, y: 30 }} to={{ opacity: 1, y: 0 }}>
          <h2
            id="service-media"
            className="mb-[6vmin] font-zen text-[5vmin] max-sm:text-3xl font-extralight leading-[1.05] tracking-[-0.03em] text-white"
          >
            {heading}
          </h2>
        </Inview>

        <ul className={`grid gap-[3vmin] ${portrait ? "grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2"}`}>
          {media.map((item, i) => (
            <Inview
              key={`${item.label}-${i}`}
              tag="li"
              mode="once"
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              delayIn={(i % 2) * 140}
            >
              <FlareMedia src={item.src} label={item.label} meta={item.meta} ratio={item.ratio} />
            </Inview>
          ))}
        </ul>
      </div>
    </section>
  );
};
