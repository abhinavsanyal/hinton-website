import { randomUUID } from "node:crypto";
import { after, NextResponse } from "next/server";
import { RECEIPT_COOKIE } from "@/lib/enquiry-receipt";
import { sendMetaLead } from "@/lib/meta-conversions";
import { z } from "zod";
import { ApiError, handle } from "@/lib/api";
import { mailer, hasSmtp } from "@/lib/mail";
import { deliverViaFormSubmit, enquiryTo, enquiryCc } from "@/lib/form-delivery";
import { siteConfig } from "@/lib/site";
import { guardSubmission } from "@/lib/submission-guard";

export const maxDuration = 60;
const schema = z.object({ source: z.enum(["contact_form", "contact_modal", "project_brief"]).default("contact_form"), marketingConsent: z.boolean().default(false), name: z.string().trim().max(100).optional(), email: z.string().trim().max(254).pipe(z.email()), message: z.string().trim().min(1).max(2000), website: z.string().max(0).optional() });
export const POST = handle(async (req) => {
  guardSubmission(req);
  const input = schema.parse(await req.json());
  const eventId = randomUUID();
  let confirmationSent = false;
  if (!hasSmtp()) {
    const result = await deliverViaFormSubmit({ ...input, eventId });
    if (!result.accepted) {
      console.error("[contact] delivery rejected", { eventId, reason: result.reason });
      throw new ApiError(result.reason === "activation_required" ? 503 : 502, result.reason,
        "We couldn’t confirm email delivery. Your message is still here. Please contact us directly below.");
    }
  } else {
    const { transport, from } = mailer();
    try {
      const delivery = await transport.sendMail({ from, to: enquiryTo, cc: enquiryCc, replyTo: input.email, subject: "New Hinton website enquiry", text: `Reference: ${eventId}\nSource: ${input.source}\nName: ${input.name || "Not provided"}\nEmail: ${input.email}\n\n${input.message}` });
      if (!delivery.accepted?.length) throw new Error("No studio recipient accepted");
      console.info("[contact] studio delivery accepted", { eventId, source: input.source });
    } catch {
      console.error("[contact] studio delivery failed", { eventId, source: input.source });
      throw new ApiError(502, "delivery_failed", "We couldn’t deliver your enquiry. Please try again or contact the studio directly.");
    }
    // A confirmation failure must not invite a duplicate lead submission.
    confirmationSent = true;
    try {
      const confirmation = await transport.sendMail({ from, to: input.email, replyTo: "abhinava@hintonstudios.com", subject: "We received your message — Hinton Studios", html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto"><h1>Thank you for contacting Hinton Studios.</h1><p>Your enquiry has reached our team. We will follow up with you.</p><h2>While you wait, explore our work</h2><a href="${siteConfig.url}/work"><img src="${siteConfig.url}/assets/posters/tata1mg-2026.jpg" alt="Tata 1mg film sample" width="260" /><p>Tata 1mg — commercial film</p></a><a href="${siteConfig.url}/work"><img src="${siteConfig.url}/assets/posters/kookie-2026.jpg" alt="Kookie and Kandy animation sample" width="260" /><p>Kookie &amp; Kandy — animation</p></a><p><a href="${siteConfig.url}/work">Explore more Hinton films</a></p><p>Hinton Studios · Bengaluru, India</p></div>`, text: `Hello ${input.name || "there"},\n\nThank you for contacting Hinton Studios. Our team has received your enquiry and will follow up.\n\nWhile you wait, explore Tata 1mg, Kookie & Kandy and our other TVCs, product films and animation:\n${siteConfig.url}/work\n\nDiscover our production services:\n${siteConfig.url}/services\n\nHinton Studios\nBengaluru, India` });
      confirmationSent = Boolean(confirmation.accepted?.length);
    } catch { confirmationSent = false; console.error("Contact received; confirmation email delivery failed."); }
  }
  if (input.marketingConsent) after(() => sendMetaLead(input.email, eventId, "/"));
  const response = NextResponse.json({ data: { received: true, confirmationSent, eventId } });
  response.headers.set("Cache-Control", "no-store");
  response.cookies.set(RECEIPT_COOKIE, JSON.stringify({ eventId, confirmationSent, createdAt: Date.now() }), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/thank-you", maxAge: 3600 });
  return response;
});
