import Link from "next/link";
import { homeContent } from "@/data/mocks/home";
import { SiteHeader } from "@/views/home/site-header";
import { SeoFooter } from "@/views/home/seo-footer";
export function EditorialShell({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return <><SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} /><main id="main" className="editorial-main"><nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <span>{kicker}</span></nav><header className="editorial-heading"><p className="editorial-kicker">{kicker}</p><h1>{title}</h1></header>{children}</main><SeoFooter /></>;
}
