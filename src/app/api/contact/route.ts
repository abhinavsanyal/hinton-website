import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { sendMetaLead } from "@/lib/meta-conversions";
import { z } from "zod";
import { handle } from "@/lib/api";
import { mailer, studioRecipients } from "@/lib/mail";
import { siteConfig } from "@/lib/site";
import { guardSubmission } from "@/lib/submission-guard";

const schema = z.object({ marketingConsent: z.boolean().default(false), name: z.string().trim().max(100).optional(), email: z.email().max(254), message: z.string().trim().min(1).max(2000), website: z.string().max(0).optional() });
export const POST = handle(async (req) => {
  guardSubmission(req);
  const input = schema.parse(await req.json());
  const { transport, from } = mailer();
  await transport.sendMail({ from, to: studioRecipients, replyTo: input.email, subject: "New Hinton website enquiry", text: `Name: ${input.name || "Not provided"}\nEmail: ${input.email}\n\n${input.message}` });
  // A confirmation failure must not invite a duplicate lead submission.
  let confirmationSent = true;
  try {
    await transport.sendMail({ from, to: input.email, replyTo: "abhinava@hintonstudios.com", subject: "We received your message — Hinton Studios", html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><h1>Thank you for contacting Hinton Studios.</h1><p>Your enquiry has reached our team. We will follow up with you.</p><h2>While you wait, explore our work</h2><a href="${siteConfig.url}/work"><img src="${siteConfig.url}/assets/posters/tata1mg-2026.jpg" alt="Tata 1mg film sample" width="260" /><p>Tata 1mg — commercial film</p></a><a href="${siteConfig.url}/work"><img src="${siteConfig.url}/assets/posters/kookie-2026.jpg" alt="Kookie and Kandy animation sample" width="260" /><p>Kookie &amp; Kandy — animation</p></a><p><a href="${siteConfig.url}/work">Explore more Hinton films</a></p><p>Hinton Studios · Bengaluru, India</p></div>`, text: `Hello ${input.name || "there"},\n\nThank you for contacting Hinton Studios. Our team has received your enquiry and will follow up.\n\nWhile you wait, explore Tata 1mg, Kookie & Kandy and our other TVCs, product films and animation:\n${siteConfig.url}/work\n\nDiscover our production services:\n${siteConfig.url}/services\n\nHinton Studios\nBengaluru, India` });
  } catch { confirmationSent = false; console.error("Contact received; confirmation email delivery failed."); }
  const eventId = randomUUID();
  if (input.marketingConsent) after(() => sendMetaLead(input.email, eventId, "/"));
  return { received: true, confirmationSent, eventId };
});
