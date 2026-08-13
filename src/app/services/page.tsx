import type { Metadata } from "next";

import { servicesIndex } from "@/data/mocks/services";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { ServicesIndexView } from "@/views/services/services-index-view";

export const metadata: Metadata = buildMetadata({
  title: servicesIndex.metaTitle,
  description: servicesIndex.metaDescription,
  url: "/services",
});

export default function ServicesPage() {
  return <ServicesIndexView />;
}
