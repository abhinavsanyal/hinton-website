import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getServiceBySlug, servicesContent } from "@/data/mocks/services";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { ServiceView } from "@/views/services/service-view";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

/** The service set is fixed, so anything off the list must hard-404 rather than
 *  render an on-demand soft-404 the crawler would index. */
export const dynamicParams = false;

export function generateStaticParams() {
  return servicesContent.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) return {};

  return buildMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    url: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) notFound();

  return <ServiceView service={service} />;
}
