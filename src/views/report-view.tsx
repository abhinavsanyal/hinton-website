import { EditorialShell } from "@/views/editorial";
import { ReportForm } from "@/views/report-form";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
export const metadata = generateMetadata({ title: "Free Video Marketing Website Review", description: "Get a basic homepage review and practical starting points for your brand’s video marketing from Hinton Studios.", url: "/video-marketing-report" });
export default function ReportView() { return <EditorialShell title="Your next video starts here." kicker="Free website review"><p className="editorial-lede">Share your website for a basic review of its homepage and practical video ideas. The report checks publicly available HTML; it does not measure rankings or predict growth.</p><ReportForm /></EditorialShell>; }
