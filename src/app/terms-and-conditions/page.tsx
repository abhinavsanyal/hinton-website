import { SiteHeader } from "@/views/home/site-header";
import { homeContent } from "@/data/mocks/home";
import { SeoFooter } from "@/views/home/seo-footer";

export const metadata = {
  alternates: { canonical: "/terms-and-conditions" },
  title: "Terms and Conditions — Hinton Studios",
  description: "Terms and conditions for Hinton Studios.",
};

export default function TermsAndConditions() {
  return (
    <>
      <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />

      <main className="min-h-screen bg-black text-white pt-32 sm:pt-[24vmin] pb-16 sm:pb-[10vmin] px-6 sm:px-[6vmin]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extralight tracking-[-0.02em] mb-8 sm:mb-12">Terms & Conditions</h1>

          <div className="space-y-6 text-white/70 leading-relaxed text-sm sm:text-base">
            <p>
              <strong>Effective Date:</strong> 23 September 2026
            </p>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">1. Introduction</h2>
              <p>Welcome to Hinton Studios. By accessing our website or engaging our services, you agree to be bound by these Terms and Conditions. Please read them carefully.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">2. Services Provided</h2>
              <p>Hinton Studios provides AI-driven video production, including TV commercials, brand films, micro-dramas, and animation services. Specific deliverables, timelines, and costs will be outlined in a separate Statement of Work (SOW) or production contract for each project.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">3. Intellectual Property</h2>
              <p>Unless otherwise agreed in writing, Hinton Studios retains the rights to all generated assets, working files, and underlying AI models. Upon full payment of the project invoice, the client is granted a license to use the final delivered video masters in accordance with the project contract.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">4. Payment Terms</h2>
              <p>Payment schedules will be detailed in the project SOW. Typically, a deposit is required to commence work, with the remaining balance due upon final delivery. Late payments may incur additional fees.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">5. Limitation of Liability</h2>
              <p>Hinton Studios shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or website. Our total liability is strictly limited to the amount paid by the client for the specific project in question.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">6. Revisions</h2>
              <p>Standard projects include a specific number of revision rounds, typically outlined at the animatic and final compositing stages. Additional revisions beyond the agreed scope will be billed at our standard hourly or day rates.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">7. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of India, with jurisdiction exclusively in the courts of Bengaluru, Karnataka.</p>
            </section>

            <p className="pt-8">
              For any questions regarding these terms, please contact us at <strong>abhinava@hintonstudios.com</strong>.
            </p>
          </div>
        </div>
      </main>

      <SeoFooter />
    </>
  );
}
