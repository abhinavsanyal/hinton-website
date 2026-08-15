import type { Metadata } from "next";
import { SiteMapView } from "@/views/site-map/site-map-view";

export const metadata: Metadata = {
  title: "Site Map — Hinton Studios",
  description: "A complete index of all pages and services at Hinton Studios.",
};

export default function SiteMapPage() {
  return <SiteMapView />;
}
