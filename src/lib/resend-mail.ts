/** Server-side transactional email adapter. Never imported by client components. */
export type StudioMail = {
  from: string; to: string; cc?: string; replyTo?: string;
  subject: string; text: string; html?: string;
};
export function createResendTransport(apiKey: string, request: typeof fetch = fetch) {
  return {
    async sendMail(mail: StudioMail) {
      const recipients = (value: string) => value.split(",").map(value => value.trim()).filter(Boolean);
      const response = await request("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: mail.from, to: recipients(mail.to), cc: mail.cc ? recipients(mail.cc) : undefined,
          reply_to: mail.replyTo, subject: mail.subject, text: mail.text, html: mail.html }),
        signal: AbortSignal.timeout(15000), cache: "no-store",
      });
      const body: unknown = await response.json();
      if (!response.ok || !body || typeof body !== "object" || !("id" in body) || typeof body.id !== "string" || !body.id) {
        // Provider bodies can contain email addresses; expose only a status code.
        throw new Error(`Email provider rejected delivery (${response.status})`);
      }
      return { accepted: recipients(mail.to), messageId: body.id };
    },
  };
}
