/**
 * Validated environment variables.
 *
 * `publicEnv` holds `NEXT_PUBLIC_*` values — inlined into the client bundle,
 * safe in the browser. `getServerEnv()` holds server-only values (secrets) —
 * never read it from client code; on the client those values are `undefined`.
 *
 * A missing/invalid variable fails fast with a clear zod error rather than
 * surfacing as a confusing runtime bug later.
 */

import { z } from "zod";

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_MEDIA_URL: z.string().url().optional(),
  NEXT_PUBLIC_GOOGLE_ADS_ID: z.string().regex(/^AW-\d+$/).optional(),
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().regex(/^\d+$/).optional(),
});

const serverSchema = z.object({
  /** Optional upstream the contact endpoint forwards leads to (CRM / webhook). */
  CONTACT_ENDPOINT: z.url().optional(),
  META_CAPI_ACCESS_TOKEN: z.string().optional(),
  META_GRAPH_API_VERSION: z.string().regex(/^v\d+\.0$/).optional(),
  META_TEST_EVENT_CODE: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.email().optional(),
});

/** Public env — safe to read anywhere (server or client). */
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MEDIA_URL: process.env.NEXT_PUBLIC_MEDIA_URL,
  NEXT_PUBLIC_GOOGLE_ADS_ID: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID,
  NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL: process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL,
  NEXT_PUBLIC_META_PIXEL_ID: process.env.NEXT_PUBLIC_META_PIXEL_ID,
});

let cachedServerEnv: z.infer<typeof serverSchema> | undefined;

/**
 * Server-only env. Call from route handlers / server code only — parsed
 * lazily so the client bundle never evaluates it.
 */
export function getServerEnv() {
  cachedServerEnv ??= serverSchema.parse({
    CONTACT_ENDPOINT: process.env.CONTACT_ENDPOINT,
    META_CAPI_ACCESS_TOKEN: process.env.META_CAPI_ACCESS_TOKEN,
    META_GRAPH_API_VERSION: process.env.META_GRAPH_API_VERSION,
    META_TEST_EVENT_CODE: process.env.META_TEST_EVENT_CODE,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
  });
  return cachedServerEnv;
}
