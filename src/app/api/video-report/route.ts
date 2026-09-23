import { z } from "zod";
import { handle } from "@/lib/api";
import { guardSubmission } from "@/lib/submission-guard";
import { auditWebsite } from "@/lib/website-audit";
import { mailer, studioRecipients } from "@/lib/mail";
import { siteConfig } from "@/lib/site";
const schema = z.object({ website: z.url().max(2048), email: z.email().max(254), consent: z.literal(true) });
export const POST = handle(async req => {
  guardSubmission(req);
  const input = schema.parse(await req.json());
  const report = await auditWebsite(input.website);
  let emailed = false;
  try {
    const { transport, from } = mailer();
    await transport.sendMail({ from, to: input.email, subject: "Your video marketing starter report — Hinton Studios", text: `${report.website}\n\n${report.recommendations.join("\n\n")}\n\n${report.limitation}\n\nExplore work: ${siteConfig.url}/work` });
    emailed = true;
    await transport.sendMail({ from, to: studioRecipients, replyTo: input.email, subject: "Video marketing report requested", text: `Website: ${report.website}\nEmail: ${input.email}\nThe visitor requested a report and agreed to enquiry follow-up.` });
  } catch { console.error("Video report email delivery unavailable or incomplete."); }
  return { report, emailed };
});
