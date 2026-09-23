import Link from "next/link";
import { servicesContent } from "@/data/mocks/services";
export const SeoCapabilities = () => (
  <section className="editorial-section" aria-labelledby="capabilities-title">
    <p className="editorial-kicker">Human direction. New possibilities.</p>
    <h2 id="capabilities-title">One studio. Every screen.</h2>
    <div className="editorial-grid">{servicesContent.map((service) => <Link className="editorial-card" href={`/services/${service.slug}`} key={service.slug}><h3>{service.navLabel} ↗</h3><p>{service.navBlurb}</p></Link>)}</div>
  </section>
);
