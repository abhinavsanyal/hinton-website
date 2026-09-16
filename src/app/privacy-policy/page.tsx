import { SiteHeader } from "@/views/home/site-header";
import { homeContent } from "@/data/mocks/home";
import { SeoFooter } from "@/views/home/seo-footer";

export const metadata = {
  title: "Privacy Policy — Hinton Studios",
  description: "Privacy policy for Hinton Studios.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <SiteHeader nav={homeContent.nav} logo={homeContent.logo} cta={homeContent.headerCta} awaitLoader={false} />
      
      <main className="min-h-screen bg-black text-white pt-32 sm:pt-[24vmin] pb-16 sm:pb-[10vmin] px-6 sm:px-[6vmin]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extralight tracking-[-0.02em] mb-8 sm:mb-12">Privacy Policy</h1>
          
          <div className="space-y-6 text-white/70 leading-relaxed text-sm sm:text-base">
            <p>
              <strong>Effective Date:</strong> [Date]
            </p>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">1. Information We Collect</h2>
              <p>We may collect personal information such as your name, email address, phone number, and company details when you submit an inquiry through our contact form or book a call via our scheduling link. We also automatically collect certain technical information (like IP addresses and browser types) to ensure our website functions correctly and to analyze site traffic.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">2. How We Use Your Information</h2>
              <p>The information we collect is strictly used to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2">
                <li>Respond to your inquiries and provide requested services.</li>
                <li>Communicate with you regarding ongoing projects.</li>
                <li>Improve our website&apos;s performance and user experience.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">3. Sharing Your Information</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share data with trusted third-party service providers (such as hosting partners or our CRM platform) solely for the purpose of operating our business, provided those parties agree to keep this information confidential.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">4. Data Security</h2>
              <p>We implement standard security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">5. Third-Party Links</h2>
              <p>Our website may contain links to external sites (such as LinkedIn, YouTube, or Instagram). We are not responsible for the privacy practices or the content of these third-party websites.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">6. Your Rights</h2>
              <p>Depending on your location, you may have the right to request access to, correction of, or deletion of your personal data. If you wish to exercise these rights, please contact us using the information below.</p>
            </section>

            <section>
              <h2 className="text-white text-xl mt-8 mb-4 font-medium">7. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices. We encourage you to review this page periodically.</p>
            </section>

            <p className="pt-8">
              For any privacy-related questions, please contact us at <strong>abhinava@hintonstudios.com</strong>.
            </p>
          </div>
        </div>
      </main>
      
      <SeoFooter />
    </>
  );
}
