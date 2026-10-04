import { z } from "zod";
import { handle } from "@/lib/api";
import { guardSubmission } from "@/lib/submission-guard";
import { auditWebsite } from "@/lib/website-audit";
import { mailer, hasMailTransport } from "@/lib/mail";
import { randomUUID } from "node:crypto";
import { deliverViaFormSubmit, enquiryTo, enquiryCc } from "@/lib/form-delivery";
import { siteConfig } from "@/lib/site";
export const maxDuration = 60;
const schema = z.object({ website: z.url().max(2048), email: z.string().trim().max(254).pipe(z.email()), consent: z.literal(true) });
export const POST = handle(async req => {
  guardSubmission(req);
  const input = schema.parse(await req.json());
  const report = await auditWebsite(input.website);
  const eventId = randomUUID();
  let emailed = false;
  let leadReceived = false;
  if (!hasMailTransport()) {
    const delivery = await deliverViaFormSubmit({ email: input.email, source: "video_marketing_report", eventId,
      message: `Website: ${report.website}\n\n${report.recommendations.join("\n\n")}\n\n${report.limitation}\n\nThe visitor requested this report and agreed to enquiry follow-up.` });
    leadReceived = delivery.accepted;
  } else try {
    const { transport, from } = mailer();
    try {
      const delivery = await transport.sendMail({ from, to: enquiryTo, cc: enquiryCc, replyTo: input.email, subject: "Video marketing report requested", text: `Website: ${report.website}\nEmail: ${input.email}\nThe visitor requested a report and agreed to enquiry follow-up.` });
      leadReceived = Boolean(delivery.accepted?.length);
    } catch { console.error("[video-report] studio notification failed"); }
    try {
      const delivery = await transport.sendMail({ from, to: input.email, subject: "Your video marketing starter report — Hinton Studios", text: `${report.website}\n\n${report.recommendations.join("\n\n")}\n\n${report.limitation}\n\nExplore work: ${siteConfig.url}/work` });
      emailed = Boolean(delivery.accepted?.length);
    } catch { console.error("[video-report] visitor email failed"); }
  } catch { console.error("Video report email delivery unavailable or incomplete."); }
  return { report, emailed, leadReceived, eventId: leadReceived ? eventId : undefined };
});
