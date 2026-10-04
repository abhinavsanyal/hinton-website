import test from "node:test";
import assert from "node:assert/strict";
import { deliverViaFormSubmit } from "../src/lib/form-delivery.ts";

const enquiry = { name: "Studio test", email: "visitor@example.com", message: "A product film\nBudget: discussion", source: "project_brief", eventId: "test-reference" };
test("sends the complete brief to the fixed studio recipients with reply-to and table template", async () => {
  const request: typeof fetch = async (url, init) => {
    assert.equal(url, "https://formsubmit.co/ajax/abhinava@hintonstudios.com");
    const body = JSON.parse(String(init?.body));
    assert.equal(body._cc, "souvik@hintonstudios.com,avkash@hintonstudios.com");
    assert.equal(body._replyto, enquiry.email);
    assert.equal(body["Enquiry details"], enquiry.message);
    assert.equal(body["Submitted from"], enquiry.source);
    assert.equal(body.Reference, enquiry.eventId);
    assert.equal(body._template, "table");
    return Response.json({ success: "true" });
  };
  assert.deepEqual(await deliverViaFormSubmit(enquiry, request), { accepted: true });
});
test("activation and string false can never count as successful delivery", async () => {
  assert.deepEqual(await deliverViaFormSubmit(enquiry, async () => Response.json({ success: "false", message: "This form needs Activation." })), { accepted: false, reason: "activation_required" });
  assert.deepEqual(await deliverViaFormSubmit(enquiry, async () => Response.json({ success: "false" })), { accepted: false, reason: "delivery_failed" });
});
test("HTTP failures, malformed responses and network errors fail safely", async () => {
  for (const request of [
    async () => Response.json({success: "true"}, {status: 503}),
    async () => new Response("<html>Error</html>"),
    async () => Response.json(null),
    async () => { throw new Error("network timeout"); },
  ]) assert.deepEqual(await deliverViaFormSubmit(enquiry, request), { accepted: false, reason: "delivery_failed" });
});

test("hosting gateway rejection is distinguished from activation and ambiguous delivery", async () => {
  assert.deepEqual(await deliverViaFormSubmit(enquiry, async () => new Response("Forbidden", { status: 403, headers: { "Content-Type": "text/html" } })), { accepted: false, reason: "gateway_blocked" });
});

test("accepts the provider's valid JSON even when labelled text/html", async () => {
  assert.deepEqual(await deliverViaFormSubmit(enquiry, async () => new Response('{"success":"true"}', { headers: { "Content-Type": "text/html; charset=UTF-8" } })), { accepted: true });
});
