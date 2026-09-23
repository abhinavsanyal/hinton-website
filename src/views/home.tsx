/**
 * Home view — clean, flat landing page. No intro loader, no 3D.
 * Server Component composing the header, main sections, and SEO blocks.
 */
import { ProjectPlanner } from "@/views/home/project-planner";
import { StartingPoints } from "@/views/home/starting-points";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { ShowreelStage } from "@/views/home/showreel-stage";
import { SeoCapabilities } from "@/views/home/seo-capabilities";
import { SeoHowTo } from "@/views/home/seo-how-to";
import { SeoFaq } from "@/views/home/seo-faq";
import { SeoFooter } from "@/views/home/seo-footer";

export const HomeView = () => (
  <>
    <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />
    <main id="main">
      <ShowreelStage content={homeContent} />
      {/* Client logos temporarily hidden at the owner’s request. Restore ClientStrip here when ready. */}
      <ProjectPlanner />
      <SeoCapabilities />
      <SeoHowTo />
      <SeoFaq />
      <StartingPoints />
    </main>
    <SeoFooter />
  </>
);
