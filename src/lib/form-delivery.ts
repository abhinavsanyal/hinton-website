/** Server-side FormSubmit gateway. Recipients are fixed, never supplied by visitors. */
export const enquiryTo = "abhinava@hintonstudios.com";
export const enquiryCc = "souvik@hintonstudios.com,avkash@hintonstudios.com";
export type StudioEnquiry = { name?: string; email: string; message: string; source: string; eventId: string };
export type DeliveryResult = { accepted: true } | { accepted: false; reason: "activation_required" | "delivery_failed" };

export async function deliverViaFormSubmit(input: StudioEnquiry, request: typeof fetch = fetch): Promise<DeliveryResult> {
  try {
    const response = await request(`https://formsubmit.co/ajax/${enquiryTo}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", Referer: "https://www.hintonstudios.com/contact" },
      body: JSON.stringify({
        name: input.name || "Not provided", email: input.email,
        "Enquiry details": input.message, "Submitted from": input.source,
        "Reference": input.eventId, "Received at (UTC)": new Date().toISOString(),
        _subject: "New project enquiry — Hinton Studios", _cc: enquiryCc,
        _replyto: input.email, _template: "table", _captcha: "false",
        _url: "https://www.hintonstudios.com/contact",
      }),
      signal: AbortSignal.timeout(20000), cache: "no-store",
    });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.includes("application/json")) {
      // Never log upstream bodies: they can echo the visitor's personal details.
      console.error("[form-delivery] gateway response rejected", { status: response.status, contentType });
      return { accepted: false, reason: "delivery_failed" };
    }
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") return { accepted: false, reason: "delivery_failed" };
    const body = result as Record<string, unknown>;
    // FormSubmit returns string booleans. Never treat the string "false" as success.
    if (response.ok && (body.success === true || body.success === "true")) return { accepted: true };
    const activation = typeof body.message === "string" && /needs activation/i.test(body.message);
    return { accepted: false, reason: activation ? "activation_required" : "delivery_failed" };
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? error.cause : undefined;
    const code = cause && typeof cause === "object" && "code" in cause ? String(cause.code) : undefined;
    console.error("[form-delivery] gateway request failed", { type: error instanceof Error ? error.name : "UnknownError", code });
    return { accepted: false, reason: "delivery_failed" };
  }
}
