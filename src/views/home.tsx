/**
 * Home view — clean, flat landing page. No intro loader, no 3D.
 * Server Component composing the header, main sections, and SEO blocks.
 */
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
    <main>
      <ShowreelStage content={homeContent} />
      <SeoCapabilities />
      <SeoHowTo />
      <SeoFaq />
      <SeoFooter />
    </main>
  </>
);
