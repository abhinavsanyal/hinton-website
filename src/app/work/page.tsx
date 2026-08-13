import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { WorkView } from "@/views/work/work-view";
import { workVideos } from "@/data/mocks/work";

export const metadata = generateMetadata({
  title: "Our Work | Hinton Studios",
  description: "Explore the portfolio of AI-generated TVCs and films produced by Hinton Studios.",
});

export default function WorkPage() {
  return <WorkView initialVideos={workVideos} />;
}
