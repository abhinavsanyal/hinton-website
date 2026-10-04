import test from "node:test";
import assert from "node:assert/strict";
import { createResendTransport } from "../src/lib/resend-mail.ts";
const mail = { from: "enquiries@example.com", to: "studio@example.com", cc: "one@example.com,two@example.com", replyTo: "visitor@example.com", subject: "Test", text: "Brief" };
test("Resend sends fixed recipients, reply-to and requires a delivery ID", async () => {
  const transport = createResendTransport("test-key", async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.deepEqual(JSON.parse(String(init?.body)), { from: mail.from, to: [mail.to], cc: ["one@example.com", "two@example.com"], reply_to: mail.replyTo, subject: mail.subject, text: mail.text });
    assert.equal(new Headers(init?.headers).get("Authorization"), "Bearer test-key");
    return Response.json({ id: "accepted-message" });
  });
  assert.deepEqual(await transport.sendMail(mail), { accepted: [mail.to], messageId: "accepted-message" });
});
test("rejected, malformed, empty and network responses cannot report success", async () => {
  for (const request of [
    async () => Response.json({ id: "ignored", message: "private data" }, { status: 403 }),
    async () => Response.json({}), async () => Response.json({ id: "" }),
    async () => new Response("not JSON"), async () => { throw new Error("timeout"); },
  ]) await assert.rejects(createResendTransport("test-key", request).sendMail(mail));
});
