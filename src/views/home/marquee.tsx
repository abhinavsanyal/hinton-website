import { DriftingStrip } from "@/components/common/drifting-strip";
export interface MarqueeProps { items: string[] }
export function Marquee({ items }: MarqueeProps) {
  return <DriftingStrip label="Our services" direction="right" speed={29} className="services-drift">
    <ul className="services-drift-list">{items.map(item => <li key={item}><span>{item}</span><span className="services-drift-dot" aria-hidden="true" /></li>)}</ul>
  </DriftingStrip>;
}
