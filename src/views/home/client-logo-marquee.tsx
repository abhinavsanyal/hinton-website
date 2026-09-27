import Image from "next/image";
import { clients } from "@/data/clients";
import { DriftingStrip } from "@/components/common/drifting-strip";
export function ClientLogoMarquee() {
  return <DriftingStrip label="Our clients" speed={18} className="client-marquee">
    <ul className="client-marquee-group">{clients.map(client => <li key={client.name} className="client-marquee-cell">
      <Image src={client.src} alt={client.name} width={180} height={60} unoptimized className={`client-marquee-logo${client.invert ? " client-marquee-logo-invert" : ""}${client.name === "Dialflo" ? " client-marquee-logo-round" : ""}`} />
    </li>)}</ul>
  </DriftingStrip>;
}
