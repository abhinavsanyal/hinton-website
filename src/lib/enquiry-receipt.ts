import { z } from "zod";
export const RECEIPT_COOKIE = "hinton_enquiry_receipt";
export const receiptSchema = z.object({ eventId: z.uuid(), confirmationSent: z.boolean(), createdAt: z.number() });
export function readReceipt(value?: string) {
  if (!value) return null;
  try {
    const receipt = receiptSchema.parse(JSON.parse(value));
    return Date.now() - receipt.createdAt >= 0 && Date.now() - receipt.createdAt < 3600000 ? receipt : null;
  } catch { return null; }
}
